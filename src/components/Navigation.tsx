import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCircle, MessageSquare, Calendar, Trophy, LogOut, Settings, User, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 w-full z-50 glass-card border-b border-glass-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-2xl font-bold text-gradient">SkillSwap</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/profiles" icon={UserCircle} label="Profiles" />
            <NavLink href="/teachers" icon={Users} label="Teachers" />
            <NavLink href="/chat" icon={MessageSquare} label="Chat" />
            <NavLink href="/booking" icon={Calendar} label="Booking" />
            <NavLink href="/achievements" icon={Trophy} label="Achievements" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-foreground">
                Welcome, <span className="font-medium text-primary">{user?.name}</span>
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
  >
    <Icon className="w-4 h-4" />
    <span className="font-medium">{label}</span>
  </motion.a>
);