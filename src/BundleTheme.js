const Common = require('sioweb-contao-webpack/src/Common');

const glob = require('glob')

class BundleTheme extends Common {
    defaultEntryPoint = 'js/base.js'

    defaultScriptName = 'src/js/scripts.min'

    defaultScripts = [
        // 'jquery',
        // 'bootstrap'
    ]

    constructor(options) {
        super(options)
    }

    getCommonEntries(resources = null, flatten = null) {
        let selfObj = this,
            entries = {};

        entries[selfObj.defaultScriptName] = [];

        resources = resources || ['scss', 'js'];
        flatten = flatten !== null ? flatten : true;

        if (resources.includes('js')) {
            glob.sync(selfObj.themeSrc('js/base.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (resources.includes('scss')) {
            glob.sync(selfObj.themeSrc('scss/base.scss')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (resources.includes('css')) {
            glob.sync(selfObj.themeSrc('css/*.css')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (flatten) {
            return Object.values(entries).flat();
        }

        return entries
    }

    getDefaultScripts(defaultScripts = []) {
        let Scripts = {};

        Scripts[this.defaultScriptName] = [];
        if (!defaultScripts.length) {
            Scripts[this.defaultScriptName] = JSON.parse(JSON.stringify(this.defaultScripts))
        } else {
            Scripts[this.defaultScriptName] = JSON.parse(JSON.stringify(defaultScripts))
        }

        return Scripts
    }
}

module.exports = BundleTheme;
