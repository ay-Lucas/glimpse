import defaultTheme from "tailwindcss/defaultTheme";
export const plugins = [
  require("tailwindcss-animate"),
  require("@tailwindcss/aspect-ratio"),
];
/** @type {import('tailwindcss').Config} */
//@ts-ignore
export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    fontFamily: {
      sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      md: [".925rem", { lineHeight: "1.3rem" }],
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
      sidebar: "hsl(var(--sidebar) / <alpha-value>)",
      "sidebar-foreground": "hsl(var(--sidebar-foreground) / <alpha-value>)",
      "sidebar-border": "hsl(var(--sidebar-border) / <alpha-value>)",
      "sidebar-accent": "hsl(var(--sidebar-accent) / <alpha-value>)",
      "sidebar-accent-foreground":
        "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
      "sidebar-ring": "hsl(var(--sidebar-ring) / <alpha-value>)",
    },
    screens: {
      xxxs: "300px",
      xxs: "400px",
      xs: "500px",
      ...defaultTheme.screens,
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
      "collapsible-down": {
        from: { height: "0" },
        to: { height: "var(--radix-collapsible-content-height)" },
      },
      "collapsible-up": {
        from: { height: "var(--radix-collapsible-content-height)" },
        to: { height: "0" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "collapsible-down": "collapsible-down 0.2s ease-out",
      "collapsible-up": "collapsible-up 0.2s ease-in",
      "fade-in": "fadeIn 0.8s ease-out forwards",
    },
  },
};
