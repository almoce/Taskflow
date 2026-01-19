import { ChevronLeft, ChevronRight, Key, LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthModal } from "@/components/modals/AuthModal";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUmami } from "@/hooks/useUmami";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAuth, useUI } from "@/store/useStore";

interface SidebarFooterProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export const SidebarFooter = ({ collapsed, toggleCollapsed }: SidebarFooterProps) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user, signOut, isPro } = useAuth();
  const { track } = useUmami();
  const { setIsPricingModalOpen } = useUI();

  const handleManageSubscription = async () => {
    try {
      const returnUrl = `${window.location.origin + import.meta.env.BASE_URL}#/app`;
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: { returnUrl },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast.error(error.message || "Failed to open customer portal");
    }
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="p-2 border-t border-border space-y-2">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-12 px-2 hover:bg-accent flex items-center",
                collapsed ? "justify-center" : "justify-start gap-3",
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] h-3.5 px-1 py-0 pointer-events-none shadow-sm z-10 whitespace-nowrap",
                    isPro &&
                      "bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white",
                    !isPro && "bg-background border border-border text-muted-foreground",
                  )}
                >
                  {isPro ? "PRO" : "FREE"}
                </Badge>
              </div>

              {!collapsed && (
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-xs font-medium truncate w-32 whitespace-nowrap">
                    {user.email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56" side={collapsed ? "right" : "top"}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-3 cursor-pointer focus:bg-accent"
              onClick={() => {
                if (isPro) {
                  handleManageSubscription();
                  track("manage_subscription");
                } else {
                  setIsPricingModalOpen(true);
                  track("upgrade_modal_open");
                }
              }}
            >
              <Badge
                variant={isPro ? "default" : "secondary"}
                className="text-[10px] whitespace-nowrap"
              >
                {isPro ? "Pro Plan" : "Free Plan"}
              </Badge>
              <span className="text-xs font-medium whitespace-nowrap">
                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setChangePasswordOpen(true)}
              className="gap-2 cursor-pointer"
            >
              <Key className="h-4 w-4" />
              Change Password
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-red-500 gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className={cn("w-full", collapsed ? "px-0" : "px-4")}
              onClick={() => {
                setAuthOpen(true);
                track("auth_modal_open");
              }}
            >
              {collapsed ? <User className="h-4 w-4" /> : "Sign In"}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isPro ? "Data is syncing" : "Sign in to sync your data (Pro)"}</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Button
        variant="ghost"
        size="sm"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className={cn(
          "w-full h-8 px-2 text-muted-foreground hover:text-foreground",
          collapsed ? "justify-center" : "justify-start",
        )}
        onClick={toggleCollapsed}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Collapse</span>
          </>
        )}
      </Button>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
};
