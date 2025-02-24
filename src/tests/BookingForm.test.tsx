import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingForm } from '../components/BookingForm';

describe('BookingForm', () => {
  it('should render form elements correctly', () => {
    render(<BookingForm onSubmit={() => {}} buttonText="Book Now" />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Book Now');
  });

  it('should handle form submission correctly', () => {
    const mockSubmit = vi.fn();
    render(<BookingForm onSubmit={mockSubmit} buttonText="Book Now" />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(mockSubmit).toHaveBeenCalledWith('John Doe', 'john@example.com');
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('should require both name and email fields', () => {
    render(<BookingForm onSubmit={() => {}} buttonText="Book Now" />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
  });
});