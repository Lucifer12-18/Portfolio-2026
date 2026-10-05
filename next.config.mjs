/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors FAIL the build (tsc is clean as of 2026-06; keep it that way).

  // The old Hirello case pages were split into two deep cases (2026-10).
  // Links already out in the world (résumé, LinkedIn posts) keep working.
  async redirects() {
    return [
      { source: "/case-stories/hirello-ai", destination: "/case-stories/hirello-networking", permanent: true },
      { source: "/case-stories/hirello-ai/full", destination: "/case-stories/hirello-networking", permanent: true },
      { source: "/case-stories/hirello-ai/networking", destination: "/case-stories/hirello-networking", permanent: true },
      { source: "/case-stories/hirello-ai/interview", destination: "/case-stories/hirello-platform#interview-gym", permanent: true },
    ]
  },
}

export default nextConfig
