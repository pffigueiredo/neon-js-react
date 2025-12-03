import { createClient } from '@neondatabase/neon-js';

export const neonClient = createClient({
  auth: {
    url: 'https://ep-autumn-waterfall-w20v4aq3.neonauth.us-east-2.aws.neon.build/neondb/auth',
  },
  dataApi: {
    url: 'https://ep-autumn-waterfall-w20v4aq3.apirest.us-east-2.aws.neon.build/neondb/rest/v1',
  },
});
