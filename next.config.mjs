/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Temporary (307) rather than permanent: browsers cache a 308
      // indefinitely, which is painful to undo while the structure is still
      // moving. Switch to permanent once settled.
      { source: "/now", destination: "/journey", permanent: false },
      { source: "/about", destination: "/journey", permanent: false },
      { source: "/stack", destination: "/#stack", permanent: false },
    ];
  },
};

export default nextConfig;
