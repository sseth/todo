import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind, { Config } from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const tailwindConfig: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind(tailwindConfig), autoprefixer],
    },
  },
});
