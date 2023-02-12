const Common = require('./Common');

const glob = require('glob')

class Theme extends Common {
    type = 'child'
    name = ''

    RootTheme = null

    defaultEntryPoint = 'entry/main.js'

    defaultScriptName = 'src/js/scripts.min'

    defaultScripts = [
        'jquery',
        'jquery-ui',
        'jquery-ui/ui/widget',
        'jquery-ui/ui/widgets/dialog',
        'jquery-ui/ui/widgets/droppable',
        'jquery-ui/ui/widgets/sortable',
        'jquery-ui/ui/widgets/autocomplete',
        'jquery.cookie',
        'bootstrap'
    ]

    constructor(options, RootTheme = null) {
        super(options)
        this.RootTheme = RootTheme

        for (let o in options) {
            if (this[o] !== undefined && typeof this[o] !== 'function') {
                this[o] = options[o]
            }
        }
    }

    getCommonEntries(entries) {
        let selfObj = this;

        if (selfObj.type !== 'root' && selfObj.RootTheme !== null) {
            glob.sync(selfObj.themeSrc(selfObj.RootTheme.name, 'js/*.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
            glob.sync(selfObj.themeSrc(selfObj.RootTheme.name, 'js/**/*.js')).forEach(function (widget) {
                entries[selfObj.defaultScriptName].push(widget);
            });
        }

        glob.sync(selfObj.themeSrc(selfObj.name, 'js/**/*.js')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.moduleSrc('**/js/*.js')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.themeSrc(selfObj.name, 'less/*.less')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.themeSrc(selfObj.name, 'scss/*.scss')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.themeSrc(selfObj.name, 'css/*.css')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.moduleSrc('**/less/*.less')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.moduleSrc('**/scss/*.scss')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });
        glob.sync(selfObj.moduleSrc('**/css/*.css')).forEach(function (widget) {
            entries[selfObj.defaultScriptName].push(widget);
        });

        entries[selfObj.defaultScriptName].push(selfObj.themeSrc(selfObj.name, 'entry/main.js'))
        if (selfObj.type !== 'root' && selfObj.RootTheme !== null) {
            entries[selfObj.defaultScriptName].push(selfObj.themeSrc(selfObj.RootTheme.name, 'entry/main.js'))
            entries[selfObj.defaultScriptName].push(selfObj.themeSrc(selfObj.RootTheme.name, 'entry/main_after.js'))
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