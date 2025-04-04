const Common = require('./Common');

const glob = require('glob')

class Theme extends Common {
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
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/init.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.themeSrc('js/base.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/frontend.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (resources.includes('less')) {
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/init.less')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.themeSrc('less/*.less')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/frontend.less')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (resources.includes('scss')) {
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/init.scss')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.themeSrc('scss/base.scss')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/frontend.scss')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        if (resources.includes('css')) {
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/init.css')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.themeSrc('css/*.css')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.bundleSrc('**/**/src/Resources/assets/frontend.css')).forEach(function (widget) {
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

    // for less variables
    importGlobals(type = 'less') {
        let entries = {};
        let selfObj = this;
        glob.sync(selfObj.themeSrc('', '*')).forEach(function (widget) {
            let theme = widget.substring(widget.lastIndexOf('/') + 1)

            entries[theme + 'Path'] = '"' + widget + '"'

            glob.sync(selfObj.themeSrc(theme, '**/**/__*.' + type)).forEach(function (widget, matches) {
                let filename = widget.substring(widget.lastIndexOf('/') + 3)
                filename = filename.charAt(0).toUpperCase() + filename.slice(1)
                filename = theme + filename
                filename = filename.replace(/\..*/gm, '')

                entries[filename] = widget
            })
        })

        if(this.getEnv('THEME') !== undefined) {
            entries['activeThemePath'] = '"' + selfObj.themeSrc(this.getEnv('THEME')) + '"'
            glob.sync(selfObj.themeSrc(this.getEnv('THEME'), '**/**/__*.' + type)).forEach(function (widget, matches) {
                let filename = widget.substring(widget.lastIndexOf('/') + 3)
                filename = filename.charAt(0).toUpperCase() + filename.slice(1)
                filename = 'activeTheme' + filename
                filename = filename.replace(/\..*/gm, '')

                entries[filename] = widget
            })
        }

        return entries
    }
}

module.exports = Theme;
