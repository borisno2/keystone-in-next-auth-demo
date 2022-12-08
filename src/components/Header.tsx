import React, { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { gql } from 'graphql-request'
import SignIn from './SignInButton'
import Link from 'next/link'
import { client } from '../util/request'

export function Header() {
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)

	const { data: session } = useSession()

	if (!session?.user) {
		return (
			<div style={{ height: '2rem', display: 'flex', gap: '1em' }}>
				<label>
					email:{' '}
					<input
						name="email"
						type="email"
						ref={emailRef}
						placeholder="bruce@email.com"
					/>
				</label>
				<label>
					password:{' '}
					<input
						name="password"
						type="password"
						ref={passwordRef}
						placeholder="passw0rd"
					/>
				</label>
				<SignIn />
			</div>
		)
	}

	return (
		<div
			style={{
				height: '2rem',
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			<div>Hello, {session.user?.name}!</div>
			<SignIn />
			<Link href={'/admin'}>Keystone Admin UI</Link>
		</div>
	)
}

function authenticateUser({
	email,
	password,
}: {
	email: string
	password: string
}) {
	const mutation = gql`
		mutation authenticate($email: String!, $password: String!) {
			authenticateUserWithPassword(email: $email, password: $password) {
				... on UserAuthenticationWithPasswordSuccess {
					item {
						id
						name
					}
				}
				... on UserAuthenticationWithPasswordFailure {
					message
				}
			}
		}
	`

	// session token is automatically saved to cookie
	return client.request(mutation, {
		email: email,
		password: password,
	})
}

function endUserSession() {
	const mutation = gql`
		mutation endUserSession {
			endSession
		}
	`

	return client.request(mutation)
}

function getCurrentLoggedInUser() {
	const query = gql`
		query authenticate {
			authenticatedItem {
				__typename
				... on User {
					id
					name
				}
			}
		}
	`

	// session token is automatically accessed from cookie
	return client.request(query)
}
