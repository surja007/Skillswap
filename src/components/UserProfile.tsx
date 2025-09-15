import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { MessageCircle, Calendar, Star, Award, BookOpen, Users, Camera, Upload, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const UserProfile = () => {
  const { user, updateAvatar } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || "/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [skillsToTeach, setSkillsToTeach] = useState<string[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [skillType, setSkillType] = useState<'teach' | 'learn'>('teach');
  const [newSkill, setNewSkill] = useState('');

  // Load skills from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedTeachSkills = localStorage.getItem(`user_teach_skills_${user.id}`);
      const savedLearnSkills = localStorage.getItem(`user_learn_skills_${user.id}`);
      
      if (savedTeachSkills) {
        setSkillsToTeach(JSON.parse(savedTeachSkills));
      }
      if (savedLearnSkills) {
        setSkillsToLearn(JSON.parse(savedLearnSkills));
      }
    }
  }, [user]);
  
  const profileData = {
    name: user?.name || "User",
    avatar: currentAvatar,
    rating: 0.0,
    completedSessions: 0,
    level: "Beginner",
    skillsToTeach,
    skillsToLearn,
    achievements: [],
    bio: "Welcome to SkillSwap! Update your profile to get started.",
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCurrentAvatar(imageUrl);
      updateAvatar(imageUrl); // Persist to localStorage and AuthContext
      setShowPhotoOptions(false);
      setIsUploading(false);
      
      toast({
        title: "Photo updated!",
        description: "Your profile photo has been updated successfully.",
      });
      
      // TODO: Here you would typically upload to your backend/storage service
      // For now, we're persisting to localStorage via AuthContext
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setCurrentAvatar("/placeholder.svg");
    updateAvatar("/placeholder.svg"); // Persist to localStorage and AuthContext
    setShowPhotoOptions(false);
    toast({
      title: "Photo removed",
      description: "Profile photo has been reset to default.",
    });
  };

  const addSkill = (type: 'teach' | 'learn') => {
    setSkillType(type);
    setShowAddSkillModal(true);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !user) return;

    const skill = newSkill.trim();
    
    if (skillType === 'teach') {
      if (skillsToTeach.includes(skill)) {
        toast({
          title: "Skill already exists",
          description: "This skill is already in your teaching list.",
          variant: "destructive"
        });
        return;
      }
      const updatedSkills = [...skillsToTeach, skill];
      setSkillsToTeach(updatedSkills);
      localStorage.setItem(`user_teach_skills_${user.id}`, JSON.stringify(updatedSkills));
    } else {
      if (skillsToLearn.includes(skill)) {
        toast({
          title: "Skill already exists",
          description: "This skill is already in your learning list.",
          variant: "destructive"
        });
        return;
      }
      const updatedSkills = [...skillsToLearn, skill];
      setSkillsToLearn(updatedSkills);
      localStorage.setItem(`user_learn_skills_${user.id}`, JSON.stringify(updatedSkills));
    }

    setNewSkill('');
    setShowAddSkillModal(false);
    toast({
      title: "Skill added!",
      description: `Added "${skill}" to your ${skillType === 'teach' ? 'teaching' : 'learning'} skills.`,
    });
  };

  const removeSkill = (skill: string, type: 'teach' | 'learn') => {
    if (!user) return;

    if (type === 'teach') {
      const updatedSkills = skillsToTeach.filter(s => s !== skill);
      setSkillsToTeach(updatedSkills);
      localStorage.setItem(`user_teach_skills_${user.id}`, JSON.stringify(updatedSkills));
    } else {
      const updatedSkills = skillsToLearn.filter(s => s !== skill);
      setSkillsToLearn(updatedSkills);
      localStorage.setItem(`user_learn_skills_${user.id}`, JSON.stringify(updatedSkills));
    }

    toast({
      title: "Skill removed",
      description: `Removed "${skill}" from your ${type === 'teach' ? 'teaching' : 'learning'} skills.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="container mx-auto max-w-7xl">
        <BackButton to="/" />
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">User Profile</h1>
          <p className="text-muted-foreground">Manage your skills, achievements, and learning journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Header */}
          <Card className="glass-card mb-8 overflow-hidden shadow-xl">
            <div className="h-40 bg-gradient-hero relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <CardContent className="relative pt-0 pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col xl:flex-row items-center xl:items-end gap-8 -mt-20"
              >
                <div className="relative group">
                  <Avatar className="w-36 h-36 border-6 border-background shadow-2xl">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white text-3xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Photo Update Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                    className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-primary rounded-full border-4 border-background flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </motion.button>

                  {/* Photo Options Menu */}
                  {showPhotoOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-background border border-border rounded-lg shadow-xl p-2 min-w-[200px] z-10"
                    >
                      <div className="space-y-1">
                        <button
                          onClick={triggerFileSelect}
                          disabled={isUploading}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          Upload new photo
                        </button>
                        {profileData.avatar !== "/placeholder.svg" && (
                          <button
                            onClick={removePhoto}
                            disabled={isUploading}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Remove photo
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-2 left-2 w-8 h-8 bg-accent rounded-full border-4 border-background flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex-1 text-center xl:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-3">{profileData.name}</h1>
                    <div className="flex flex-wrap justify-center xl:justify-start gap-6 mb-4">
                      <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{profileData.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="font-medium">{profileData.completedSessions} sessions</span>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-primary text-white px-4 py-2 text-sm">
                        {profileData.level}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{profileData.bio}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-primary text-white hover:scale-105 transition-all duration-200 shadow-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat
                  </Button>
                  <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-200 border-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Session
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Skills I Can Teach */}
            <SkillCard
              title="Skills I Can Teach"
              skills={profileData.skillsToTeach}
              icon={Users}
              gradient="from-primary to-primary-glow"
              delay={0.3}
              emptyMessage="Add skills you can teach to help others learn"
              onAddSkill={() => addSkill('teach')}
              onRemoveSkill={(skill) => removeSkill(skill, 'teach')}
            />

            {/* Skills I Want to Learn */}
            <SkillCard
              title="Skills I Want to Learn"
              skills={profileData.skillsToLearn}
              icon={BookOpen}
              gradient="from-secondary to-secondary-glow"
              delay={0.4}
              emptyMessage="Add skills you want to learn from others"
              onAddSkill={() => addSkill('learn')}
              onRemoveSkill={(skill) => removeSkill(skill, 'learn')}
            />

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent to-accent-glow flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">{profileData.completedSessions}</div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">{profileData.achievements.length}</div>
                      <div className="text-sm text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-1">{profileData.rating}</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Award className="w-6 h-6 text-accent" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData.achievements.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No achievements yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Complete sessions, help others learn, and unlock achievements to showcase your progress!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileData.achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="p-4 bg-gradient-to-r from-accent/10 to-accent-glow/10 rounded-lg border border-accent/20 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-glow flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{achievement}</p>
                            <p className="text-xs text-muted-foreground">Achievement unlocked</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Add Skill Modal */}
        <Dialog open={showAddSkillModal} onOpenChange={setShowAddSkillModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Add {skillType === 'teach' ? 'Teaching' : 'Learning'} Skill
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter skill name (e.g., React, Python, Guitar)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSkillModal(false);
                  setNewSkill('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
                className="bg-gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface SkillCardProps {
  title: string;
  skills: string[];
  icon: React.ElementType;
  gradient: string;
  delay: number;
  emptyMessage: string;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
}

const SkillCard = ({ title, skills, icon: Icon, gradient, delay, emptyMessage, onAddSkill, onRemoveSkill }: SkillCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={onAddSkill}>
              Add Skills
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <Badge 
                  variant="outline" 
                  className="skill-badge px-3 py-1 text-sm hover:bg-muted/50 transition-colors cursor-pointer pr-8"
                >
                  {skill}
                  <button
                    onClick={() => onRemoveSkill(skill)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 + skills.length * 0.05 }}
            >
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onAddSkill}>
                + Add More
              </Button>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);