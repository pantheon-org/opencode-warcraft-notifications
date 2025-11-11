import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://pantheon-org.github.io',
  base: '/opencode-warcraft-notifications',
  outDir: './dist',
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
          label: 'Getting Started',
          link: '/',
        },
        {
          label: 'User Guide',
          link: '/user-guide/',
        },
        {
          label: 'Development',
          collapsed: false,
          items: [
            { label: 'Development Guide', link: '/development/' },
            { label: 'API Documentation', link: '/api/' },
            { label: 'Architecture', link: '/architecture/' },
            { label: 'Onboarding', link: '/onboarding/' },
          ],
        },
        {
          label: 'Deployment',
          collapsed: false,
          items: [
            { label: 'Deployment Guide', link: '/deployment/' },
            { label: 'CI/CD Pipeline', link: '/pipeline/' },
          ],
        },
        {
          label: 'GitHub Workflows',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/github-workflows/' },
            { label: 'Setup Guide', link: '/github-workflows/setup-guide/' },
            { label: 'Architecture Summary', link: '/github-workflows/architecture-summary/' },
            { label: 'Cleanup Old Releases', link: '/github-workflows/cleanup-old-releases/' },
            { label: 'Cycle Prevention Fix', link: '/github-workflows/cycle-prevention-fix/' },
            { label: 'Workflows Overview', link: '/github-workflows/overview/' },
            { label: 'Squash Merge Config', link: '/github-workflows/squash-merge-configuration/' },
          ],
        },
        {
          label: 'Configuration',
          collapsed: true,
          items: [
            { label: 'Plugin Schema', link: '/schemas/' },
            { label: 'Schema Validation', link: '/validate-schema/' },
          ],
        },
        {
          label: 'Troubleshooting',
          link: '/troubleshooting/',
        },
      ],
    }),
  ],
});
