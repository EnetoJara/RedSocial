export interface Message {
	_id: string,
	text: string,
	viewed: number,
	created_at: string,
	emitter: string,
	receiver: string
}
