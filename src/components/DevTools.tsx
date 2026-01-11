
import { generateSeedData } from '@/utils/seedData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const DevTools = () => {
    // Only show in development
    if (!import.meta.env.DEV) return null;

    const handleSeed = () => {
        if (confirm('⚠️ This will clear all existing data and generate test data. Continue?')) {
            generateSeedData();
            toast.success('Test data generated successfully!');
        }
    };

    // Use a high z-index to ensure it stays on top
    return (
        <div className="fixed bottom-4 left-4 z-[99999]">
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
