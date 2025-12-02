import {
  SignedIn,
  SignedOut,
  UserButton,
  AuthLoading,
} from '@neondatabase/neon-auth-ui';
import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header style={styles.header}>
      {/* Logo / Brand */}
      <Link to="/" style={styles.brand}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandText}>Neon Auth Demo</span>
      </Link>

      {/* Navigation */}
      <nav style={styles.nav}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            ...styles.navLink,
            ...(isActive ? styles.navLinkActive : {}),
          })}
        >
          Home
        </NavLink>
        <SignedIn>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/account/settings"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            Settings
          </NavLink>
        </SignedIn>
      </nav>

      {/* Auth Section */}
      <div style={styles.authSection}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Loading State */}
        <AuthLoading>
          <div style={styles.skeleton} />
        </AuthLoading>

        {/* Signed Out State */}
        <SignedOut>
          <Link to="/auth/sign-in" style={styles.navLink}>
            Sign In
          </Link>
          <Link to="/auth/sign-up" style={styles.primaryButton}>
            Get Started
          </Link>
        </SignedOut>

        {/* Signed In State */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'color-mix(in oklch, var(--card) 90%, transparent)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    height: '64px',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--foreground)',
  },
  logo: {
    fontSize: '1.5rem',
  },
  brandText: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    color: 'var(--muted-foreground)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
  },
  navLinkActive: {
    color: 'var(--primary)',
    fontWeight: 600,
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  skeleton: {
    height: '36px',
    width: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--muted)',
    animation: 'pulse 2s infinite',
  },
  primaryButton: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
};
