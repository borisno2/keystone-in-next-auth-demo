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

const session: SessionStrategy<any> = {
	get: async ({ context }) => {
		if (!context.req || !context.res) {
			return null
		}
		const supabaseServerClient = createServerSupabaseClient({
			req: context.req as NextApiRequest,
			res: context.res as NextApiResponse,
		})
		const {
			data: { user },
		} = await supabaseServerClient.auth.getUser()

		if (!user || !user.id) {
			return null
		}
		const dbUser = await context.sudo().db.User.findOne({
			where: {
				subjectId: user?.id,
			},
		})
		if (!dbUser) {
			return null
		}

		const supabaseSudoClient = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_KEY!
		)

		const { data: updatedUser, error } =
			await supabaseSudoClient.auth.admin.updateUserById(user.id, {
				app_metadata: { keystone: dbUser },
			})

		const session = {
			id: dbUser.id,
			email: user?.email,
			data: {
				...updatedUser,
			},
		}

		return session
	},
	start: async () => {
		//start not used
		return null
	},
	end: async ({ context }) => {
		if (!context.req || !context.res) {
			return null
		}
		const supabaseServerClient = createServerSupabaseClient({
			req: context.req as NextApiRequest,
			res: context.res as NextApiResponse,
		})
		await supabaseServerClient.auth.signOut()
	},
}

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
	session,
})
