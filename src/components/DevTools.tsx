import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useStore";
import { generateSeedData } from "@/utils/seedData";

export const DevTools = () => {
  // Only show in development
  if (!import.meta.env.DEV) return null;
  const { session } = useAuth();

  const handleSeed = () => {
    if (confirm("⚠️ This will clear all existing data and generate test data. Continue?")) {
      generateSeedData();
      toast.success("Test data generated successfully!");
    }
  };

  const handleTestInsert = async () => {
    if (!session?.user) {
      toast.error("Not logged in");
      return;
    }
    console.log("Testing insert for user:", session.user.id);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: session.user.id,
        name: "Debug Project",
        color: "#ff0000",
      })
      .select();

    if (error) {
      console.error("Test Insert Error:", error);
      toast.error("Insert Failed: " + error.message);
    } else {
      toast.success("Insert Success!");
    }
  };

  const handleTestRead = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      console.error("Auth Check Failed:", authError);
      toast.error("Auth Check Failed");
      return;
    }
    console.log("Fresh Auth User ID:", authData.user.id);
    console.log("Stored Session ID:", session?.user?.id);

    if (authData.user.id !== session?.user?.id) {
      toast.error("ID MISMATCH! Sign out and in.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();
    if (error) {
      console.error("Test Read Error:", error);
      toast.error("Read Profile Failed: " + error.message);
    } else {
      console.log("Profile Read:", data);
      toast.success("Read Profile Success!");
    }
  };

  // Use a high z-index to ensure it stays on top
  return (
    <div className="fixed bottom-4 right-4 z-[99999] flex gap-2">
      <Button
        onClick={handleTestRead}
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 shadow-lg bg-background border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        title="Test Profile Read"
      >
        📖
      </Button>
      <Button
        onClick={handleTestInsert}
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 shadow-lg bg-background border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        title="Test Database Insert"
      >
        📥
      </Button>
      <Button
        onClick={handleSeed}
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 shadow-lg bg-background border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        title="Reset & Generate Test Data"
      >
        🧪
      </Button>
    </div>
  );
};
