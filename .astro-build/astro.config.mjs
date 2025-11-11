import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://pantheon-org.github.io',
  base: '/opencode-warcraft-notifications',
  outDir: '../dist',
  integrations: [
    starlight({
      title: 'Warcraft Notifications',
      description: 'OpenCode plugin for Warcraft II notification sounds',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/pantheon-org/opencode-warcraft-notifications',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/pantheon-org/opencode-warcraft-notifications/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Guides',
          autogenerate: { directory: '.' },
        },
      ],
    }),
  ],
});
