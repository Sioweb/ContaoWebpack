const path = require('path'),
      Common = require('./src/Common'),
      Theme = require('./src/Theme');

class ContaoWebpackConfig extends Common {

    Themes = []

    filesCache = []

    constructor(options, Themes) {
        super(options)
    }

    getTheme(options) {
        let newTheme = new Theme(options)
        this.Themes.push(newTheme)
        return newTheme
    }

    isFile(file) {
        if (file in filesCache) {
            return filesCache[file]
        }
        var result = fs.existsSync(file) && fs.statSync(file).isFile()
        if (!process.env.BROWSERSLIST_DISABLE_CACHE) {
            filesCache[file] = result
        }
        return result
    }

    getMode() {
        return this.mode
    }

    getOutputScriptName() {
        // if(this.getMode() !== 'development') {
        //     return '[name].[hash].js'
        // }
        return '[name].js'
    }

    getOutputScriptChunkFileName() {
        // if(this.getMode() !== 'development') {
        //     return '[name].[hash].js'
        // }
        return '[name].js'
    }

    getOutputStyleName() {
        return 'src/css/styles.min.css'
    }

    getOutputStyleChunkFileName() {
        return 'src/css/chunk-[id].css'
    }

    loadConfig () {
        return {
            theme: this.Themes
        }
    }

    getCommonEntries(theme, resources = null, flatten = true) {
        let entries = theme.getDefaultScripts()
        return theme.getCommonEntries(entries, resources, flatten)
    }

    // for less variables
    importGlobals(oTheme, type = 'less') {
        return oTheme.importGlobals(type)
    }

    getProvidedPlugins() {
        return {
            ContaoWebpack: require.resolve('./src/contao'),
        }
    }

    getPluginAlias() {
        return {
            // 'jquery': 'jquery/src/jquery'
        }
    }
}

module.exports = ContaoWebpackConfig;
