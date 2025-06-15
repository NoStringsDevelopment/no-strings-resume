
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button data-testid="test-button">Click me</Button>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should apply variant styles', () => {
    render(<Button variant="destructive" data-testid="delete-btn">Delete</Button>);
    const button = screen.getByTestId('delete-btn');
    expect(button).toHaveClass('bg-destructive');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled data-testid="disabled-btn">Disabled</Button>);
    const button = screen.getByTestId('disabled-btn');
    expect(button).toBeDisabled();
  });

  it('should support data-testid for reliable testing', () => {
    render(<Button data-testid="reliable-test-btn">Test Button</Button>);
    expect(screen.getByTestId('reliable-test-btn')).toBeInTheDocument();
  });
});
