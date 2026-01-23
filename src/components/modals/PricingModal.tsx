import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUmami } from "@/hooks/useUmami";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useStore";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRO_FEATURES = [
  "Multi-device synchronization",
  "Real-time cloud backup",
  "Priority support",
  "Advanced productivity insights",
  "Custom project icons & colors",
];

const PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || "price_pro_monthly"; // Fallback/Placeholder

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { track } = useUmami();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      return;
    }

    setLoading(true);
    track("checkout_start");
    try {
      const returnUrl = `${window.location.origin + import.meta.env.BASE_URL}#/app`;
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId: PRICE_ID, returnUrl },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(error.message || "Failed to start checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer" />

        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center font-bold">Upgrade to Pro</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              Unlock the full potential of TaskFlow and take your productivity to the next level.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mb-8">
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-3xl font-bold">€5</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No hidden fees.
              </p>
            </div>

            <div className="space-y-3">
              {PRO_FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 bg-success/10 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className={cn(
              "w-full h-12 text-base font-semibold transition-all duration-300",
              "bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2 fill-primary-foreground" />
                Get Pro Now
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground mt-4">
            Secure payments processed by Stripe. By upgrading, you agree to our Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
