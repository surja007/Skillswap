import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received chat request:', { message, userId });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user context from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: userSkills } = await supabase
      .from('user_skills')
      .select(`
        *,
        skills (name, category, description)
      `)
      .eq('user_id', userId);

    const { data: userInterests } = await supabase
      .from('user_interests')
      .select(`
        *,
        skills (name, category, description)
      `)
      .eq('user_id', userId);

    const { data: allSkills } = await supabase
      .from('skills')
      .select('*')
      .limit(50);

    // Build context for AI
    const userContext = {
      profile: profile || { display_name: 'User' },
      skills: userSkills || [],
      interests: userInterests || [],
      availableSkills: allSkills || []
    };

    const systemPrompt = `You are an AI Learning Mentor for SkillSwap, a peer-to-peer skill exchange platform. Your role is to help users:

1. Find the perfect skill exchange matches
2. Suggest learning paths and resources
3. Schedule learning sessions
4. Track progress and achievements
5. Provide personalized recommendations

User Context:
- Name: ${userContext.profile.display_name || 'User'}
- Bio: ${userContext.profile.bio || 'No bio available'}
- Skills they can teach: ${userContext.skills.map(s => s.skills?.name).join(', ') || 'None listed'}
- Skills they want to learn: ${userContext.interests.map(i => i.skills?.name).join(', ') || 'None listed'}

Available skills in platform: ${userContext.availableSkills.map(s => s.name).join(', ')}

Guidelines:
- Be encouraging, helpful, and personalized
- Suggest specific matches when relevant
- Provide actionable learning advice
- Keep responses concise but informative
- Focus on skill exchange opportunities
- Mention achievements and gamification elements when appropriate

Current user message: ${message}`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "I'm having trouble connecting right now. Please try again in a moment. In the meantime, feel free to explore your profile and browse available skills!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});