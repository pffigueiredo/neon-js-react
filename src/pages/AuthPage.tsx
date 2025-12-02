import { useParams, Link } from 'react-router-dom';
import { AuthView } from '@neondatabase/neon-auth-ui';

export default function AuthPage() {
  const { pathname } = useParams();

  // Don't show extra UI for callback and sign-out routes
  const isMinimalView = ['callback', 'sign-out'].includes(pathname || '');

  return (
    <main style={styles.main}>
      <AuthView pathname={pathname} />

      {/* Additional info below auth card */}
      {!isMinimalView && (
        <div style={styles.footer}>
          <p style={styles.poweredBy}>
            Powered by{' '}
            <a
              href="https://better-auth.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkGreen}
            >
              Better Auth
            </a>
            {' + '}
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkCyan}
            >
              Neon
            </a>
          </p>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem 1rem',
    gap: '1.5rem',
  },
  footer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  poweredBy: {
    fontSize: '0.75rem',
    color: 'rgba(113, 113, 122, 1)',
    margin: 0,
  },
  linkGreen: {
    color: 'rgba(16, 185, 129, 1)',
    textDecoration: 'underline',
  },
  linkCyan: {
    color: 'rgba(6, 182, 212, 1)',
    textDecoration: 'underline',
  },
  backLink: {
    color: 'rgba(161, 161, 170, 1)',
    textDecoration: 'none',
    fontSize: '0.875rem',
  },
};
