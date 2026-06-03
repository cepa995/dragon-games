import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePageSr from './page';

describe('Serbian home placeholder', () => {
  it('renders the club heading and identity', () => {
    render(<HomePageSr />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/TCG i board games klub/i);
    expect(screen.getByText('Dragon Games')).toBeInTheDocument();
  });
});
