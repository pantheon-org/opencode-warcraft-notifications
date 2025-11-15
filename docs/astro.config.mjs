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
        light: './src/assets/logo-dark.svg',
        dark: './src/assets/logo-light.svg',
        replacesTitle: false,
      },
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        defaultProps: {
          wrap: true,
        },
        styleOverrides: {
          borderRadius: '0.5rem',
          codePaddingBlock: '1rem',
          frames: {
            shadowColor: 'transparent',
          },
        },
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
          },
        },
      ],
      components: {
        Header: './src/components/Header.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/pantheon-org/opencode-warcraft-notifications',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/opencode',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/pantheon-org/opencode-warcraft-notifications/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Intro',
          link: '/',
        },
        {
          label: 'Documentation Map',
          link: '/documentation-map/',
        },
        {
          label: 'Quick Reference',
          link: '/quick-reference/',
        },
        {
          label: 'User Guide',
          link: '/user-guide/',
        },
        {
          label: 'Troubleshooting',
          link: '/troubleshooting/',
        },
        {
          label: 'Usage',
          items: [
            { label: 'Configuration', link: '/schemas/' },
            { label: 'Schema Validation', link: '/validate-schema/' },
          ],
        },
        {
          label: 'Configure',
          items: [
            { label: 'API Documentation', link: '/api/' },
            { label: 'Architecture', link: '/architecture/' },
          ],
        },
        {
          label: 'Develop',
          items: [
            { label: 'Development Guide', link: '/development/' },
            { label: 'Onboarding', link: '/onboarding/' },
            { label: 'Deployment', link: '/deployment/' },
            { label: 'CI/CD Pipeline', link: '/pipeline/' },
          ],
        },
        {
          label: 'Workflows',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/github-workflows/' },
            { label: 'Setup Guide', link: '/github-workflows/setup-guide/' },
            { label: 'Architecture', link: '/github-workflows/architecture-summary/' },
            { label: 'Cleanup Releases', link: '/github-workflows/cleanup-old-releases/' },
            { label: 'Cycle Prevention', link: '/github-workflows/cycle-prevention-fix/' },
            { label: 'Workflows Detail', link: '/github-workflows/overview/' },
            { label: 'Squash Merge', link: '/github-workflows/squash-merge-configuration/' },
            { label: 'Docs Structure', link: '/docs-branch-structure/' },
            { label: 'Migration Plan', link: '/docs-migration-plan/' },
          ],
        },
      ],
    }),
  ],
});
