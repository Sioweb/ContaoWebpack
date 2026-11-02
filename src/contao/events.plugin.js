export class Events {
	initEvents() {
		this.events = {};
	}

	registrateEvent(eventName) {
		this.events = this.events || {};
		this.events[eventName] = this.events[eventName] || [];
	}

	on(eventName, callback) {
		this.registrateEvent(eventName);
		this.events[eventName].push(callback);
	}

	dispatch(eventName, ...data) {
		for (const callback of (this.events && this.events[eventName]) || []) {
			callback(...data);
		}
	}
}
