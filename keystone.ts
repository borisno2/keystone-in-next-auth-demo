import dotenv from 'dotenv-flow'
import { TypeInfo } from '.keystone/types'
import { lists } from './src/keystone/schema'

import * as Path from 'path'

import { config } from '@keystone-6/core'
dotenv.config()

export default config<TypeInfo>({
	db: {
		provider: 'postgresql',
		url: process.env.DATABASE_URL!,
		prismaClientPath: 'node_modules/.prisma/client',
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
})
