const Common = require('./src/Common'),
      Theme = require('./src/Theme'),
      BundleTheme = require('./src/BundleTheme')

class ContaoWebpackConfig extends Common {

    Themes = []

    filesCache = []

    getTheme(options) {
        let themePath = this.findThemePath(options)

        this.Themes.push(new Theme({
            ...{
                viewsSrcPath: themePath,
                outSrcPath: themePath,
                themeSrcPath: themePath,
            },
            ...options
        }))
    }

    getBundleThemes(options) {
        let bundles = this.findBundlePaths(options)

        bundles.forEach((bundle) => {
            this.Themes.push(new BundleTheme({
                ...{
                    name: options.name,
                    type: 'bundle',
                    viewsSrcPath: bundle,
                    outSrcPath: bundle,
                    themeSrcPath: bundle,
                },
                ...options,
            }))
        })
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
        return 'src/js/[name].js'
    }

    getOutputScriptChunkFileName() {
        // if(this.getMode() !== 'development') {
        //     return '[name].[hash].js'
        // }
        return 'src/js/[name].js'
    }

    getOutputStyleName() {
        return 'src/css/styles.min.css'
    }

    getOutputStyleChunkFileName() {
        return 'src/css/chunk-[id].css'
    }

    loadConfig () {
        return {
            themes: this.Themes
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
