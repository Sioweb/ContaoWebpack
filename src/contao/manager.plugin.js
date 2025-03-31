export class PluginManager {

	static plugins = {};

	constructor() {
	}

	getRegisteredPlugins() {
		return PluginManager.plugins;
	}

	registrate(name, plugin, cssSelector = null, options = {}) {
		if (cssSelector) {
			let elements = document.querySelectorAll(cssSelector);
			PluginManager.plugins[name] = [];
			elements.forEach((element) => {
				let newPlugin = new plugin();
				newPlugin.initEvents();
				newPlugin.setElement(element);
				newPlugin.initViewport();
				try {
					if (element.hasAttribute(this.nameToDataAttribute(name))) {
						newPlugin.setOptions(JSON.parse(element.dataset[this.lcfirst(name)]))
					}
				} catch(e) {}

				if (Object.keys(options).length) {
					newPlugin.setOptions(options);
				}

				PluginManager.plugins[name].push(newPlugin);
			});
			return;
		}
		PluginManager.plugins[name] = [new plugin()];
	}

	nameToDataAttribute(name) {
		name = name.replace(/(.)([A-Z])/g, '$1-$2');
		name = name.toLowerCase();
		return 'data-' + name;
	}

	lcfirst(string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	}

	init() {
		for(let plugins in PluginManager.plugins) {
			for(let selector in PluginManager.plugins[plugins]) {
				PluginManager.plugins[plugins][selector].init();
			}
		}
	}
}
