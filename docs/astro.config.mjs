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
      social: {
        github: 'https://github.com/pantheon-org/opencode-warcraft-notifications',
      },
      editLink: {
        baseUrl: 'https://github.com/pantheon-org/opencode-warcraft-notifications/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'User Guide',
          link: '/user-guide/',
        },
        {
          label: 'API Documentation',
          link: '/api/',
        },
        {
          label: 'Architecture',
          collapsed: false,
          items: [{ label: 'Overview', link: '/architecture/' }],
        },
        {
          label: 'Development',
          collapsed: false,
          items: [{ label: 'Guide', link: '/development/' }],
        },
        {
          label: 'Deployment',
          link: '/deployment/',
        },
        {
          label: 'Pipeline',
          collapsed: true,
          items: [{ label: 'Overview', link: '/pipeline/' }],
        },
        {
          label: 'Troubleshooting',
          link: '/troubleshooting/',
        },
        {
          label: 'Onboarding',
          link: '/onboarding/',
        },
        {
          label: 'GitHub Workflows',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/github-workflows/' },
            { label: 'Setup Guide', link: '/github-workflows/setup-guide/' },
            {
              label: 'Architecture',
              link: '/github-workflows/architecture-summary/',
            },
            {
              label: 'Cleanup Releases',
              link: '/github-workflows/cleanup-old-releases/',
            },
            {
              label: 'Cycle Prevention',
              link: '/github-workflows/cycle-prevention-fix/',
            },
            { label: 'Workflows', link: '/github-workflows/overview/' },
            {
              label: 'Squash Merge Config',
              link: '/github-workflows/squash-merge-configuration/',
            },
          ],
        },
        {
          label: 'Schemas',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/schemas/' },
            { label: 'Validation', link: '/validate-schema/' },
          ],
        },
      ],
    }),
  ],
});
