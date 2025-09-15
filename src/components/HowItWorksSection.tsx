import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Calendar, MessageCircle, Trophy, Star } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      icon: UserPlus,
      title: "Sign Up & Create Profile",
      description: "Create your account and build a comprehensive profile showcasing your skills and learning goals.",
      details: ["Add skills you can teach", "List skills you want to learn", "Set your availability", "Upload profile picture"],
      color: "from-primary to-primary-glow"
    },
    {
      step: "2", 
      icon: Search,
      title: "AI-Powered Matching",
      description: "Our Gemini 2.5 Pro AI analyzes your profile to find perfect skill exchange partners in your area.",
      details: ["Smart skill matching", "Location-based results", "Compatibility scoring", "Personalized recommendations"],
      color: "from-secondary to-secondary-glow"
    },
    {
      step: "3",
      icon: MessageCircle,
      title: "Connect & Chat",
      description: "Message potential learning partners to discuss your goals and plan your skill exchange sessions.",
      details: ["Real-time messaging", "AI conversation starters", "Share learning resources", "Build connections"],
      color: "from-accent to-accent-glow"
    },
    {
      step: "4",
      icon: Calendar,
      title: "Schedule Sessions",
      description: "Book learning sessions with integrated calendar management and automated reminders.",
      details: ["Flexible scheduling", "Video or in-person options", "Automated reminders", "Session management"],
      color: "from-primary to-secondary"
    },
    {
      step: "5",
      icon: Trophy,
      title: "Learn & Earn Rewards",
      description: "Attend sessions, track your progress, and earn achievements as you master new skills.",
      details: ["Progress tracking", "Achievement badges", "Skill certifications", "Community recognition"],
      color: "from-secondary to-accent"
    },
    {
      step: "6",
      icon: Star,
      title: "Review & Grow",
      description: "Rate your sessions, build your reputation, and become a trusted member of the learning community.",
      details: ["Session feedback", "Reputation building", "Skill verification", "Community growth"],
      color: "from-accent to-primary"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/10">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            How SkillSwap Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From signup to mastery - discover how our AI-powered platform makes skill sharing simple, 
            effective, and rewarding for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className="interactive-card h-full relative overflow-hidden">
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={`bg-gradient-to-r ${step.color} text-white font-bold text-lg px-3 py-1`}>
                    {step.step}
                  </Badge>
                </div>

                <CardContent className="p-6 pt-8">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + detailIndex * 0.05 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`} />
                        <span>{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>

                {/* Decorative gradient overlay */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} opacity-60`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-glass-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of learners and teachers who are already exchanging skills, 
              building connections, and achieving their goals on SkillSwap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🤖 AI-Powered Matching
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🎯 Personalized Learning
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🏆 Gamified Experience
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🌍 Global Community
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
