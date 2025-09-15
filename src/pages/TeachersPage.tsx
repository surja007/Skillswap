import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Star, MapPin, Clock, Users, MessageCircle, Calendar, Plus, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  availability: string;
  bio: string;
  experience: string;
  responseTime: string;
}

export const TeachersPage = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showBecomeTeacherModal, setShowBecomeTeacherModal] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    skills: '',
    hourlyRate: '',
    location: '',
    bio: '',
    experience: ''
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedSkill]);

  const loadTeachers = () => {
    // Load teachers from localStorage
    const savedTeachers = localStorage.getItem('skillswap_teachers');
    if (savedTeachers) {
      const teacherList = JSON.parse(savedTeachers);
      setTeachers(teacherList);
    } else {
      // Initialize with some sample teachers if none exist
      const sampleTeachers: Teacher[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sarah`,
          skills: ['React', 'JavaScript', 'TypeScript'],
          rating: 4.9,
          reviewCount: 127,
          hourlyRate: 45,
          location: 'San Francisco, CA',
          availability: 'Available now',
          bio: 'Full-stack developer with 8 years of experience. Passionate about teaching modern web development.',
          experience: '8 years',
          responseTime: '< 1 hour'
        },
        {
          id: '2',
          name: 'Michael Rodriguez',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=michael`,
          skills: ['Python', 'Machine Learning', 'Data Science'],
          rating: 4.8,
          reviewCount: 89,
          hourlyRate: 60,
          location: 'New York, NY',
          availability: 'Available weekends',
          bio: 'Data scientist and ML engineer. Love helping others break into the field of AI and data science.',
          experience: '6 years',
          responseTime: '< 2 hours'
        },
        {
          id: '3',
          name: 'Emily Johnson',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emily`,
          skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
          rating: 4.7,
          reviewCount: 156,
          hourlyRate: 40,
          location: 'Austin, TX',
          availability: 'Available evenings',
          bio: 'Senior UX designer with a passion for creating intuitive and beautiful user experiences.',
          experience: '10 years',
          responseTime: '< 30 minutes'
        }
      ];
      setTeachers(sampleTeachers);
      localStorage.setItem('skillswap_teachers', JSON.stringify(sampleTeachers));
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(teacher =>
        teacher.skills.some(skill => skill.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleBecomeTeacher = () => {
    if (!teacherForm.skills || !teacherForm.hourlyRate || !teacherForm.bio) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name: user?.name || 'Anonymous Teacher',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'teacher'}`,
      skills: teacherForm.skills.split(',').map(s => s.trim()),
      rating: 5.0,
      reviewCount: 0,
      hourlyRate: parseInt(teacherForm.hourlyRate),
      location: teacherForm.location || 'Remote',
      availability: 'Available now',
      bio: teacherForm.bio,
      experience: teacherForm.experience || 'New teacher',
      responseTime: '< 1 hour'
    };

    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    localStorage.setItem('skillswap_teachers', JSON.stringify(updatedTeachers));

    setTeacherForm({
      skills: '',
      hourlyRate: '',
      location: '',
      bio: '',
      experience: ''
    });

    setShowBecomeTeacherModal(false);
    toast.success("Your teacher profile has been created successfully!");
  };

  const getAllSkills = () => {
    const allSkills = teachers.flatMap(teacher => teacher.skills);
    return [...new Set(allSkills)].sort();
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Find Teachers</h1>
              <p className="text-muted-foreground">Connect with expert teachers and learn new skills</p>
            </div>
            <Button 
              onClick={() => setShowBecomeTeacherModal(true)}
              className="bg-gradient-primary text-white hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Become a Teacher
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search teachers, skills, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Skills</SelectItem>
                    {getAllSkills().map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teachers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredTeachers.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No teachers found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedSkill 
                    ? "Try adjusting your search criteria" 
                    : "Be the first to become a teacher in your area!"
                  }
                </p>
                <Button 
                  onClick={() => setShowBecomeTeacherModal(true)}
                  className="bg-gradient-primary text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Become a Teacher
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <TeacherCard key={teacher.id} teacher={teacher} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Become Teacher Modal */}
        <Dialog open={showBecomeTeacherModal} onOpenChange={setShowBecomeTeacherModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Become a Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Skills you can teach *</label>
                <Input
                  placeholder="e.g., React, Python, Guitar (comma separated)"
                  value={teacherForm.skills}
                  onChange={(e) => setTeacherForm({...teacherForm, skills: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Hourly Rate ($) *</label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={teacherForm.hourlyRate}
                    onChange={(e) => setTeacherForm({...teacherForm, hourlyRate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={teacherForm.location}
                    onChange={(e) => setTeacherForm({...teacherForm, location: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Input
                  placeholder="e.g., 5 years"
                  value={teacherForm.experience}
                  onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio *</label>
                <textarea
                  className="w-full p-3 border border-border rounded-md resize-none"
                  rows={3}
                  placeholder="Tell students about your expertise and teaching style..."
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({...teacherForm, bio: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBecomeTeacherModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBecomeTeacher}
                className="bg-gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface TeacherCardProps {
  teacher: Teacher;
  index: number;
}

const TeacherCard = ({ teacher, index }: TeacherCardProps) => {
  const handleContact = () => {
    toast.success(`Your message has been sent to ${teacher.name}. They'll respond within ${teacher.responseTime}.`);
  };

  const handleBookSession = () => {
    toast.success(`Redirecting to book a session with ${teacher.name}...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="glass-card h-full hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          {/* Teacher Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="bg-gradient-primary text-white text-lg">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{teacher.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                  <span className="text-xs text-muted-foreground">({teacher.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{teacher.location}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {teacher.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {teacher.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {teacher.bio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{teacher.responseTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">{teacher.experience}</span>
            </div>
          </div>

          {/* Price and Availability */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary">${teacher.hourlyRate}</span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
              {teacher.availability}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 hover:scale-105 transition-transform"
              onClick={handleContact}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Message
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-primary text-white hover:scale-105 transition-transform"
              onClick={handleBookSession}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Book Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
