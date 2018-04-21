import { User } from './user';

export interface Publication {
	_id: string,
	text: string,
	file: string,
	created_at: string,
	user: User
}
