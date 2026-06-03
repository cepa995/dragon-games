import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const toggle = vi.fn();
const push = vi.fn();

vi.mock('@/lib/account/favorites-actions', () => ({
  toggleFavoriteAction: (...args: unknown[]) => toggle(...args),
}));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push }) }));

import { FavoriteButton } from './favorite-button';

afterEach(() => {
  toggle.mockReset();
  push.mockReset();
});

describe('FavoriteButton', () => {
  it('toggles favorited state on click', async () => {
    toggle.mockResolvedValue({ favorited: true });
    const user = userEvent.setup();
    render(<FavoriteButton productId="p1" label="Fav" />);

    const button = screen.getByRole('button', { name: 'Fav' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);
    expect(toggle).toHaveBeenCalledWith('p1');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('sends guests to login', async () => {
    toggle.mockResolvedValue({ needsAuth: true });
    const user = userEvent.setup();
    render(<FavoriteButton productId="p2" label="Fav" />);

    await user.click(screen.getByRole('button', { name: 'Fav' }));
    expect(push).toHaveBeenCalledWith('/login');
    expect(screen.getByRole('button', { name: 'Fav' })).toHaveAttribute('aria-pressed', 'false');
  });
});
