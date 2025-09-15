import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { Bot, MessageCircle, Send, Sparkles, Loader2, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  type: "ai" | "user";
  content: string;
  timestamp: string;
}

export const ChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content: "Hello! I'm your AI learning mentor powered by Gemini 2.5 Pro. I can help you find study resources, suggest learning paths, and connect you with the perfect skill exchange partners. What would you like to learn today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  const suggestedQuestions = [
    "Find me Python teachers",
    "Suggest study materials for React", 
    "Schedule a learning session",
    "What skills should I learn next?"
  ];

  // Load recent chats from database
  useEffect(() => {
    if (user) {
      loadRecentChats();
    }
  }, [user]);

  const loadRecentChats = async () => {
    if (!user) return;

    const { data: connections } = await supabase
      .from('connections') 
      .select('*')
      .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(5);

    if (connections) {
      // Get additional data for each connection
      const chatData = await Promise.all(
        connections.map(async (conn) => {
          const otherUserId = conn.teacher_id === user.id ? conn.learner_id : conn.teacher_id;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', otherUserId)
            .single();

          const { data: skill } = await supabase
            .from('skills')
            .select('name')
            .eq('id', conn.skill_id)
            .single();

          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content')
            .eq('connection_id', conn.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            name: profile?.display_name || 'Unknown User',
            skill: skill?.name || 'General', 
            lastMessage: lastMessage?.content || 'No messages yet',
            online: Math.random() > 0.5, // Random for demo
            avatar_url: profile?.avatar_url
          };
        })
      );

      setRecentChats(chatData);
    }
  };

  const generateLocalAIResponse = (userMessage: string, user: any): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello ${user.name || 'there'}! 👋 I'm your AI Learning Mentor. I'm here to help you find skill exchange partners, suggest learning paths, and guide you through your SkillSwap journey. What would you like to learn today?`;
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you with:\n\n🎯 Finding skill exchange partners\n📚 Suggesting learning resources\n📅 Planning your learning schedule\n🏆 Tracking your progress\n💡 Personalized recommendations\n\nWhat specific area would you like help with?";
    }
    
    if (lowerMessage.includes('react')) {
      return "React Study Materials & Learning Path 📚⚛️\n\n**Essential Resources:**\n• Official React Documentation (react.dev)\n• React Tutorial for Beginners\n• Modern React with Hooks & Context\n• React Router for Navigation\n• State Management (Redux/Zustand)\n\n**Recommended Learning Path:**\n1. JavaScript ES6+ fundamentals\n2. React components & JSX\n3. Props & State management\n4. Hooks (useState, useEffect, custom hooks)\n5. React Router & Navigation\n6. API integration & data fetching\n7. Testing with Jest & React Testing Library\n\n**Practice Projects:**\n• Todo App with local storage\n• Weather App with API integration\n• E-commerce product catalog\n• Social media dashboard\n\nWould you like me to help you find a React teacher on SkillSwap?";
    }
    
    if (lowerMessage.includes('study materials') || lowerMessage.includes('resources')) {
      return "Looking for study materials? 📖 I can suggest resources for popular skills!\n\nTry asking me about specific technologies like:\n• \"React study materials\"\n• \"Python learning resources\"\n• \"JavaScript fundamentals\"\n• \"UI/UX design guides\"\n• \"Data science materials\"\n\nWhat specific skill would you like study materials for?";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      return "Great! Learning new skills is exciting! 🚀\n\nHere's how I can help:\n• Browse available teachers in your area\n• Match you with compatible learning partners\n• Suggest structured learning paths\n• Help you schedule sessions\n\nWhat skill are you most interested in learning?";
    }
    
    if (lowerMessage.includes('teacher') || lowerMessage.includes('find')) {
      return "Looking for teachers? Perfect! 👨‍🏫👩‍🏫\n\nI can help you:\n• Find teachers for specific skills\n• Check their availability and ratings\n• Connect you with compatible learning styles\n• Schedule your first session\n\nTry visiting the 'Find Teachers' section or tell me what skill you want to learn!";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      return "Ready to schedule a learning session? 📅\n\nHere's what you can do:\n• Browse available time slots\n• Book video or in-person sessions\n• Set up recurring learning schedules\n• Get automatic reminders\n\nWould you like me to guide you through the booking process?";
    }
    
    // Default response
    return `Thanks for your message! 🤖 I'm your AI Learning Mentor, and I'm here to help you make the most of SkillSwap.\n\nI can assist with finding teachers, scheduling sessions, tracking progress, and much more. What would you like to explore today?\n\nTry asking me about:\n• "Help me find a teacher"\n• "How do I schedule a session?"\n• "What skills can I learn?"`;
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || isLoading) return;

    const userMessage: Message = {
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // For now, use a simple local AI simulation until Gemini API is configured
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const aiResponse = generateLocalAIResponse(message, user);
      
      const aiMessage: Message = {
        type: "ai", 
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        type: "ai",
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="container mx-auto max-w-7xl">
        <BackButton to="/" />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">AI Learning Mentor</h1>
          <p className="text-muted-foreground">Get personalized learning guidance and skill recommendations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 xl:grid-cols-4 gap-6"
        >
          {/* AI Chat - Main Section */}
          <div className="xl:col-span-3">
            <Card className="glass-card h-[70vh] flex flex-col">
              <CardHeader className="border-b border-glass-border">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center animate-glow">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  AI Learning Mentor
                  <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(70vh-200px)] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Bot className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to AI Learning Mentor!</h3>
                      <p className="text-muted-foreground max-w-md">
                        Ask me about learning resources, finding teachers, scheduling sessions, or any skill-related questions.
                      </p>
                    </div>
                  )}
                  
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className={`${msg.type === 'ai' ? 'w-10 h-10' : 'w-9 h-9'} flex-shrink-0`}>
                        {msg.type === 'ai' ? (
                          <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-gradient-secondary text-white text-sm">
                              {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div className={`flex-1 max-w-[85%] ${msg.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 rounded-2xl shadow-sm ${
                            msg.type === 'ai' 
                              ? 'bg-muted/50 text-foreground border border-muted' 
                              : 'bg-gradient-primary text-white ml-auto'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {msg.content}
                          </div>
                        </motion.div>
                        <p className={`text-xs text-muted-foreground mt-2 ${
                          msg.type === 'user' ? 'text-right pr-2' : 'pl-2'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </Avatar>
                      <div className="flex-1 max-w-[85%]">
                        <div className="p-4 rounded-2xl bg-muted/50 border border-muted flex items-center gap-3">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Section */}
                <div className="p-6 border-t border-glass-border bg-muted/20">
                  {/* Suggested Questions */}
                  {messages.length === 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-3">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <motion.button
                            key={question}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMessage(question)}
                            className="text-xs px-4 py-2 rounded-full bg-gradient-primary/10 text-primary hover:bg-gradient-primary hover:text-white transition-all duration-200 border border-primary/20"
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask your AI mentor anything..."
                      className="flex-1 h-12 bg-background border-2 border-muted focus:border-primary transition-colors text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      disabled={isLoading}
                    />
                    <Button 
                      className="bg-gradient-primary text-white hover:scale-105 transition-transform"
                      onClick={sendMessage}
                      disabled={isLoading}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Features Sidebar */}
          <div className="space-y-6">
            {/* AI Features */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-accent" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-gradient-primary/5 border border-primary/20 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Learning Path</p>
                      <p className="text-xs text-muted-foreground">Get personalized roadmaps</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-gradient-secondary/5 border border-secondary/20 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Find Teachers</p>
                      <p className="text-xs text-muted-foreground">Match with experts</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-accent/5 border border-accent/20 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Schedule Sessions</p>
                      <p className="text-xs text-muted-foreground">Book learning time</p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Recent Chats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageCircle className="w-5 h-5" />
                  Recent Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentChats.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No recent chats yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start connecting with teachers!
                    </p>
                  </div>
                ) : (
                  recentChats.map((chat, index) => (
                  <motion.div
                    key={chat.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="p-3 rounded-lg border border-glass-border hover:bg-muted/50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          {chat.avatar_url ? (
                            <AvatarImage src={chat.avatar_url} />
                          ) : (
                            <AvatarFallback className="bg-gradient-secondary text-white">
                              {chat.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{chat.name}</p>
                        <p className="text-xs text-primary">{chat.skill}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};