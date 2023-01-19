import { getContext } from '@keystone-6/core/context'
import config from '../../keystone'
import { Context } from '.keystone/types'
import * as PrismaModule from '.prisma/client'
import { IncomingMessage, ServerResponse } from 'http'

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
	(globalThis as any).keystoneContext || getContext(config, PrismaModule)

if (process.env.NODE_ENV !== 'production')
	(globalThis as any).keystoneContext = keystoneContext

export async function getKeystoneSessionContext(props: {
	req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> }
	res: ServerResponse<IncomingMessage>
}) {
	const { req, res } = props
	return keystoneContext.withRequest(req, res)
}
