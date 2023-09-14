import { Viewport } from "./viewport.plugin";

export class Plugin extends Viewport {
	setElement(element = null) {
		this.el = element;
	}

	setOptions(options) {
		this.options = {...this.options, ...options};
	}
}