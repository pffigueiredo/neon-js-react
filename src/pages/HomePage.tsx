import {
  SignedIn,
  SignedOut,
  AuthLoading,
  UserAvatar,
} from '@neondatabase/neon-js/auth/react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthUIContext } from '@neondatabase/neon-js/auth/react';
import { useOrganization } from '../hooks/useOrganization';

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
          features. Explore social logins, magic links, and more.
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
            icon="🔄"
            title="Reset Password"
            description="Securely reset your password via email verification link."
            link="/auth/forgot-password"
          />
          <FeatureCard
            icon="🔐"
            title="Change Password"
            description="Update your password from account security settings."
            link="/account/security"
          />
          <FeatureCard
            icon="👤"
            title="User Settings"
            description="Comprehensive account management and profile settings."
            link="/account/settings"
          />
          <FeatureCard
            icon="👻"
            title="Anonymous Sign In"
            description="Try the app without creating an account. We support anonymous sign-in!"
            link="/anonymous"
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
          <AuthFlowButton
            to="/auth/forgot-password"
            label="Forgot Password"
            emoji="🔑"
          />
          <AuthFlowButton to="/anonymous" label="Anonymous" emoji="👻" />
        </div>
      </section>
    </div>
  );
}

function WelcomeBackSection() {
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();
  const { data: orgData, isLoading: orgLoading } = useOrganization();

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

      {/* Organization Card */}
      <div style={styles.orgCard}>
        <div style={styles.orgHeader}>
          <h3 style={styles.orgTitle}>🏢 Your Organization</h3>
        </div>
        {orgLoading ? (
          <div style={styles.orgLoading}>
            <div style={styles.spinner} />
            <span>Loading organization...</span>
          </div>
        ) : orgData?.organization ? (
          <div style={styles.orgContent}>
            <div style={styles.orgInfo}>
              {orgData.organization.logo ? (
                <img
                  src={orgData.organization.logo}
                  alt={orgData.organization.name}
                  style={styles.orgLogo}
                />
              ) : (
                <div style={styles.orgLogoPlaceholder}>
                  {orgData.organization.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={styles.orgDetails}>
                <p style={styles.orgName}>{orgData.organization.name}</p>
                <p style={styles.orgSlug}>@{orgData.organization.slug}</p>
                {orgData.userRole && (
                  <span style={styles.roleBadge}>{orgData.userRole}</span>
                )}
              </div>
            </div>
            
            {/* Members */}
            <div style={styles.membersSection}>
              <span style={styles.membersTitle}>
                {orgData.members.length} {orgData.members.length === 1 ? 'member' : 'members'}
              </span>
              <div style={styles.memberAvatars}>
                {orgData.members.slice(0, 4).map((member) => (
                  <div key={member.id} style={styles.memberAvatar} title={member.user?.name || member.user?.email}>
                    {member.user?.image ? (
                      <img
                        src={member.user.image}
                        alt={member.user.name || 'Member'}
                        style={styles.memberAvatarImg}
                      />
                    ) : (
                      <span>
                        {(member.user?.name || member.user?.email || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
                {orgData.members.length > 4 && (
                  <div style={styles.moreMembers}>
                    +{orgData.members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.noOrg}>
            <span style={{ fontSize: '1.5rem' }}>🏗️</span>
            <p style={styles.noOrgText}>Setting up your organization...</p>
          </div>
        )}
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
      'radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'var(--foreground)',
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
    color: 'var(--muted-foreground)',
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
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--muted)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
  },
  secondaryButton: {
    backgroundColor: 'var(--secondary)',
    border: '1px solid var(--border)',
    color: 'var(--secondary-foreground)',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius)',
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
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  welcomeLabel: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  welcomeName: {
    color: 'var(--card-foreground)',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  features: {
    padding: '4rem 1.5rem',
    borderTop: '1px solid var(--border)',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: 'var(--foreground)',
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
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '0.75rem',
  },
  featureTitle: {
    color: 'var(--card-foreground)',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  featureDesc: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
  },
  authFlows: {
    padding: '4rem 1.5rem',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--card)',
    textAlign: 'center',
  },
  authFlowsSubtitle: {
    color: 'var(--muted-foreground)',
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
    backgroundColor: 'var(--secondary)',
    border: '1px solid var(--border)',
    color: 'var(--secondary-foreground)',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  // Organization card styles
  orgCard: {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    padding: '1.25rem',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'left',
  },
  orgHeader: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  orgTitle: {
    color: 'var(--card-foreground)',
    fontSize: '0.875rem',
    fontWeight: 600,
    margin: 0,
  },
  orgLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'var(--muted-foreground)',
    padding: '0.5rem 0',
    fontSize: '0.875rem',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid var(--muted)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  orgContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  orgInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  orgLogo: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  orgLogoPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: 'var(--foreground)',
    color: 'var(--background)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  orgDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
    minWidth: 0,
  },
  orgName: {
    color: 'var(--card-foreground)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.3,
  },
  orgSlug: {
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'color-mix(in oklch, var(--primary) 15%, transparent)',
    color: 'var(--primary)',
    fontSize: '0.6875rem',
    fontWeight: 500,
    padding: '0.1875rem 0.5rem',
    borderRadius: '0.25rem',
    textTransform: 'capitalize',
    marginTop: '0.25rem',
    width: 'fit-content',
  },
  membersSection: {
    borderTop: '1px solid var(--border)',
    paddingTop: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersTitle: {
    color: 'var(--muted-foreground)',
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  memberAvatars: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
  },
  memberAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--muted)',
    color: 'var(--muted-foreground)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6875rem',
    fontWeight: 500,
    overflow: 'hidden',
    border: '2px solid var(--card)',
    marginLeft: '-8px',
  },
  memberAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  moreMembers: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--muted)',
    color: 'var(--muted-foreground)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.625rem',
    fontWeight: 600,
    marginLeft: '-8px',
    border: '2px solid var(--card)',
  },
  noOrg: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
  },
  noOrgText: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    margin: 0,
  },
};
