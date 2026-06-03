import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Force the reduced-motion branch: components must render their content plainly.
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, useReducedMotion: () => true };
});

import { Reveal, Stagger, StaggerItem } from './reveal';

describe('motion primitives under reduced motion', () => {
  it('Reveal renders its content without animation', () => {
    render(
      <Reveal>
        <p>revealed content</p>
      </Reveal>,
    );
    expect(screen.getByText('revealed content')).toBeVisible();
  });

  it('Stagger and StaggerItem render their content', () => {
    render(
      <Stagger>
        <StaggerItem>
          <span>item one</span>
        </StaggerItem>
        <StaggerItem>
          <span>item two</span>
        </StaggerItem>
      </Stagger>,
    );
    expect(screen.getByText('item one')).toBeVisible();
    expect(screen.getByText('item two')).toBeVisible();
  });
});
