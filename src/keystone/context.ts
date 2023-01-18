import { getContext } from '@keystone-6/core/context'
import config from '../../keystone'
import { Context } from '.keystone/types'
import * as PrismaModule from '.prisma/client'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
	(globalThis as any).keystoneContext || getContext(config, PrismaModule)

if (process.env.NODE_ENV !== 'production')
	(globalThis as any).keystoneContext = keystoneContext

export async function getKeystoneSessionContext(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supabaseServerClient = createServerSupabaseClient({
		req,
		res,
	})
	const {
		data: { user },
	} = await supabaseServerClient.auth.getUser()
	const session = {
		id: user?.id,
		email: user?.email,
		data: {
			...user,
		},
	}
	return keystoneContext.withSession(session)
}
