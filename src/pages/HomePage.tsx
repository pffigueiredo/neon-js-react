import {
  SignedIn,
  SignedOut,
  AuthLoading,
  UserAvatar,
} from '@neondatabase/neon-auth-ui';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthUIContext } from '@neondatabase/neon-auth-ui';

export function HomePage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          <span style={styles.gradient}>Neon Auth UI</span>
          <br />
          Demo Application
        </h1>
        <p style={styles.subtitle}>
          A comprehensive demonstration of all client-side authentication
          features. Explore social logins, magic links, passkeys, two-factor
          auth, and more.
        </p>

        {/* Dynamic content based on auth state */}
        <AuthLoading>
          <div style={styles.loadingButtons}>
            <div style={styles.skeletonButton} />
            <div style={styles.skeletonButton} />
          </div>
        </AuthLoading>

        <SignedOut>
          <div style={styles.buttonGroup}>
            <Link to="/auth/sign-up" style={styles.primaryButton}>
              Get Started Free
            </Link>
            <Link to="/auth/sign-in" style={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <WelcomeBackSection />
        </SignedIn>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Features Demonstrated</h2>

        <div style={styles.grid}>
          <FeatureCard
            icon="🔐"
            title="Email & Password"
            description="Traditional authentication with email and password credentials."
            link="/auth/sign-in"
          />
          <FeatureCard
            icon="🌐"
            title="Social Providers"
            description="Sign in with GitHub, Google, Discord, Apple, or Microsoft."
            link="/auth/sign-in"
          />
          <FeatureCard
            icon="✨"
            title="Magic Link"
            description="Passwordless authentication via email magic links."
            link="/auth/magic-link"
          />
          <FeatureCard
            icon="🔑"
            title="Passkeys"
            description="Modern WebAuthn/FIDO2 authentication with biometrics."
            link="/auth/sign-in"
          />
          <FeatureCard
            icon="🛡️"
            title="Two-Factor Auth"
            description="OTP and TOTP based two-factor authentication."
            link="/account/security"
          />
          <FeatureCard
            icon="👤"
            title="User Settings"
            description="Comprehensive account management and profile settings."
            link="/account/settings"
          />
        </div>
      </section>

      {/* Auth Flows Section */}
      <section style={styles.authFlows}>
        <h2 style={styles.sectionTitle}>Try Different Auth Flows</h2>
        <p style={styles.authFlowsSubtitle}>
          Explore all the authentication methods available.
        </p>

        <div style={styles.flowButtons}>
          <AuthFlowButton to="/auth/sign-in" label="Sign In" emoji="👋" />
          <AuthFlowButton to="/auth/sign-up" label="Sign Up" emoji="🚀" />
          <AuthFlowButton to="/auth/magic-link" label="Magic Link" emoji="✨" />
          <AuthFlowButton
            to="/auth/forgot-password"
            label="Forgot Password"
            emoji="🔑"
          />
        </div>
      </section>
    </div>
  );
}

function WelcomeBackSection() {
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();

  return (
    <div style={styles.welcomeBack}>
      <div style={styles.welcomeCard}>
        <UserAvatar user={session?.user} style={{ width: 64, height: 64 }} />
        <div>
          <p style={styles.welcomeLabel}>Welcome back,</p>
          <p style={styles.welcomeName}>
            {session?.user?.name || session?.user?.email?.split('@')[0]}
          </p>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <Link to="/dashboard" style={styles.primaryButton}>
          Go to Dashboard
        </Link>
        <Link to="/account/settings" style={styles.secondaryButton}>
          Account Settings
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: {
  icon: string;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link to={link} style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{description}</p>
    </Link>
  );
}

function AuthFlowButton({
  to,
  label,
  emoji,
}: {
  to: string;
  label: string;
  emoji: string;
}) {
  return (
    <Link to={to} style={styles.flowButton}>
      <span style={{ fontSize: '1.25rem' }}>{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 64px)',
  },
  hero: {
    padding: '4rem 1.5rem',
    textAlign: 'center',
    background:
      'radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 70%)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  gradient: {
    background: 'linear-gradient(to right, #10b981, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'rgba(161, 161, 170, 1)',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  loadingButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  skeletonButton: {
    height: '48px',
    width: '140px',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(63, 63, 70, 1)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: 'rgba(16, 185, 129, 1)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
  },
  secondaryButton: {
    backgroundColor: 'rgba(39, 39, 42, 1)',
    border: '1px solid rgba(63, 63, 70, 1)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
  },
  welcomeBack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  welcomeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    border: '1px solid rgba(63, 63, 70, 1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  welcomeLabel: {
    color: 'rgba(161, 161, 170, 1)',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  welcomeName: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  features: {
    padding: '4rem 1.5rem',
    borderTop: '1px solid rgba(39, 39, 42, 1)',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    border: '1px solid rgba(39, 39, 42, 1)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '0.75rem',
  },
  featureTitle: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  featureDesc: {
    color: 'rgba(161, 161, 170, 1)',
    fontSize: '0.875rem',
  },
  authFlows: {
    padding: '4rem 1.5rem',
    borderTop: '1px solid rgba(39, 39, 42, 1)',
    backgroundColor: 'rgba(24, 24, 27, 0.3)',
    textAlign: 'center',
  },
  authFlowsSubtitle: {
    color: 'rgba(161, 161, 170, 1)',
    marginBottom: '2rem',
  },
  flowButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    maxWidth: '800px',
    margin: '0 auto',
  },
  flowButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    border: '1px solid rgba(63, 63, 70, 1)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
