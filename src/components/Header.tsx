import {
  SignedIn,
  SignedOut,
  UserButton,
  AuthLoading,
} from '@neondatabase/neon-auth-ui';
import { Link } from 'react-router-dom';
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
        <Link to="/" style={styles.navLink}>
          Home
        </Link>
        <SignedIn>
          <Link to="/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/account/settings" style={styles.navLink}>
            Settings
          </Link>
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
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
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
    color: 'var(--text-primary)',
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
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
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
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 2s infinite',
  },
  primaryButton: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
};
