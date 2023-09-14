export class Events {
	initEvents() {
		this.events = {};
	}

	registrateEvent(eventName) {
		this.events[eventName] = [];
	}
	
	on(eventName, callback) {
		this.events[eventName].push(callback);
	}

	dispatch(eventName, ...data) {
		for (let index in this.events[eventName]) {
			this.events[eventName][index](...data);
		}
	}
}