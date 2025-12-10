import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthUIContext } from '@neondatabase/neon-js/auth/react';
import { neonClient } from '../client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

export interface OrganizationData {
  organization: Organization | null;
  members: OrganizationMember[];
  userRole: string | null;
}

/**
 * Hook to fetch and manage the current user's active organization data
 */
export function useOrganization() {
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();
  
  const [data, setData] = useState<OrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    const currentUserId = session?.user?.id;
    
    if (!currentUserId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const processOrgData = (orgData: unknown) => {
      // The API returns the organization with members included
      const org = orgData as {
        id: string;
        name: string;
        slug: string;
        logo?: string | null;
        metadata?: Record<string, unknown> | null;
        createdAt: string;
        members?: Array<{
          id: string;
          organizationId: string;
          userId: string;
          role: string;
          createdAt: string;
          user?: {
            id: string;
            name?: string;
            email?: string;
            image?: string;
          };
        }>;
      };

      const currentMember = org.members?.find(m => m.userId === currentUserId);

      setData({
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo: org.logo,
          metadata: org.metadata,
          createdAt: new Date(org.createdAt),
        },
        members: (org.members || []).map(m => ({
          id: m.id,
          organizationId: m.organizationId,
          userId: m.userId,
          role: m.role,
          createdAt: new Date(m.createdAt),
          user: m.user,
        })),
        userRole: currentMember?.role || null,
      });
    };

    setIsLoading(true);
    setError(null);

    try {
      // Get the full organization data (includes members)
      const orgResponse = await neonClient.auth.organization.getFullOrganization();

      if (orgResponse.error) {
        // No active organization - try to get list and set first one
        const listResponse = await neonClient.auth.organization.list();
        
        if (listResponse.data && listResponse.data.length > 0) {
          // Set first org as active
          await neonClient.auth.organization.setActive({
            organizationId: listResponse.data[0].id,
          });
          
          // Fetch again
          const retryResponse = await neonClient.auth.organization.getFullOrganization();
          if (retryResponse.data) {
            processOrgData(retryResponse.data);
            return;
          }
        }
        
        setData({ organization: null, members: [], userRole: null });
        return;
      }

      if (orgResponse.data) {
        processOrgData(orgResponse.data);
      } else {
        setData({ organization: null, members: [], userRole: null });
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOrganization,
  };
}

