/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
                subnavbar: 'var(--subnav-z-index)',
                footer: 'var(--footer-z-index)',
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
            },

            keyframes: {
                upright01: {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(-20deg)' },
                    '50%': { transform: 'translate(-6px, 6px) rotate(-20deg)' },
                },
                upright02: {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': { transform: 'translate(-10px, 10px) rotate(0deg)' },
                },
                upright03: {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(10deg)' },
                    '50%': { transform: 'translate(-8px, 8px) rotate(10deg)' },
                },

                mobileupright01: {
                    '0%, 100%': { transform: 'translate(-50%, -50%) rotate(-20deg)' },
                    '50%': { transform: 'translate(-46%, -54%) rotate(-20deg)' },
                },
                mobileupright02: {
                    '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                    '50%': { transform: 'translate(-44%, -56%) rotate(0deg)' },
                },
                mobileupright03: {
                    '0%, 100%': { transform: 'translate(-50%, -50%) rotate(10deg)' },
                    '50%': { transform: 'translate(-42%, -58%) rotate(10deg)' },
                }
            },
            animation: {
                upright01: 'upright01 3s ease-in-out infinite',
                upright02: 'upright02 4s ease-in-out infinite',
                upright03: 'upright03 4.6s ease-in-out infinite',
                    
                mobileupright01: 'mobileupright01 3s ease-in-out infinite',
                mobileupright02: 'mobileupright02 4s ease-in-out infinite',
                mobileupright03: 'mobileupright03 4.6s ease-in-out infinite',
            },         
        },
    },
    plugins: [],
};

