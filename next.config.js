// you don't need this if you're building something outside of the Keystone repo
const withPreconstruct = require('@preconstruct/next')
const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'
const Path = require('path')

module.exports = withPreconstruct({
	webpack(config) {
		config.externals = [...config.externals, '.prisma/client']
		return config
	},
	experimental: {
		appDir: true,
		serverComponentsExternalPackages: ['graphql'],
	},
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: '/admin',
					destination: `${KEYSTONE_URL}/admin`,
				},
				{
					source: '/admin/:admin*',
					destination: `${KEYSTONE_URL}/admin/:admin*`,
				},
			],
		}
	},
})
