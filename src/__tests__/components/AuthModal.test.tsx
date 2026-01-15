import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModal } from '@/components/AuthModal';

// Mock the useAuth hook since it will be used by the modal
vi.mock('@/store/useStore', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe('AuthModal', () => {
  it('should render login form by default', () => {
    render(<AuthModal open={true} onOpenChange={() => {}} />);
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeDefined();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('should toggle to sign up form', () => {
    render(<AuthModal open={true} onOpenChange={() => {}} />);
    
    const toggleButton = screen.getByText(/create an account/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined();
  });
});
