import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageCircle, Calendar, Trophy, Users, Zap } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Skill Matching",
      description: "Our Gemini 2.5 Pro AI analyzes your skills and learning goals to find perfect exchange partners.",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: MessageCircle,
      title: "Smart AI Mentor",
      description: "Get personalized learning resources, study tips, and conversation starters powered by AI.",
      gradient: "from-secondary to-secondary-glow",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book learning sessions with intuitive calendar integration and automated reminders.",
      gradient: "from-accent to-accent-glow",
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn badges, level up, and track your progress with an engaging achievement system.",
      gradient: "from-primary to-secondary",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a vibrant community of learners and teachers from around the world.",
      gradient: "from-secondary to-accent",
    },
    {
      icon: Zap,
      title: "Instant Connections",
      description: "Real-time chat and video calls to start learning immediately with your matched peers.",
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Everything You Need to Learn
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powered by cutting-edge AI technology and designed for seamless peer-to-peer learning experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
  };
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, rotateY: 5 }}
    className="group"
  >
    <Card className="interactive-card h-full border-glass-border">
      <CardHeader className="text-center pb-4">
        <motion.div
          className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-4 group-hover:animate-float`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <feature.icon className="w-full h-full text-white" />
        </motion.div>
        <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-center">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);