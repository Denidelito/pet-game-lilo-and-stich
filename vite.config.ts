import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@phaser': '/src/phaser',
      '@react': '/src/react',
      '@stores': '/src/stores',
      '@types': '/src/types',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
    },
  },
});
