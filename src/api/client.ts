import axios from 'axios';

import { config } from '@/config';

/** Shared axios instance for the bomain backend (same API the web app uses). */
export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000,
});
