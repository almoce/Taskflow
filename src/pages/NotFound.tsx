import { m } from "framer-motion";
import { ArrowLeft, Ghost } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the error but don't disrupt the user experience
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mb-8 flex h-64 w-64 items-center justify-center"
        >
          {/* Floating blobs for atmosphere */}
          <m.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
          />

          <m.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <Ghost className="h-32 w-32 text-primary" />
            <m.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -right-2 top-0 text-4xl font-bold text-primary"
            >
              ?
            </m.div>
          </m.div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">Page Not Found</h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Oops! It seems this task has slipped into the void. <br />
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Button asChild size="lg" className="group">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to Home
            </Link>
          </Button>
        </m.div>
      </div>
    </div>
  );
};

export default NotFound;
