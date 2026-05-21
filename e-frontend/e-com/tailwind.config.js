/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch exact design tokens
        primary: {
          DEFAULT: '#6a5188',      // Lavender Base
          container: '#8369a3',
          accent: '#967bb6',       // Lavender Highlight / override
          dim: '#d8bafa',
          fixed: '#eedbff',
          on: '#ffffff',
          'on-container': '#fffbff',
        },
        secondary: {
          DEFAULT: '#5f5e5e',
          container: '#e2dfde',
          on: '#ffffff',
          'on-container': '#636262',
        },
        tertiary: {
          DEFAULT: '#5b5c5f',
          container: '#747478',
          on: '#ffffff',
          'on-container': '#fdfcff',
        },
        background: '#f9f9f9',     // Paper White background
        onBackground: '#1a1c1c',   // Ink Black text
        
        surface: {
          DEFAULT: '#f9f9f9',      // Paper White surface
          dim: '#dadada',
          bright: '#f9f9f9',
          tint: '#6c538b',
          container: '#eeeeee',
          'container-low': '#f3f3f4',
          'container-lowest': '#ffffff',
          'container-high': '#e8e8e8',
          'container-highest': '#e2e2e2',
          on: '#1a1c1c',           // Ink Black text on surface
          'on-variant': '#4a454e',
        },
        
        outline: {
          DEFAULT: '#7b757f',
          variant: '#ccc4cf',
        },
        
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff',
          'on-container': '#93000a',
        },
        
        // Brand editorial custom aliases
        ink: {
          DEFAULT: '#1a1c1c',      // Ink Black grounding color
          dark: '#1a1a1a',        // Dark overlay / secondary footer
        },
        paper: {
          DEFAULT: '#ffffff',      // Pure paper white
          off: '#f9f9f9',          // Off white base background
        },
        lavender: {
          DEFAULT: '#6a5188',
          light: '#eedbff',
          accent: '#967bb6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',        // 4px
        sm: '0.125rem',            // 2px
        md: '0.375rem',            // 6px
        lg: '0.5rem',              // 8px
        xl: '0.75rem',             // 12px
        '2xl': '1.5rem',           // 24px
      },
      spacing: {
        'stack-sm': '16px',        // 16px
        'stack-md': '32px',        // 32px
        'stack-lg': '80px',        // 80px
      },
      maxWidth: {
        'container': '1440px',
      }
    },
  },
  plugins: [],
}
