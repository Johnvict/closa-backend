export interface UserStruct {
	_id?: string;
	email: string;
	username: string;
	location: object;
	address: object;
	phone: string;
	type: string;
	password: string;
	lastLoginAt: string;
	createdAt: string;
}
export interface UpdateUserAccount {
	_id: string;
	email?: string;
	username?: string;
	password?: string;
	address?: string;
	location?: object;
	type?: string;
	phone?: string;
	active?: boolean;
	lastLoginAt?: number;
}

export interface UserLogin {
	email?: string;
	// username?: string;
	password: string;
}

export interface PasswordAuthValidation {
	candidatePassword: string;
	hashedPassword: string;
}

export interface ChangePassword {
	old_password: string;
	new_password: string;
}

export interface ProtectedData {
	token: string;
	password: string;
}

export interface ChatMessage {
	sender?: string | UserStruct;
	message: string;
	_id?: string;
	createdAt?: number | string;
	updatedAt?: number | string;
	status?: 'sent' | 'delivered' | 'read';
	type?: 'text' | 'file' | 'link';
}

export interface NewGroupChat {
	name: string;
	members: string[];
	message: ChatMessage;
	createdAt?: number | string;
	type: 'duel' | 'poly';
	_id?: string;
}
export interface NewGroupChatMessage {
	message: ChatMessage;
	conversation_id?: string;
	conversation_name?: string;
}
export interface GroupChatStruct {
	name: string;
	members?: UserStruct[];
	conversation: ChatMessage[];
	createdAt?: number | string;
	updatedAt?: number | string;
	type: 'duel' | 'poly';
	_id?: string;
}

export interface UpdateMessageStruct {
	conversation_id: string;
	message: ChatMessage;
}

export interface DeleteMessageStruct {
	conversation_id: string;
	message_id: ChatMessage;
}
export interface GroupChatAndMessage {
	chatId: string;
	messageId: string;
}
export interface GroupChatEntry {
	name?: string;
	_id?: string;
}
export interface SocketRoom {
	_id: string;
	name: string;
}

export interface GenericObject {
	[key: string]: string  | boolean | number | object | Date;
}

export interface ModelGenericReturnValue {
	error?: string;
	result?: UserStruct | ChatMessage
}

export interface RequestOption {
	url: string;
	method: 'POST' | 'GET' | 'PUT' | 'DELETE';
	body?: any;
	token?: string;
}

