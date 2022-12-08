import { Context } from '.keystone/types'
import { lists } from './src/keystone/schema'
import { getSession as getNextAuthSession } from 'next-auth/react'
import { seedDemoData } from './src/keystone/seed'

import * as Path from 'path'

import { config } from '@keystone-6/core'
const dbFilePath = `${process.cwd()}/keystone.db`

const getSession = async ({ context }: any) => {
	const { req, res } = context
	if (!req || !res) return null
	const session = await getNextAuthSession({ req })
	return session
}

export default config({
	db: {
		provider: 'sqlite',
		url: `file:${dbFilePath}`,
		onConnect: async (context: Context) => {
			await seedDemoData(context)
		},
	},
	ui: {
		getAdditionalFiles: [
			async () => [
				{
					mode: 'copy',
					inputPath: Path.resolve('./next-config.js'),
					outputPath: 'next.config.js',
				},
			],
		],
	},
	server: {
		port: 4000,
	},
	lists,
	getSession,
})
