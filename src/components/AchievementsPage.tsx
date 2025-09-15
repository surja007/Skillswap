import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Star, Award, Target, BookOpen, Users, Zap, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  date?: string;
  progress?: number;
  total?: number;
  points: number;
  rarity: string;
}

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    nextLevelPoints: 500,
    currentLevelPoints: 0,
    sessionsCompleted: 0,
    skillsTaught: 0,
    skillsLearned: 0,
    rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievementsAndStats();
    }
  }, [user]);

  const loadAchievementsAndStats = async () => {
    if (!user) return;

    try {
      // Load achievements from database
      const { data: dbAchievements } = await supabase
        .from('achievements')
        .select('*');

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', user.id);

      // Load user stats
      const { count: sessionsCompleted } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .or(`connections.teacher_id.eq.${user.id},connections.learner_id.eq.${user.id}`);

      const { count: skillsTaught } = await supabase
        .from('user_skills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: skillsLearned } = await supabase
        .from('user_interests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate stats
      const earnedAchievements = userAchievements?.length || 0;
      const totalPoints = earnedAchievements * 200; // 200 points per achievement for now
      const level = Math.floor(totalPoints / 500) + 1;

      setStats({
        totalPoints,
        level,
        nextLevelPoints: level * 500,
        currentLevelPoints: (level - 1) * 500,
        sessionsCompleted: sessionsCompleted || 0,
        skillsTaught: skillsTaught || 0,
        skillsLearned: skillsLearned || 0,
        rating: 4.5 // Default rating
      });

      // Map achievements with earned status
      const mappedAchievements: Achievement[] = (dbAchievements || []).map(ach => {
        const earned = userAchievements?.some(ua => ua.achievement_id === ach.id);
        const earnedAchievement = userAchievements?.find(ua => ua.achievement_id === ach.id);
        
        return {
          id: ach.id,
          name: ach.name,
          description: ach.description || '',
          icon: getIconForType(ach.type),
          earned: !!earned,
          date: earned ? new Date(earnedAchievement?.earned_at || '').toLocaleDateString() : undefined,
          points: 200, // Fixed points for now
          rarity: ach.type || 'common'
        };
      });

      setAchievements(mappedAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'sessions': return BookOpen;
      case 'connections': return Users;
      case 'skills': return Star;
      case 'ratings': return Crown;
      default: return Trophy;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-muted to-muted-foreground';
      case 'uncommon': return 'from-accent to-accent-glow';
      case 'rare': return 'from-primary to-primary-glow';
      case 'epic': return 'from-secondary to-secondary-glow';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-muted to-muted-foreground';
    }
  };

  const progressToNextLevel = ((stats.totalPoints - stats.currentLevelPoints) / (stats.nextLevelPoints - stats.currentLevelPoints)) * 100;

  return (
    <div className="min-h-screen bg-background p-4 pt-24">
      <div className="container mx-auto max-w-6xl">
        <BackButton to="/" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Achievements</h1>
          <p className="text-xl text-muted-foreground">Track your learning journey and celebrate your progress</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Overview */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-foreground">
                    <Trophy className="w-6 h-6 text-accent" />
                    Level {stats.level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">{stats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to Level {stats.level + 1}</span>
                      <span className="text-primary font-medium">{Math.round(progressToNextLevel)}%</span>
                    </div>
                    <Progress value={progressToNextLevel} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{stats.currentLevelPoints}</span>
                      <span>{stats.nextLevelPoints}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-glass-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.sessionsCompleted}</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{stats.skillsTaught}</div>
                      <div className="text-xs text-muted-foreground">Skills Taught</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{stats.skillsLearned}</div>
                      <div className="text-xs text-muted-foreground">Skills Learned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">{stats.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievement */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-accent text-sm">Latest Achievement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-glow rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Mentor Master</div>
                      <div className="text-sm text-muted-foreground">Dec 12, 2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">All Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard = ({ achievement, index }: AchievementCardProps) => {
  const rarityColor = achievement.earned 
    ? {
        'common': 'from-muted to-muted-foreground',
        'uncommon': 'from-accent to-accent-glow',
        'rare': 'from-primary to-primary-glow',
        'epic': 'from-secondary to-secondary-glow',
        'legendary': 'from-yellow-400 to-yellow-600'
      }[achievement.rarity] || 'from-muted to-muted-foreground'
    : 'from-muted/50 to-muted/50';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      whileHover={{ scale: achievement.earned ? 1.05 : 1.02, y: -5 }}
      className={`relative p-4 rounded-lg border transition-all ${
        achievement.earned 
          ? 'border-glass-border bg-muted/20 hover:bg-muted/40' 
          : 'border-muted/30 bg-muted/10 opacity-60'
      }`}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r ${rarityColor}`} />
      
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${rarityColor}`}>
          <achievement.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
            {achievement.name}
          </h3>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>
      </div>

      {achievement.earned ? (
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            +{achievement.points} pts
          </Badge>
          <span className="text-xs text-muted-foreground">{achievement.date}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {achievement.progress !== undefined && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{achievement.progress}/{achievement.total}</span>
              </div>
              <Progress 
                value={(achievement.progress! / achievement.total!) * 100} 
                className="h-1" 
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-muted text-muted-foreground">
              {achievement.points} pts
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              {achievement.rarity}
            </Badge>
          </div>
        </div>
      )}
    </motion.div>
  );
};