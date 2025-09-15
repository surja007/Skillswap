import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "@/components/ui/back-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-4">
        <BackButton to="/" className="absolute top-4 left-4" />
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary-glow transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
