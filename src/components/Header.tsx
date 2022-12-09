import React from 'react'
import { useSession } from 'next-auth/react'

import SignIn from './SignInButton'
import Link from 'next/link'

export function Header() {
	const { data: session } = useSession()

	if (!session?.user) {
		return (
			<div style={{ height: '2rem', display: 'flex', gap: '1em' }}>
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
