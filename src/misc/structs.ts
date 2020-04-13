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
export interface NewAdmin {
	password: string;
	phone: string;
	username: string;
	email: string;
	dob: string;
	gender: string;
	type: 'user' | 'worker';
}
export interface UpdateAdmin {
	id: number;
	password?: string;
	phone?: string;
	username?: string;
	email?: string;
	dob?: string;
	gender?: string;
	lastLoginAt?: Date;
	type?: 'user' | 'worker';
}
export interface Admin extends Regular {
	password: string;
	phone: string;
	username: string;
	email: string;
	dob: string;
	gender: string;
	type: 'user' | 'worker';
}
export interface NewToken {
	agent_id: number;
	token: string;
	expireAt: Date;
}
export interface Token extends Regular {
	agent_id: number;
	token: string;
	expireAt: Date;
}
export interface UpdateAgent {
	phone?: string;
	type?: 'user' | 'worker';
	active?: boolean;
	password?: string;
	username?: string;
	email?:  string;
	dob?: Date | string | number;
	gender?: 'male' | 'female';
	lastLoginAt?: Date | string | number;
}

export interface Agent extends Regular {
	phone: string;
	password: string;
	type: 'user' | 'worker';
	username?: string;
	email?:  string;
	dob?: Date | string | number;
	gender?: 'male' | 'female';
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
	avatar?: string;
}
export interface UpdateUser {
	agent_id: number;
	name?: string;
	occupation?: string;
	avatar?: string;
}
export interface UserStruct extends Regular {
	name: string;
	avatar: string;
	occupation?: string;
}


export interface NewWorker {
	agent_id: number;
	job: string;
	name: string;
	opening_time: string;
	closing_time: string;
	working_days: string | string[];
	logo?: string;
}
export interface UpdateWorker {
	agent_id: number;
	job?: string;
	opening_time?: string;
	closing_time?: string;
	working_days?: string | string[];
	logo?: string;
}
export interface WorkerStruct extends Regular {
	agent_id: number;
	job: string;
	name: string;
	opening_time: string;
	closing_time: string;
	working_days: string | string[];
	logo?: string;
	status: 'available' | 'away';
	job_sample?: JobSample[];
}

export interface NewSearchHistory {
	agent_id: number;
	key: string;
}
export interface SearchHistory extends Regular{
	agent_id: number;
	key: string;
}

export interface SearchWorkerFromStateTown {
	job: string;
	state_or_town: 'state' | 'town';
	state_or_town_id: number;
	my_lat: number;
	my_long: number;
}

export interface SearchHistoryFromStateTown {
	key: string;
	sort: 'asc' | 'desc';
	state_or_town: 'state' | 'town' | 'all';
	state_or_town_id: number;
	start_range: Date | string;
	end_range: Date | string;
	grouped_by: string;
	page?: number
}

export interface NewLocation {
	agent_id: number
	lat: string | null;
	long: string;
	name: string;
	image: string;
	state_id: number;
	town_id?: number;
	town_name?: string;
}

export interface UpdateLocation {
	agent_id: number
	lat?: string;
	long?: string;
	name?: string;
	image?: string;
	state_id?: number;
	town_id?: number;
	town_name?: string;
}
export interface Location extends Regular {
	agent_id: number;
	long: string;
	lat: string;
	name: string;
	image: string;
	state_id: number;
	town_id: number;

	state?: State;
	town?: Town;
}

export interface NewJobSample {
	worker_id: number;
	date_done: Date | string;
	title: string;
	link: string | null;
	type: 'audio' | 'video' | 'image' | 'pdf' | 'link';
}
export interface JobSample extends Regular {
	worker_id: number;
	date_done: Date | string;
	title: string;
	file: FileStruct;
}

export interface NewFileStruct {
	job_sample_id: number;
	name: string;
	type: 'audio' | 'video' | 'image' | 'pdf' | 'link';
	url: string | null;
}
export interface FileStruct extends Regular{
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
	id: number;
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
	status: 'cancelled' | 'pending' | 'doing' | 'done_pending' | 'done';
	cancelled_by?: 'worker' | 'user';
	cancelled_reason?: 'price' | 'trust' | 'imcapability' | 'self';
}

export interface JobByStatusFromStateOrTown {
	title: string;
	state_or_town: 'state' | 'town' | 'all';
	state_or_town_id: number;
	start_range: Date | string;
	end_range: Date | string;
	grouped_by: string;
	sort: 'asc' | 'desc';
	page?: number
}

export interface NewUpdateState {
	id: number;
	name?: string;
}
export interface State extends Regular {
	name: string;
}
export interface NewUpdateTown {
	id?: number;
	state_id?: number;
	long?: string;
    lat?: string;
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

