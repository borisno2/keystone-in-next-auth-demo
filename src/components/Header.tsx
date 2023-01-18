import React, { useState, useRef, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export function Header() {
	const supabaseClient = createBrowserSupabaseClient()
	const [isLoading, setLoading] = useState<boolean>(true)
	const [user, setUser] = useState<{ name: string } | null>(null)
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		supabaseClient.auth
			.getSession()
			.then((data) => {
				if (data.data.session?.user.email) {
					setUser({ name: data.data.session?.user.email })
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const login = async () => {
		if (emailRef.current && passwordRef.current) {
			const email = emailRef.current.value
			const password = passwordRef.current.value

			const { data, error } = await supabaseClient.auth.signInWithPassword({
				email,
				password,
			})
			if (error) {
				console.log('error', error)
			}
			if (data?.user?.email) {
				setUser({ name: data?.user.email })
				window.location.reload()
			}
		}
	}
	const register = async () => {
		if (emailRef.current && passwordRef.current) {
			const email = emailRef.current.value
			const password = passwordRef.current.value

			const { data, error } = await supabaseClient.auth.signUp({
				email,
				password,
			})
			if (error) {
				console.log('error', error)
			}
			if (data?.user?.email) {
				setUser({ name: data?.user.email })
				window.location.reload()
			}
		}
	}

	const logout = async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (!error) {
			setUser(null)
			window.location.reload()
		} else {
			console.log('error', error)
		}
	}

	if (isLoading) {
		// empty div to prevent layout jump
		return <div style={{ height: '2rem' }} />
	}

	if (!user) {
		return (
			<div
				style={{
					height: '2rem',
					display: 'flex',
					gap: '1em',
					alignItems: 'flex-end',
				}}
			>
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
				<button onClick={login}>login</button>
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
				<button onClick={register}>register</button>
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
			<div>Hello, {user.name}!</div>
			<button onClick={logout}>logout</button>
		</div>
	)
}
