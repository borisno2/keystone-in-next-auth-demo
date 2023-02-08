import { NextApiRequest, NextApiResponse } from 'next/types'
import dotenv from 'dotenv-flow'
import { Context } from '.keystone/types'
import { lists } from './src/keystone/schema'
import { seedDemoData } from './src/keystone/seed'

import * as Path from 'path'

import { config } from '@keystone-6/core'
import { SessionStrategy } from '@keystone-6/core/types'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

export default config({
	db: {
		provider: 'postgresql',
		url: process.env.DATABASE_URL!,
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
})
