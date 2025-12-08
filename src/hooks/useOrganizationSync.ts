import { useEffect, useRef, useContext } from 'react';
import { AuthUIContext } from '@neondatabase/neon-js/auth/react';
import { neonClient } from '../client';

/**
 * Hook that automatically provisions an organization for new users.
 * When a user signs up, it checks if they have an organization.
 * If not, it creates one using their name.
 */
export function useOrganizationSync() {
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();
  const hasCheckedRef = useRef<string | null>(null);

  useEffect(() => {
    async function syncOrganization() {
      // Only run if we have a user and haven't checked for this user yet
      if (!session?.user?.id || hasCheckedRef.current === session.user.id) {
        return;
      }

      // Mark this user as being checked to prevent duplicate calls
      hasCheckedRef.current = session.user.id;

      try {
        // Fetch the user's organizations
        const orgsResponse = await neonClient.auth.organization.list();

        if (orgsResponse.error) {
          console.error('Failed to fetch organizations:', orgsResponse.error);
          return;
        }

        // If user has no organizations, create one for them
        if (!orgsResponse.data || orgsResponse.data.length === 0) {
          const userName = session.user.name || session.user.email || 'User';
          const orgName = `${userName}'s Organization`;
          const orgSlug = generateSlug(userName);

          const createResponse = await neonClient.auth.organization.create({
            name: orgName,
            slug: orgSlug,
          });

          if (createResponse.error) {
            console.error('Failed to create organization:', createResponse.error);
            return;
          }

          console.log('Organization created successfully:', createResponse.data);

          // Set the newly created organization as active
          if (createResponse.data?.id) {
            await neonClient.auth.organization.setActive({
              organizationId: createResponse.data.id,
            });
          }
        } else {
          // User already has organizations, ensure one is active
          const activeOrg = await neonClient.auth.organization.getFullOrganization();
          
          if (!activeOrg.data && orgsResponse.data[0]?.id) {
            // No active org, set the first one as active
            await neonClient.auth.organization.setActive({
              organizationId: orgsResponse.data[0].id,
            });
          }
        }
      } catch (error) {
        console.error('Error syncing organization:', error);
      }
    }

    syncOrganization();
  }, [session?.user?.id, session?.user?.name, session?.user?.email]);
}

/**
 * Generate a URL-safe slug from a name
 */
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add a random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-org-${suffix}`;
}

