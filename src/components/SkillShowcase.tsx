import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SkillCategory {
  category: string;
  skills: string[];
  color: string;
}

export const SkillShowcase = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colorClasses = [
    "from-primary to-primary-glow",
    "from-secondary to-secondary-glow", 
    "from-accent to-accent-glow",
    "from-primary to-secondary",
  ];

  useEffect(() => {
    loadSkillsFromDatabase();
  }, []);

  const loadSkillsFromDatabase = async () => {
    try {
      const { data: skills, error } = await supabase
        .from('skills')
        .select('name, category')
        .order('category');

      if (error) throw error;

      if (skills) {
        // Group skills by category
        const groupedSkills = skills.reduce((acc: Record<string, string[]>, skill) => {
          const category = skill.category || 'General';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(skill.name);
          return acc;
        }, {});

        // Convert to array format with colors
        const categories: SkillCategory[] = Object.entries(groupedSkills).map(([category, skills], index) => ({
          category,
          skills: skills.slice(0, 6), // Limit to 6 skills per category for display
          color: colorClasses[index % colorClasses.length]
        }));

        setSkillCategories(categories);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
      // Fallback to default categories if database fails
      setSkillCategories([
        {
          category: "Programming",
          skills: ["React", "Python", "TypeScript", "Node.js", "Machine Learning", "Data Science"],
          color: "from-primary to-primary-glow",
        },
        {
          category: "Design", 
          skills: ["UI/UX", "Figma", "Photoshop", "3D Modeling", "Animation", "Branding"],
          color: "from-secondary to-secondary-glow",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Popular Skills to Learn & Teach
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the most in-demand skills in our community and find your perfect learning match.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="interactive-card h-full">
                <CardContent className="p-6">
                  <div className="w-full h-2 rounded-full bg-muted animate-pulse mb-4" />
                  <div className="h-6 bg-muted rounded animate-pulse mb-4" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-6 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card className="interactive-card h-full">
                <CardContent className="p-6">
                  <motion.div
                    className={`w-full h-2 rounded-full bg-gradient-to-r ${category.color} mb-4`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: categoryIndex * 0.2 }}
                  />
                  <h3 className="text-xl font-bold mb-4 text-foreground">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.3, 
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="skill-badge cursor-pointer"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};