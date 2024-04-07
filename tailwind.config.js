/** @type {import('tailwindcss').Config} */

import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headings: ['var(--font-exo)'],
        paragraphs: ['var(--font-quicksand)'],
      },
      padding: {
        'page-x': 'var(--page-x-padding)',
      },
      backgroundColor: {
        skin: {
          ten: 'var(--skin-ten)',
        },
      },
      zIndex: {
        navbar: 'var(--nav-z-index)',
      },
      width: {
        'admin-sidebar': 'var(--admin-sidebar-width)',
      },
      height: {
        'nav-height': 'var(--nav-height)',
        'nav-item-height': 'var(--nav-item-height)',
      },
      data: {
        checked: 'ui~="checked"',
        active: 'ui~="active"',
      },
      transitionDelay: {
        '2000': '2000'
      },
      colors: {
        accent: {
          1: 'hsl(var(--color-accent1) / <alpha-value>)',
          2: 'hsl(var(--color-accent2) / <alpha-value>)'
        },
        background: 'hsl(var(--color-background) / <alpha-value>)',
        content: 'hsl(var(--color-content) / <alpha-value>)',
      }
    },
  },
  // darkMode: "class",
  // plugins: [nextui()],
  plugins: [],
};
