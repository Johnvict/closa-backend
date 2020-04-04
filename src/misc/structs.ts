export interface UserStruct {
	id?: number;
	phone: string;
	password: string;
	location?: object;
	address?: object;
	type?: string;
	lastLoginAt?: Date | string | number;
	createdAt?: Date | string | number;
	updatedAt?: Date | string | number;
}
export interface UpdateUserAccount {
	active?: boolean;
	id: number;
	phone?: string;
	password?: string;
	location?: object;
	address?: object;
	type?: string;
	lastLoginAt?: Date | string | number;
	createdAt?: Date | string | number;
	updatedAt?: Date | string | number;
}

export interface UserLogin {
	phone: string;
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

export interface GenericObject {
	[key: string]: string  | boolean | number | object | Date;
}

export interface ModelGenericReturnValue {
	error?: string;
	result?: UserStruct
}

export interface RequestOption {
	url: string;
	method: 'POST' | 'GET' | 'PUT' | 'DELETE';
	body?: any;
	token?: string;
}

