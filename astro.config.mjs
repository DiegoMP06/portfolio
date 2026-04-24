// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite'
import db from '@astrojs/db';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

const { SITE_URL, CLOUDINARY_DOMAIN } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  output: 'server',

  site: SITE_URL || 'http://localhost:4321',

  image: {
    domains: [CLOUDINARY_DOMAIN || 'res.cloudinary.com'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [db(), react()],
  adapter: vercel()
});