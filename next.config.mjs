/**
 * @type {import('next').NextConfig}
 */
import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cache static assets
      urlPattern: ({ request }) =>
        request.destination === "document" ||
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }, // Cache for 1 week
      },
    },
    {
      // Cache API responses
      urlPattern: ({ url }) => url.pathname.startsWith("/api"),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10, // Fallback to cache after 10 seconds
      },
    },
    {
      // Offline fallback for HTML pages
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "html-cache",
      },
    },
  ],
});

export default nextConfig;
