import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { neonClient } from '../client';
import {
  AuthUIContext,
  SignedIn,
  SignedOut,
  UserAvatar,
} from '@neondatabase/neon-js/auth/react';

export function AnonymousTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<unknown>(null);

  // Link account form state
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkName, setLinkName] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const { hooks } = useContext(AuthUIContext);
  const { data: session, refetch } = hooks.useSession();

  // Check if user is anonymous (cast to access isAnonymous property)
  const isAnonymous: boolean =
    session?.user && 'isAnonymous' in session.user
      ? Boolean(session?.user?.isAnonymous)
      : false;

  const handleSignInAnonymously = async () => {
    setIsLoading(true);
    setError(null);
    setLastResponse(null);

    try {
      const response = await neonClient.auth.signIn.anonymous();
      setLastResponse(response);

      if (response.error) {
        setError(response.error.message || 'Anonymous sign-in failed');
      } else {
        // Refetch session to update UI
        refetch();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLastResponse({ error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await neonClient.auth.signOut();
      setLastResponse(null);
      setError(null);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLinking(true);
    setError(null);
    setLastResponse(null);

    try {
      const response = await neonClient.auth.signIn.email({
        email: linkEmail,
        password: linkPassword,
      });

      setLastResponse(response);

      if (response.error) {
        setError(response.error.message || 'Link account failed');
      } else {
        // Clear form and refetch session
        setLinkEmail('');
        setLinkPassword('');
        setLinkName('');
        refetch();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLastResponse({ error: errorMessage });
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div style={styles.container} className="anonymous-container">
      <div style={styles.card} className="anonymous-card">
        <div style={styles.header}>
          <span style={styles.icon} className="anonymous-icon">
            👻
          </span>
          <h1 style={styles.title} className="anonymous-title">
            Anonymous Sign In
          </h1>
          <p style={styles.subtitle}>
            We support anonymous sign-in! Try out the app without creating an
            account first.
          </p>
        </div>

        {/* Current Auth State */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Current Session</h2>

          <SignedOut>
            <div style={styles.statusBadge}>
              <span style={styles.statusDot} />
              Not authenticated
            </div>
          </SignedOut>

          <SignedIn>
            <div style={styles.sessionInfo} className="anonymous-session-info">
              <UserAvatar
                user={session?.user}
                style={{ width: 48, height: 48, flexShrink: 0 }}
              />
              <div style={styles.sessionDetails}>
                <p style={styles.sessionLabel}>Signed in as:</p>
                <p style={styles.sessionValue}>
                  {session?.user?.name ||
                    session?.user?.email ||
                    'Anonymous User'}
                </p>
                <p style={styles.sessionMeta}>
                  ID:{' '}
                  <code style={styles.code} className="anonymous-code">
                    {session?.user?.id}
                  </code>
                </p>
                {isAnonymous && (
                  <span style={styles.anonymousBadge}>Anonymous</span>
                )}
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Actions</h2>

          <div style={styles.actions}>
            <SignedOut>
              <button
                onClick={handleSignInAnonymously}
                disabled={isLoading}
                style={{
                  ...styles.primaryButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <>
                    <span style={styles.spinner} />
                    Signing in...
                  </>
                ) : (
                  '👻 Sign In Anonymously'
                )}
              </button>
            </SignedOut>

            <SignedIn>
              <button
                onClick={handleSignInAnonymously}
                disabled={isLoading}
                style={{
                  ...styles.secondaryButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Loading...' : '🔄 Try Again (new anonymous)'}
              </button>

              <button
                onClick={handleSignOut}
                disabled={isLoading}
                style={{
                  ...styles.dangerButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                Sign Out
              </button>
            </SignedIn>
          </div>
        </div>

        {isAnonymous ? (
          <LinkAccountForm
            linkEmail={linkEmail}
            setLinkEmail={setLinkEmail}
            linkPassword={linkPassword}
            setLinkPassword={setLinkPassword}
            linkName={linkName}
            setLinkName={setLinkName}
            isLinking={isLinking}
            onSubmit={handleLinkAccount}
          />
        ) : null}

        {/* Error Display */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <div>
              <p style={styles.errorTitle}>Error</p>
              <p style={styles.errorMessage}>{error}</p>
            </div>
          </div>
        )}

        {/* Response Display */}
        {lastResponse !== null ? (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Last Response</h2>
            <pre style={styles.responseBox}>
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        ) : null}

        {/* Back Link */}
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .anonymous-container {
            padding: 1.5rem 1rem !important;
          }
          .anonymous-card {
            padding: 1.5rem !important;
            border-radius: 0.75rem !important;
          }
          .anonymous-title {
            font-size: 1.25rem !important;
          }
          .anonymous-icon {
            font-size: 2.5rem !important;
          }
          .anonymous-session-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .anonymous-code {
            font-size: 0.6rem !important;
            word-break: break-all !important;
          }
        }
      `}</style>
    </div>
  );
}

function LinkAccountForm({
  linkEmail,
  setLinkEmail,
  linkPassword,
  setLinkPassword,
  linkName,
  setLinkName,
  isLinking,
  onSubmit,
}: {
  linkEmail: string;
  setLinkEmail: (v: string) => void;
  linkPassword: string;
  setLinkPassword: (v: string) => void;
  linkName: string;
  setLinkName: (v: string) => void;
  isLinking: boolean;
  onSubmit: (e: React.FormEvent) => void;
}): React.ReactNode {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>🔗 Link Account</h2>
      <p style={styles.linkDescription}>
        Convert your anonymous account to a permanent account by providing your
        email and password.
      </p>

      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="linkEmail" style={styles.label}>
            Email
          </label>
          <input
            id="linkEmail"
            type="email"
            value={linkEmail}
            onChange={(e) => setLinkEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="linkPassword" style={styles.label}>
            Password
          </label>
          <input
            id="linkPassword"
            type="password"
            value={linkPassword}
            onChange={(e) => setLinkPassword(e.target.value)}
            placeholder="Choose a password"
            required
            minLength={8}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="linkName" style={styles.label}>
            Name <span style={styles.optional}>(optional)</span>
          </label>
          <input
            id="linkName"
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="Your name"
            style={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isLinking || !linkEmail || !linkPassword}
          style={{
            ...styles.linkButton,
            opacity: isLinking || !linkEmail || !linkPassword ? 0.7 : 1,
            cursor:
              isLinking || !linkEmail || !linkPassword
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {isLinking ? (
            <>
              <span style={styles.spinner} />
              Linking account...
            </>
          ) : (
            '🔗 Link Account'
          )}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '3rem 1rem',
    background:
      'radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)',
  },
  card: {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  title: {
    color: 'var(--foreground)',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.5rem',
  },
  subtitle: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    margin: 0,
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--secondary)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--muted-foreground)',
  },
  sessionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--secondary)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  sessionDetails: {
    flex: 1,
    minWidth: 0,
  },
  sessionLabel: {
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    margin: '0 0 0.25rem',
  },
  sessionValue: {
    color: 'var(--foreground)',
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 0.25rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sessionMeta: {
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    margin: 0,
  },
  code: {
    backgroundColor: 'var(--muted)',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
  },
  anonymousBadge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
    color: 'var(--primary)',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '0.25rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  dangerButton: {
    width: '100%',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: 'var(--destructive)',
    border:
      '1px solid color-mix(in oklch, var(--destructive) 30%, transparent)',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid var(--muted)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
    border:
      '1px solid color-mix(in oklch, var(--destructive) 30%, transparent)',
    borderRadius: 'var(--radius)',
    marginBottom: '1.5rem',
  },
  errorIcon: {
    fontSize: '1.25rem',
  },
  errorTitle: {
    color: 'var(--destructive)',
    fontSize: '0.875rem',
    fontWeight: 600,
    margin: '0 0 0.25rem',
  },
  errorMessage: {
    color: 'var(--destructive)',
    fontSize: '0.875rem',
    margin: 0,
    opacity: 0.8,
  },
  responseBox: {
    backgroundColor: 'var(--muted)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    margin: 0,
    overflow: 'auto',
    maxHeight: '200px',
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    color: 'var(--muted-foreground)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    marginTop: '1rem',
  },
  linkDescription: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  label: {
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  optional: {
    color: 'var(--muted-foreground)',
    fontWeight: 400,
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
  },
};
