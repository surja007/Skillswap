import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const StatsSection = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    skillsTaught: 0,
    matchRate: 95,
    learningHours: 0
  });

  useEffect(() => {
    loadStatsFromDatabase();
  }, []);

  const loadStatsFromDatabase = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total skills
      const { count: skillCount } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true });

      // Get total sessions for learning hours calculation
      const { count: sessionCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeUsers: userCount || 12,
        skillsTaught: skillCount || 45,
        matchRate: 95, // Keep static for now
        learningHours: (sessionCount || 8) * 60 // Assuming 60 minutes per session
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Keep default values if database fails
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Be part of a revolutionary learning ecosystem where knowledge flows freely between peers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard
            number={stats.activeUsers}
            label="Active Learners"
            suffix="+"
            delay={0}
            color="from-primary to-primary-glow"
          />
          <StatCard
            number={stats.skillsTaught}
            label="Skills Available"
            suffix="+"
            delay={0.1}
            color="from-secondary to-secondary-glow"
          />
          <StatCard
            number={stats.matchRate}
            label="Match Success Rate"
            suffix="%"
            delay={0.2}
            color="from-accent to-accent-glow"
          />
          <StatCard
            number={stats.learningHours}
            label="Learning Hours"
            suffix="+"
            delay={0.3}
            color="from-primary to-secondary"
          />
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  number: number;
  label: string;
  suffix: string;
  delay: number;
  color: string;
}

const StatCard = ({ number, label, suffix, delay, color }: StatCardProps) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startNumber = 0;

    const updateNumber = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(startNumber + (number - startNumber) * easeOutQuart);
      
      setDisplayNumber(currentNumber);
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    updateNumber();
  }, [number, isInView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      onViewportEnter={() => setIsInView(true)}
      whileHover={{ scale: 1.05, y: -10 }}
      className="text-center p-8 glass-card group cursor-default"
    >
      <motion.div
        className={`w-20 h-1 mx-auto rounded-full bg-gradient-to-r ${color} mb-6 group-hover:animate-glow`}
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: delay + 0.2 }}
      />
      
      <motion.div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        {displayNumber.toLocaleString()}{suffix}
      </motion.div>
      
      <div className="text-lg text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};