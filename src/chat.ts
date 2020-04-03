export interface ChatStruct {
	sender: string
	message: string
	createdAt: number
}

export class Chat {
	private className = 'Chat private name'
	classNamePublic = 'Chat class public'
	constructor() {
		console.log('CHAT-CLASS-WORKING: ', this.className, this.classNamePublic);
	}

	getPrivateName() {
		return this.className
	}

	getPublicName() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(`async ${this.classNamePublic}`)
			}, 3000)
		})
	}

}