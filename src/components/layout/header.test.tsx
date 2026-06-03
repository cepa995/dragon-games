import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '../../../messages/sr.json';

const replace = vi.fn();

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
  useRouter: () => ({ replace }),
  usePathname: () => '/',
}));

// The language switcher syncs the choice to the DB via a server action; mock it
// so the test doesn't pull the Auth.js/server chain into jsdom.
vi.mock('@/lib/account/actions', () => ({ setLocalePreferenceAction: vi.fn() }));

import { Header } from './header';

function renderHeader() {
  return render(
    <NextIntlClientProvider locale="sr" messages={messages}>
      <Header />
    </NextIntlClientProvider>,
  );
}

describe('Header', () => {
  it('renders the localized primary navigation', () => {
    renderHeader();
    for (const label of ['Katalog', 'Turniri', 'Vesti', 'Vodiči', 'Kontakt']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup();
    renderHeader();

    const openButton = screen.getByRole('button', { name: 'Otvori meni' });
    expect(openButton).toHaveAttribute('aria-expanded', 'false');

    // Mobile panel adds a second <nav>; both share the 'Katalog' accessible name.
    expect(screen.getAllByRole('navigation', { name: 'Katalog' })).toHaveLength(1);

    await user.click(openButton);
    expect(screen.getByRole('button', { name: 'Zatvori meni' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getAllByRole('navigation', { name: 'Katalog' })).toHaveLength(2);
  });
});
