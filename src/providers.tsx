import { NeonAuthUIProvider } from '@neondatabase/neon-auth-ui';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { neonClient } from './client';
import '@neondatabase/neon-auth-ui/css';
import type { ReactNode } from 'react';

const Link = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) => (
  <RouterLink to={href} className={className}>
    {children}
  </RouterLink>
);
export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={neonClient.auth}
      navigate={navigate}
      social={{
        providers: ['github', 'google'], // Remove: discord, apple, microsoft
      }}
      magicLink={false}
      passkey={false}
      multiSession={false}
      Link={Link}
      // Avatar configuration with base64 storage (no server needed)
      avatar={{
        size: 256,
        extension: 'webp',
      }}
      // Additional custom fields for sign-up and settings
      additionalFields={{
        company: {
          label: 'Company',
          placeholder: 'Your company name',
          description: 'Where do you work?',
          required: false,
          type: 'string',
        },
        age: {
          label: 'Age',
          placeholder: 'Your age',
          description: 'Must be 18 or older',
          instructions: 'We need this for age verification',
          required: false,
          type: 'number',
          validate: (value: string) => Promise.resolve(parseInt(value) >= 18),
        },
        newsletter: {
          label: 'Subscribe to newsletter',
          description: 'Get the latest updates and news',
          required: false,
          type: 'boolean',
        },
      }}
      // Configure sign-up to show additional fields
      signUp={{
        fields: ['company', 'age', 'newsletter'],
      }}
      // Configure account settings to show custom fields
      account={{
        fields: ['image', 'name', 'company', 'age', 'newsletter'],
      }}
      // Custom localization for a personalized experience
      localization={{
        SIGN_IN: 'Welcome Back',
        SIGN_IN_DESCRIPTION: 'Sign in to your account to continue',
        SIGN_UP: 'Create Account',
        SIGN_UP_DESCRIPTION: 'Join us today and get started',
        MAGIC_LINK: 'Passwordless Sign In',
        MAGIC_LINK_DESCRIPTION: "We'll send you a magic link to sign in",
        FORGOT_PASSWORD: 'Forgot Password?',
        FORGOT_PASSWORD_DESCRIPTION: 'Enter your email to reset your password',
        TWO_FACTOR: 'Two-Factor Authentication',
        TWO_FACTOR_DESCRIPTION: 'Enter your verification code',
        OR_CONTINUE_WITH: 'or continue with',
        SETTINGS: 'Account Settings',
        SECURITY: 'Security Settings',
        PASSKEYS: 'Passkeys',
        SESSIONS: 'Active Sessions',
        DELETE_ACCOUNT: 'Delete Account',
        DELETE_ACCOUNT_DESCRIPTION:
          'Permanently delete your account and all data',
      }}
      // Enable delete account functionality
      deleteUser
      // Enable email change
      changeEmail
      // Enable credentials (email/password)
      credentials
    >
      {children}
    </NeonAuthUIProvider>
  );
}
