import { useParams, Link } from 'react-router-dom';
import {
  RedirectToSignIn,
  SignedIn,
  AuthLoading,
  AccountSettingsCards,
  SecuritySettingsCards,
  SessionsCard,
  PasskeysCard,
  TwoFactorCard,
  DeleteAccountCard,
} from '@neondatabase/neon-auth-ui';

type AccountView = 'settings' | 'security' | 'sessions';

export function AccountPage() {
  const { view } = useParams<{ view: string }>();
  const currentView = (view || 'settings') as AccountView;

  return (
    <>
      <RedirectToSignIn />

      <AuthLoading>
        <AccountSkeleton />
      </AuthLoading>

      <SignedIn>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Account Settings</h1>
            <p style={styles.subtitle}>
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={styles.tabs}>
            <TabLink to="/account/settings" active={currentView === 'settings'}>
              👤 Profile
            </TabLink>
            <TabLink to="/account/security" active={currentView === 'security'}>
              🔒 Security
            </TabLink>
            <TabLink to="/account/sessions" active={currentView === 'sessions'}>
              📱 Sessions
            </TabLink>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {currentView === 'settings' && <SettingsView />}
            {currentView === 'security' && <SecurityView />}
            {currentView === 'sessions' && <SessionsView />}
          </div>
        </div>
      </SignedIn>
    </>
  );
}

function TabLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {}),
      }}
    >
      {children}
    </Link>
  );
}

function SettingsView() {
  return (
    <div style={styles.section}>
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Profile Information</h2>
        <p style={styles.sectionDesc}>
          Update your profile picture, name, and other personal information.
        </p>
        <AccountSettingsCards />
      </div>
    </div>
  );
}

function SecurityView() {
  return (
    <div style={styles.section}>
      {/* Security Settings */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Security Settings</h2>
        <p style={styles.sectionDesc}>
          Manage your password, two-factor authentication, and other security
          settings.
        </p>
        <SecuritySettingsCards />
      </div>

      {/* Two-Factor Authentication */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>🛡️ Two-Factor Authentication</h2>
        <p style={styles.sectionDesc}>
          Add an extra layer of security to your account with 2FA.
        </p>
        <TwoFactorCard />
      </div>

      {/* Passkeys */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>🔑 Passkeys</h2>
        <p style={styles.sectionDesc}>
          Use biometrics or security keys for passwordless authentication.
        </p>
        <PasskeysCard />
      </div>

      {/* Delete Account */}
      <div style={{ ...styles.sectionCard, ...styles.dangerCard }}>
        <h2 style={{ ...styles.sectionTitle, color: '#f87171' }}>
          ⚠️ Danger Zone
        </h2>
        <p style={styles.sectionDesc}>
          Permanently delete your account and all associated data.
        </p>
        <DeleteAccountCard />
      </div>
    </div>
  );
}

function SessionsView() {
  return (
    <div style={styles.section}>
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Active Sessions</h2>
        <p style={styles.sectionDesc}>
          View and manage all devices that are currently signed in to your
          account.
        </p>
        <SessionsCard />
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div style={styles.container}>
      <div
        style={{
          height: 32,
          width: 200,
          backgroundColor: 'rgba(63,63,70,1)',
          borderRadius: 8,
          marginBottom: 32,
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 40,
              width: 100,
              backgroundColor: 'rgba(63,63,70,1)',
              borderRadius: 8,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'rgba(161, 161, 170, 1)',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(39, 39, 42, 1)',
    paddingBottom: '1rem',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: 'rgba(161, 161, 170, 1)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  tabActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'rgba(16, 185, 129, 1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  content: {},
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    border: '1px solid rgba(39, 39, 42, 1)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
  },
  sectionTitle: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    color: 'rgba(161, 161, 170, 1)',
    fontSize: '0.875rem',
    margin: 0,
    marginBottom: '1.5rem',
  },
  dangerCard: {
    borderColor: 'rgba(127, 29, 29, 0.5)',
    backgroundColor: 'rgba(127, 29, 29, 0.1)',
  },
};
