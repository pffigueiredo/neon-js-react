import { createClient } from '@neondatabase/neon-js';
import { type Database } from '../database.types';

export const neonClient = createClient<Database>({
  auth: {
    url: 'https://ep-broad-wave-ah1vzqk8.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth',
  },
  dataApi: {
    url: 'https://ep-broad-wave-ah1vzqk8.apirest.c-3.us-east-1.aws.neon.tech/neondb/rest/v1',
  },
});
