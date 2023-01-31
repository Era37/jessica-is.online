import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://192.168.2.16:6300",
    },
  },
  experimental: {
    writeEarlyHints: false,
  },
  typescript: {
    strict: true,
  },
  css: ["~/assets/main.scss"],
});
