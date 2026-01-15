import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectSidebar } from '@/components/ProjectSidebar';

// Mock useAuth
const useAuthMock = vi.fn();
vi.mock('@/store/useStore', () => ({
  useAuth: () => useAuthMock(),
}));

describe('ProjectSidebar Auth Integration', () => {
  it('should show Sign In button when not logged in', () => {
    useAuthMock.mockReturnValue({ user: null });
    
    render(
      <ProjectSidebar 
        projects={[]} 
        selectedProjectId={null} 
        activeView="tasks"
        onSelectProject={() => {}}
        onSetActiveView={() => {}}
        onEditProject={() => {}}
        onDeleteProject={() => {}}
        onNewProject={() => {}}
        onExport={() => {}}
      />
    );
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('should show User Avatar when logged in', () => {
    useAuthMock.mockReturnValue({ 
      user: { email: 'test@example.com' },
      signOut: vi.fn()
    });
    
    render(
      <ProjectSidebar 
        projects={[]} 
        selectedProjectId={null} 
        activeView="tasks"
        onSelectProject={() => {}}
        onSetActiveView={() => {}}
        onEditProject={() => {}}
        onDeleteProject={() => {}}
        onNewProject={() => {}}
        onExport={() => {}}
      />
    );
    
    expect(screen.getByText('TE')).toBeDefined(); // Initials for TEst@...
    expect(screen.getByText('test@example.com')).toBeDefined();
    expect(screen.getByText('Free')).toBeDefined();
  });
});
