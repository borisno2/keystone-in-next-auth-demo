import NextAuth from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import { keystoneContext } from '../../../keystone/context'

export const authOptions = {
	callbacks: {
		async signin({ account }: any) {
			const user = await keystoneContext.sudo().db.User.findOne({
				where: { subjectId: account.id },
			})
			if (!user) {
				console.log('user not found, creating one')
				await keystoneContext.sudo().db.User.createOne({
					data: {
						subjectId: account.id,
						email: account.email,
						name: account.name,
					},
				})
			}
			return true
		},
		async session({ session, token }: any) {
			const { id, name, email, role } = token
			return { ...session, data: { id, name, email, role } }
		},
		async jwt({ token, user }: any) {
			const userInDb = await keystoneContext.sudo().query.User.findOne({
				where: { subjectId: token.sub },
				query: 'id name email role',
			})
			if (user) {
				token = { ...token, ...user }
			}
			if (userInDb) {
				token = { ...token, ...userInDb }
			}
			
			return token
		}
	},
	providers: [
		Auth0({
			clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
			clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
			issuer:
				process.env.AUTH0_ISSUER_BASE_URL || 'https://opensaas.au.auth0.com',
		}),
		// ...add more providers here
	],
}

export default NextAuth(authOptions)
