import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

import { StarterProductCard } from './starter-product-card';

const product = {
  id: '1',
  slug: 'mtg-foundations-play-booster-box',
  nameSr: 'MTG Foundations kutija',
  nameEn: 'MTG Foundations Box',
  priceRsd: 18500,
  image: '/images/products/mtg-foundations-box.jpg',
};

describe('StarterProductCard', () => {
  it('links into the catalog product page', () => {
    render(<StarterProductCard product={product} locale="sr" ctaLabel="Pogledaj" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/mtg-foundations-play-booster-box');
  });

  it('shows the localized name and formatted price', () => {
    render(<StarterProductCard product={product} locale="en" ctaLabel="View" />);
    expect(screen.getByText('MTG Foundations Box')).toBeInTheDocument();
    expect(screen.getByText(/18[.,]500 RSD/)).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('falls back to the Serbian name when English is missing', () => {
    render(
      <StarterProductCard product={{ ...product, nameEn: null }} locale="en" ctaLabel="View" />,
    );
    expect(screen.getByText('MTG Foundations kutija')).toBeInTheDocument();
  });
});
