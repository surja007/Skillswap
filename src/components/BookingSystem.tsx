import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Calendar, Clock, User, Video, MessageSquare, MapPin, BookOpen, Plus, X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper functions for calendar
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
};

interface CalendarViewProps {
  currentDate: Date;
  sessions: any[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
}

const CalendarView = ({ currentDate, sessions, onNavigateMonth, onDateSelect }: CalendarViewProps) => {
  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getSessionsForDate = (date: Date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{formatMonthYear(currentDate)}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const daysSessions = date ? getSessionsForDate(date) : [];
          const isCurrentDay = date ? isToday(date) : false;
          
          return (
            <motion.div
              key={index}
              whileHover={date ? { scale: 1.05 } : {}}
              className={`
                aspect-square p-1 border border-border rounded-lg cursor-pointer transition-all
                ${date ? 'hover:bg-muted/50' : ''}
                ${isCurrentDay ? 'bg-primary/10 border-primary' : ''}
                ${daysSessions.length > 0 ? 'bg-accent/20' : ''}
              `}
              onClick={() => date && onDateSelect(date)}
            >
              {date && (
                <div className="h-full flex flex-col">
                  <div className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : 'text-foreground'}`}>
                    {date.getDate()}
                  </div>
                  {daysSessions.length > 0 && (
                    <div className="flex-1 flex flex-col gap-1 mt-1">
                      {daysSessions.slice(0, 2).map((session, idx) => (
                        <div
                          key={idx}
                          className="text-xs px-1 py-0.5 bg-primary/20 text-primary rounded truncate"
                          title={`${session.skill} with ${session.teacher} at ${session.time}`}
                        >
                          {session.time}
                        </div>
                      ))}
                      {daysSessions.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{daysSessions.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/10 border border-primary rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent/20 rounded"></div>
          <span>Has Sessions</span>
        </div>
      </div>
    </div>
  );
};

export const BookingSystem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    skill: '',
    teacher: '',
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    notes: ''
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  const loadUserSessions = async () => {
    try {
      setIsLoading(true);
      
      // Load sessions from localStorage
      const savedSessions = localStorage.getItem(`user_sessions_${user?.id}`);
      if (savedSessions) {
        setUpcomingSessions(JSON.parse(savedSessions));
      } else {
        setUpcomingSessions([]);
      }
      
      setAvailableSlots([]);
      
    } catch (error) {
      console.error('Error loading sessions:', error);
      setUpcomingSessions([]);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleNewSession = () => {
    setShowScheduleModal(true);
  };

  const handleFindTeachers = () => {
    // Navigate to profiles page to browse available teachers
    navigate('/profiles');
  };

  const handleViewCalendar = () => {
    setViewMode('calendar');
  };

  const handleScheduleSession = () => {
    if (!sessionForm.skill || !sessionForm.teacher || !sessionForm.date || !sessionForm.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newSession = {
      id: Date.now().toString(),
      skill: sessionForm.skill,
      teacher: sessionForm.teacher,
      date: new Date(sessionForm.date).toLocaleDateString(),
      time: sessionForm.time,
      duration: sessionForm.duration,
      type: sessionForm.type,
      status: 'pending',
      notes: sessionForm.notes,
      avatar: '/placeholder.svg'
    };

    const updatedSessions = [...upcomingSessions, newSession];
    setUpcomingSessions(updatedSessions);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`user_sessions_${user.id}`, JSON.stringify(updatedSessions));
    }

    // Reset form
    setSessionForm({
      skill: '',
      teacher: '',
      date: '',
      time: '',
      duration: '60',
      type: 'video',
      notes: ''
    });

    setShowScheduleModal(false);
    toast.success("Session scheduled successfully!");
  };

  const cancelSession = (sessionId: string) => {
    const updatedSessions = upcomingSessions.filter(session => session.id !== sessionId);
    setUpcomingSessions(updatedSessions);
    
    if (user) {
      localStorage.setItem(`user_sessions_${user.id}`, JSON.stringify(updatedSessions));
    }
    
    toast.success("Session cancelled successfully");
  };

  // Generate time slots for the time picker
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Learning Sessions</h1>
          <p className="text-xl text-muted-foreground">Manage your learning schedule and upcoming sessions</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-6 h-6 text-primary" />
                      Upcoming Sessions
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="text-xs"
                      >
                        List
                      </Button>
                      <Button
                        variant={viewMode === 'calendar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="text-xs"
                      >
                        <CalendarDays className="w-4 h-4 mr-1" />
                        Calendar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {viewMode === 'list' ? (
                    <>
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 rounded-lg border border-glass-border bg-muted/20 animate-pulse">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 bg-muted rounded-full" />
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 bg-muted rounded w-1/3" />
                                  <div className="h-3 bg-muted rounded w-1/2" />
                                </div>
                              </div>
                              <div className="flex gap-4 mb-4">
                                <div className="h-3 bg-muted rounded w-20" />
                                <div className="h-3 bg-muted rounded w-24" />
                              </div>
                              <div className="flex gap-2">
                                <div className="h-8 bg-muted rounded w-20" />
                                <div className="h-8 bg-muted rounded w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : upcomingSessions.length > 0 ? (
                        upcomingSessions.map((session, index) => (
                          <SessionCard key={session.id} session={session} index={index} onCancel={cancelSession} />
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                          <p className="text-muted-foreground mb-6">You don't have any scheduled learning sessions yet.</p>
                          <Button 
                            className="bg-gradient-primary text-white hover:scale-105 transition-transform"
                            onClick={handleScheduleNewSession}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Schedule Your First Session
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <CalendarView 
                      currentDate={currentDate}
                      sessions={upcomingSessions}
                      onNavigateMonth={navigateMonth}
                      onDateSelect={(date) => {
                        setSessionForm({...sessionForm, date: date.toISOString().split('T')[0]});
                        setShowScheduleModal(true);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      className="bg-gradient-primary text-white hover:scale-105 transition-transform h-16"
                      onClick={handleScheduleNewSession}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule New Session
                    </Button>
                    <Button 
                      variant="outline" 
                      className="hover:scale-105 transition-transform h-16"
                      onClick={handleFindTeachers}
                    >
                      <User className="w-5 h-5 mr-2" />
                      Find Teachers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="hover:scale-105 transition-transform h-16"
                      onClick={handleViewCalendar}
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Today's Available Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-3 rounded-lg border border-glass-border bg-muted/20 animate-pulse">
                          <div className="flex items-center justify-between">
                            <div className="h-4 bg-muted rounded w-16" />
                            <div className="h-5 bg-muted rounded w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="space-y-2">
                      {availableSlots.map((slot, index) => (
                        <motion.div
                          key={slot.time}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            slot.available 
                              ? 'border-accent bg-accent/10 hover:bg-accent/20' 
                              : 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{slot.time}</span>
                            <Badge variant={slot.available ? "default" : "secondary"} className="text-xs">
                              {slot.available ? "Available" : "Booked"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No available slots today</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-primary">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-white/80 text-sm">Sessions Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-secondary">
                    <div className="text-2xl font-bold text-white">8</div>
                    <div className="text-white/80 text-sm">Hours Learned</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-accent">
                    <div className="text-2xl font-bold text-white">5</div>
                    <div className="text-white/80 text-sm">New Skills</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Schedule Session Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Learning Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skill">Skill to Learn *</Label>
                  <Input
                    id="skill"
                    placeholder="e.g., React, Python, Guitar"
                    value={sessionForm.skill}
                    onChange={(e) => setSessionForm({...sessionForm, skill: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="teacher">Teacher Name *</Label>
                  <Input
                    id="teacher"
                    placeholder="e.g., John Smith"
                    value={sessionForm.teacher}
                    onChange={(e) => setSessionForm({...sessionForm, teacher: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={getMinDate()}
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Select value={sessionForm.time} onValueChange={(value) => setSessionForm({...sessionForm, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={sessionForm.duration} onValueChange={(value) => setSessionForm({...sessionForm, duration: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Session Type</Label>
                  <Select value={sessionForm.type} onValueChange={(value) => setSessionForm({...sessionForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific topics or requirements..."
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleSession}
                className="bg-gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface SessionCardProps {
  session: {
    id: string;
    teacher: string;
    skill: string;
    date: string;
    time: string;
    type: string;
    status: string;
    avatar: string;
    duration?: string;
    notes?: string;
  };
  index: number;
  onCancel: (sessionId: string) => void;
}

const SessionCard = ({ session, index, onCancel }: SessionCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="p-4 rounded-lg border border-glass-border bg-muted/20 hover:bg-muted/40 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={session.avatar} />
          <AvatarFallback className="bg-gradient-secondary text-white">
            {session.teacher.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">{session.teacher}</h3>
          <p className="text-sm text-primary font-medium">{session.skill}</p>
        </div>
      </div>
      <Badge 
        variant={session.status === 'confirmed' ? 'default' : 'secondary'}
        className={session.status === 'confirmed' ? 'bg-accent text-white' : ''}
      >
        {session.status}
      </Badge>
    </div>

    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span>{session.date}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>{session.time}</span>
      </div>
      <div className="flex items-center gap-1">
        {session.type === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
        <span className="capitalize">{session.type}</span>
      </div>
    </div>

    <div className="flex gap-2">
      <Button size="sm" className="bg-gradient-primary text-white hover:scale-105 transition-transform">
        <MessageSquare className="w-3 h-3 mr-1" />
        Message
      </Button>
      {session.type === 'video' && (
        <Button size="sm" variant="outline" className="hover:scale-105 transition-transform">
          <Video className="w-3 h-3 mr-1" />
          Join Call
        </Button>
      )}
      <Button 
        size="sm" 
        variant="destructive" 
        className="hover:scale-105 transition-transform"
        onClick={() => onCancel(session.id)}
      >
        <X className="w-3 h-3 mr-1" />
        Cancel
      </Button>
    </div>
  </motion.div>
);