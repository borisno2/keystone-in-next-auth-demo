import { createYoga } from 'graphql-yoga'
import type { NextApiRequest, NextApiResponse } from 'next'
import { keystoneContext } from '../../keystone/context'
import { getSessionContext } from '../../keystone/context'

/*
  An example of how to setup your own yoga graphql server
  using the generated Keystone GraphQL schema.
*/
export const config = {
	api: {
		// Disable body parsing (required for file uploads)
		bodyParser: false,
	},
}

// Use Keystone API to create GraphQL handler
export default createYoga<{
	req: NextApiRequest
	res: NextApiResponse
}>({
	graphiql: process.env.NODE_ENV !== 'production',
	graphqlEndpoint: '/api/graphql',
	schema: keystoneContext.graphql.schema,
	context: ({ req, res }) => getSessionContext({ req, res }),
})
