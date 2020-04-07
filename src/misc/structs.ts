export interface Regular {
	id: number;
	createdAt?: Date | string | number;
	updatedAt?: Date | string | number;
}

export interface NewPhone {
	phone: string;
}
export interface NewAgent {
	password: string;
	phone: string;
	type: 'user' | 'worker';
}
export interface UpdateAgent {
	phone?: string;
	type?: 'user' | 'worker';
	active?: boolean;
	password?: string;
	lastLoginAt?: Date | string | number;
	// web?: boolean;
	// app?: boolean;
}

export interface Agent extends Regular {
	phone: string;
	password: string;
	type: 'user' | 'worker';
	active: boolean;
	lastLoginAt?: Date | string | number;
	location?: Location;
	worker_jobs?: Job[];
	user_jobs?: Job[];
	profile?: UserStruct;
	business?: WorkerStruct;
	search_histories?: SearchHistory[];
}
export interface NewUser {
	agent_id: number;
	name: string;
	occupation?: string;
}
export interface UpdateUser {
	agent_id: number;
	name?: string;
	occupation?: string;
}
export interface UserStruct extends Regular {
	name: string;
	occupation?: string;
}


export interface NewWorker {
	agent_id: number;
	job: string;
	business_name: string;
	opening_time: string;
	closing_time: string;
	working_days: string | string[];
	business_logo?: string;
}
export interface UpdateWorker {
	agent_id: number;
	job?: string;
	opening_time?: string;
	closing_time?: string;
	working_days?: string | string[];
	business_logo?: string;
}
export interface WorkerStruct extends Regular {
	agent_id: number;
	job: string;
	business_name: string;
	opening_time: string;
	closing_time: string;
	working_days: string | string[];
	business_logo?: string;
	status: 'available' | 'away';
	job_sample?: JobSample[];
}

export interface NewSearchHistory extends Regular{
	key: string;
}
export interface SearchHistory extends Regular{
	agent_id: number;
	key: string;
}

export interface NewLocation {
	lat: string;
	long: string;
	name: string;
	image: string;
	state_id: string;
	town_id: string;
}
export interface UpdateLocation {
	lat?: string;
	long?: string;
	name?: string;
	image?: string;
	state_id?: string;
	town_id?: string;
}
export interface Location extends Regular {
	agent_id: number;
	long: string;
	lat: string;
	name: string;
	image: string;
	state_id: string;
	town_id: string;

	state?: State;
	town?: Town;
}

export interface NewJobSample {
	date_done: Date | string;
	title: string;
	file: {
		data: string;
		type: 'audio' | 'video' | 'image' | 'pdf' | 'link';
	};
}
export interface JobSample extends Regular {
	worker_id: number;
	date_done: Date | string;
	title: string;
	file: File;
}

export interface File extends Regular{
	job_sample_id: number;
	name: string;
	type: 'audio' | 'video' | 'image' | 'pdf' | 'link';
	url: string;
}

export interface NewJob {
	worker_id: number;
	user_id: number;
	title: string;
}


export interface UpdateJob {
	status?: 'canceled' | 'pending' | 'doing' | 'done_pending' | 'done';
	start?: Date | string;
	est_delivery?: Date | string;
	delivery?: Date | string;
	rating?: "1" | 1 | "2" | 2 | "3" | 3 | "4" | 4 | "5" | 5;
	amount?: number;
	proposed_amount?: number;
	cancelled_by?: 'worker' | 'user';
	cancelled_reason?: 'price' | 'trust' | 'imcapability' | 'self';
}

export interface Job extends Regular {
	worker_id: number;
	user_id: number;
	title: string;
	start?: Date | string;
	est_delivery?: Date | string;
	delivery?: Date | string;
	rating?: "1" | 1 | "2" | 2 | "3" | 3 | "4" | 4 | "5" | 5;
	feedback?: string;
	amount?: number;
	proposed_amount?: number;
	status: 'canceled' | 'pending' | 'doing' | 'done_pending' | 'done';
	cancelled_by?: 'worker' | 'user';
	cancelled_reason?: 'price' | 'trust' | 'imcapability' | 'self';
}

export interface NewUpdateState {
	name?: string;
}
export interface State extends Regular {
	name: string;
}
export interface NewUpdateTown {
	state_id?: number;
	name?: string;
}
export interface Town extends Regular {
	state_id: number;
	name: string;
}


// export interface UpdateUserAccount {
// 	active?: boolean;
// 	id: number;
// 	phone?: string;
// 	password?: string;
// 	location?: object;
// 	address?: object;
// 	type?: string;
// 	lastLoginAt?: Date | string | number;
// 	createdAt?: Date | string | number;
// 	updatedAt?: Date | string | number;
// }

export interface LoginStruct {
	phone: string;
	password: string;
	// source: 'app' | 'web';
}

export interface PasswordAuthValidation {
	candidatePassword: string;
	hashedPassword: string;
}

export interface UpdatePassword {
	old_password: string;
	new_password: string;
}

export interface ProtectedData {
	token: string;
	password: string;
}

export interface GenericObject {
	[key: string]: any;
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

