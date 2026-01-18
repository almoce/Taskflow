import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUmami } from "@/hooks/useUmami";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useStore";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const { setSession } = useAuth();
  const { track } = useUmami();

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsLogin(true);
    }
  }, [open]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    try {
      let error;
      if (isLogin) {
        const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        error = signInError;
        if (sessionData.session) {
          setSession(sessionData.session);
          track("auth_login");
          onOpenChange(false);
          toast.success("Welcome back!");
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#/app`,
          },
        });
        error = signUpError;
        if (!error) {
          track("auth_signup");
          setSuccessEmail(data.email);
          setIsSuccess(true);
        }
      }

      if (error) {
        toast.error(error.message);
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? "Success" : isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {isSuccess
              ? ""
              : isLogin
                ? "Enter your credentials to access your account."
                : "Sign up to sync your tasks across devices."}
          </DialogDescription>
        </DialogHeader>
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-2xl">✓</div>
            <h3 className="text-lg font-semibold">Account Created Successfully</h3>
            <p>Verification email sent to {successEmail}</p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the link to verify your account.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Don't have an account? Create an account"
                    : "Already have an account? Sign In"}
                </Button>
                {isLogin && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground hover:text-primary"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
