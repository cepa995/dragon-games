import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/datetime', () => ({ isOpenNow: vi.fn(() => true) }));

import { isOpenNow } from '@/lib/datetime';
import { OpenNowIndicator } from './open-now-indicator';

const weekly = { '3': { open: '15:00', close: '21:00' } };

describe('OpenNowIndicator', () => {
  it('shows the open label when currently open', async () => {
    vi.mocked(isOpenNow).mockReturnValue(true);
    render(
      <OpenNowIndicator
        weekly={weekly}
        initialOpen={false}
        openLabel="Otvoreno"
        closedLabel="Zatvoreno"
      />,
    );
    // The effect re-evaluates on mount and flips to the live (open) value.
    expect(await screen.findByText('Otvoreno')).toBeInTheDocument();
  });

  it('shows the closed label when currently closed', async () => {
    vi.mocked(isOpenNow).mockReturnValue(false);
    render(
      <OpenNowIndicator
        weekly={weekly}
        initialOpen={true}
        openLabel="Otvoreno"
        closedLabel="Zatvoreno"
      />,
    );
    expect(await screen.findByText('Zatvoreno')).toBeInTheDocument();
  });

  it('exposes a polite live status region', () => {
    render(<OpenNowIndicator weekly={weekly} initialOpen={false} openLabel="O" closedLabel="Z" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
