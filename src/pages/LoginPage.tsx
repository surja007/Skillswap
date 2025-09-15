import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Eye, EyeOff, BookOpen, Users, Zap, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success("Welcome back to SkillSwap!");
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      if (!formData.name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      const success = await register(formData.email, formData.password, formData.name);
      if (success) {
        toast.success("Welcome to SkillSwap! Your account has been created.");
      } else {
        toast.error("Email already exists or registration failed");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gradient">SkillSwap</h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Learn Anything,
              <br />
              <span className="text-gradient">Teach Anything,</span>
              <br />
              Anytime.
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Join our AI-powered peer-to-peer learning platform where knowledge flows freely between passionate learners and teachers.
            </p>

            {/* Feature Pills */}
            <div className="hidden lg:flex flex-col gap-4">
              <FeaturePill icon={BookOpen} text="AI-Powered Skill Matching" />
              <FeaturePill icon={Users} text="Global Learning Community" />
              <FeaturePill icon={Zap} text="Instant Connections & Chat" />
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-card shadow-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">
                  {isLogin ? "Welcome Back" : "Join SkillSwap"}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? "Sign in to continue your learning journey" 
                    : "Create your account and start learning today"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 bg-muted/50 border-glass-border"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-muted/50 border-glass-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-muted/50 border-glass-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary text-white hover:scale-105 transition-transform shadow-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({ email: "", password: "", name: "" });
                    }}
                    className="text-primary hover:text-primary-glow transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface FeaturePillProps {
  icon: React.ElementType;
  text: string;
}

const FeaturePill = ({ icon: Icon, text }: FeaturePillProps) => (
  <motion.div
    whileHover={{ scale: 1.05, x: 10 }}
    className="flex items-center space-x-3 p-3 glass-card rounded-lg"
  >
    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="font-medium text-foreground">{text}</span>
  </motion.div>
);