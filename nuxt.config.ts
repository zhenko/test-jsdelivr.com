// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  buildModules: ["@nuxt/typescript-build"],
  devtools: { enabled: false },
  css: ["~/assets/css/style.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  clientComponents: true,
});
