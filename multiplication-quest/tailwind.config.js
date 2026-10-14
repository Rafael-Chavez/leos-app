/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adventure theme colors
        'sky-blue': '#0061a4',
        'sky-blue-light': '#d1e4ff',
        'leaf-green': '#006e1c',
        'leaf-green-light': '#94f990',
        'golden': '#fabd00',
        'golden-light': '#ffdf9e',
        'coral': '#ff6b6b',
        'purple-magic': '#764ba2',

        // Semantic colors from Leo's app
        'background': '#f9f9f9',
        'primary': '#0061a4',
        'primary-container': '#d1e4ff',
        'secondary': '#785900',
        'secondary-container': '#ffdf9e',
        'tertiary': '#006e1c',
        'tertiary-container': '#94f990',
        'error': '#ba1a1a',
        'surface': '#f9f9f9',
        'on-surface': '#1b1b1b',
        'on-primary': '#ffffff',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
