
import { taskStore } from '../hooks/useTaskStore';
import { PROJECT_COLORS, Priority, TaskTag, TaskStatus } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_TEMPLATES = [
    { name: 'Website Redesign', description: 'Overhaul the company website with modern design', icon: '🎨' },
    { name: 'Mobile App', description: 'Develop iOS and Android applications', icon: '📱' },
    { name: 'Marketing Campaign', description: 'Q4 Marketing push', icon: '🚀' },
    { name: 'Backend Migration', description: 'Migrate legacy backend to Node.js', icon: '🔧' },
    { name: 'Team Offsite', description: 'Plan the annual team retreat', icon: '🌴' },
];

const TASK_TITLES = [
    'Design Homepage', 'Implement Login', 'Fix Navigation Bug', 'Write Documentation',
    'Setup Database', 'Create API Endpoints', 'Test Payment Gateway', 'Optimize Images',
    'Code Review', 'Deploy to Staging', 'User Interview', 'Analyze Metrics'
];

const DESCRIPTIONS = [
    'Need to ensure pixel perfect implementation.',
    'Follow the design specs attached in Figma.',
    'Critical priority, affects all users.',
    'Take your time but ensure high quality.',
    'Coordinate with the design team.'
];

const TAGS: TaskTag[] = ['Feature', 'Bug', 'Improvement'];
const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

export const generateSeedData = () => {
    const store = taskStore.getState();

    // 1. Clear existing data
    store.reset();

    // 2. Generate Projects
    PROJECT_TEMPLATES.forEach((tmpl, index) => {
        // some projects use icon, some modify color
        const color = PROJECT_COLORS[index % PROJECT_COLORS.length];
        // Randomize if we look for icon or color
        const useIcon = Math.random() > 0.3;

        // addProject automatically generates ID and sets it as selected
        const project = store.addProject(
            tmpl.name,
            tmpl.description,
            color,
            useIcon ? tmpl.icon : undefined
        );

        // 3. Generate Tasks for this project
        const numTasks = Math.floor(Math.random() * 5) + 3; // 3 to 7 tasks

        for (let i = 0; i < numTasks; i++) {
            const title = getRandomItem(TASK_TITLES);
            const priority = getRandomItem(PRIORITIES);
            const tag = getRandomItem(TAGS);

            const task = store.addTask(project.id, title, priority, tag);

            // Update task with more details
            const status = getRandomItem(STATUSES);
            const description = getRandomItem(DESCRIPTIONS);
            const dueDate = Math.random() > 0.3 ? getRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) : undefined; // Next 7 days

            const updates: any = {
                description,
                status,
                dueDate
            };

            if (status === 'done') {
                updates.completedAt = new Date().toISOString();
            }

            store.updateTask(task.id, updates);
        }
    });

    console.log('Seed data generated successfully');
};
