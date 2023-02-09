import { list } from '@keystone-6/core'
import { createClient } from '@supabase/supabase-js'
import { allowAll, denyAll, allOperations } from '@keystone-6/core/access'
import { text, timestamp } from '@keystone-6/core/fields'
import type { Lists } from '.keystone/types'

const permissions = {
	authenticatedUser: ({ session }: any) => !!session?.id,
	public: () => true,
	readOnly: {
		operation: {
			// deny create/read/update/delete
			...allOperations(denyAll),
			// override the deny and allow only query
			query: allowAll,
		},
	},
}

export const lists: Lists = {
	User: list({
		// readonly for demo purpose
		access: permissions.readOnly,
		hooks: {
			async afterOperation({ operation, item, originalItem }) {
				if (operation === 'create' || operation === 'update') {
					const typedItem = item as Lists.User.Item
					const supabaseSudoClient = createClient(
						process.env.NEXT_PUBLIC_SUPABASE_URL!,
						process.env.SUPABASE_SERVICE_KEY!
					)
					try {
						await supabaseSudoClient.auth.admin.updateUserById(
							typedItem.subjectId,
							{
								app_metadata: { keystone: typedItem },
							}
						)
					} catch (error) {
						console.log(error)
					}
					return
				}
				if (operation === 'delete') {
					const typedItem = originalItem as Lists.User.Item
					const supabaseSudoClient = createClient(
						process.env.NEXT_PUBLIC_SUPABASE_URL!,
						process.env.SUPABASE_SERVICE_KEY!
					)
					try {
						await supabaseSudoClient.auth.admin.deleteUser(typedItem.subjectId)
					} catch (error) {
						console.log(error)
					}
					return
				}
			},
		},
		fields: {
			name: text({ validation: { isRequired: true } }),
			email: text({
				validation: { isRequired: true },
				isIndexed: 'unique',
				access: {
					// email only visible to authenticated users
					read: permissions.authenticatedUser,
				},
			}),
			subjectId: text({
				validation: { isRequired: true },
				isIndexed: 'unique',
				access: {
					// email only visible to authenticated users
					read: permissions.authenticatedUser,
				},
			}),
			role: text(),
			createdAt: timestamp({
				defaultValue: { kind: 'now' },
			}),
		},
	}),
}
