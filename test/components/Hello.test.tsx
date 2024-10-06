import Hello from '@/components/Hello';
import { render, screen } from '@testing-library/react';

describe('Hello Component', () => {
  it('renders the correct greeting message', () => {
    render(<Hello name="Next.js" />);
    expect(screen.getByText('Hello, Next.js!')).toBeInTheDocument();
  });
});
