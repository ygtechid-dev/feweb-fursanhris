/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        locale: false
      },
      {
        source: '/project-management-workspace',
        destination: '/projects',
        permanent: false,
        locale: false
      }
    ]
  }
}

export default nextConfig
