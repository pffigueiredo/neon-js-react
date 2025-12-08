import {
  RedirectToSignIn,
  SignedIn,
  AuthLoading,
  OrganizationSettingsCards,
} from '@neondatabase/neon-js/auth/react';

export function OrganizationPage() {
  return (
    <>
      <RedirectToSignIn />

      <AuthLoading>
        <OrganizationSkeleton />
      </AuthLoading>

      <SignedIn>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Organization Settings</h1>
            <p style={styles.subtitle}>
              Manage your organization settings, members, and preferences
            </p>
          </div>

          {/* Content */}
          <div style={styles.content}>
            <div style={styles.sectionCard}>
              <OrganizationSettingsCards />
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

function OrganizationSkeleton() {
  return (
    <div style={styles.container}>
      <div
        style={{
          height: 32,
          width: 250,
          backgroundColor: 'var(--muted)',
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 20,
          width: 400,
          backgroundColor: 'var(--muted)',
          borderRadius: 8,
          marginBottom: 32,
        }}
      />
      <div
        style={{
          height: 200,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
        }}
      />
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
    color: 'var(--foreground)',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--muted-foreground)',
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionCard: {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
  },
};

