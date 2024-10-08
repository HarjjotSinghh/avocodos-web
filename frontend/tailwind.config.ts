import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import plugin from 'tailwindcss/plugin'


const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        avocodos: ["Avocodos", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shine": {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        move: {
          to: {
            strokeDashoffset: '1000',
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shine": "shine 8s ease-in-out infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), plugin(function ({ addUtilities }) {
    addUtilities({
      '.avocodos-transition': {
        'transition-property': 'all',
        'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'transition-duration': '300ms'
      },
      '.avocodos-shadow-lg': {
        'box-shadow': '0px 0px 50px 0px hsl(var(--primary)/0.02)'
      },
      '.bg-cross': {
        'background-color': 'hsl(var(--background))',
        'opacity': '1',
        'background': 'radial-gradient(circle, transparent 20%, hsl(var(--background)) 20%, hsl(var(--background)) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, hsl(var(--background)) 20%, hsl(var(--background)) 80%, transparent 80%, transparent) 27.5px 27.5px, linear-gradient(hsl(var(--primary)/0.05) 2.2px, transparent 2.2px) 0 -1.1px, linear-gradient(90deg, hsl(var(--primary)/0.05) 2.2px, hsl(var(--background)) 2.2px) -1.1px 0',
        'background-size': '55px 55px, 55px 55px, 27.5px 27.5px, 27.5px 27.5px',
        'background-position': '0 0, 27.5px 27.5px, 0 0, 27.5px 27.5px',
      }
    })
  })],
} satisfies Config;

export default withUt(config);
