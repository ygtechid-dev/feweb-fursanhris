
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['127.0.0.1', 'localhost'],
  },
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fr|ar|id)',
        destination: '/:lang/dashboard',
        permanent: false,
        locale: false
      },
      {
        source: '/en/project-management-workspace',
        destination: '/projects',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
