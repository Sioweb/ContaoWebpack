export class PluginManager {

	static plugins = {};

	getRegisteredPlugins() {
		return PluginManager.plugins;
	}

	registrate(name, plugin, cssSelector = null, options = {}) {
		if (!cssSelector) {
			PluginManager.plugins[name] = [new plugin()];
			return;
		}

		const elements = document.querySelectorAll(cssSelector);
		PluginManager.plugins[name] = [];
		elements.forEach((element) => {
			const newPlugin = new plugin();
			newPlugin.initEvents();
			newPlugin.setElement(element);
			newPlugin.initViewport();

			const attribute = this.nameToDataAttribute(name);
			if (element.hasAttribute(attribute)) {
				const raw = element.getAttribute(attribute);
				try {
					newPlugin.setOptions(JSON.parse(raw));
				} catch (error) {
					throw new Error(`Ungültiges JSON in ${attribute} für Plugin ${name}: ${error.message}`);
				}
			}

			if (Object.keys(options).length) {
				newPlugin.setOptions(options);
			}

			PluginManager.plugins[name].push(newPlugin);
		});
	}

	nameToDataAttribute(name) {
		return 'data-' + name.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase();
	}

	init() {
		for (const name in PluginManager.plugins) {
			for (const plugin of PluginManager.plugins[name]) {
				if (typeof plugin.init === 'function') {
					plugin.init();
				}
			}
		}
	}
}
