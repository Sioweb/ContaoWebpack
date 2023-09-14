const SiowebContaoWebpack = require('sioweb-contao-webpack')

class ContaoWebpackConfig extends SiowebContaoWebpack {

    constructor(options) {
        super(options)

        this.getTheme({ type: 'root', name: 'default' })
    }

    /**
     * @return (string) development
     */
    getMode() {
        return super.getMode()
    }

    /**
     * @return (string) [name].js
     */
    getOutputScriptName() {
        return super.getOutputScriptName()
    }

    /**
     * @return (string) [name].js
     */
    getOutputScriptChunkFileName() {
        return super.getOutputScriptChunkFileName()
    }

    /**
     * @return (string) src/css/styles.min.css
     */
    getOutputStyleName() {
        return super.getOutputStyleName()
    }

    /**
     * @return (string) src/css/chunk-[id].css
     */
    getOutputStyleChunkFileName() {
        return super.getOutputStyleChunkFileName()
    }
    
    /**
     * @return (object) Webpack Config like {theme: ...}
     */
    loadConfig() {
        return super.loadConfig()
    }

    getCommonEntries(theme) {
        return super.getCommonEntries(theme)
    }

    /**
     * LESS ONLY (Sass be coming soon..)
     * @param {object} oTheme 
     * @param {string} type 
     * @return Array with Files which can be imported into all LESS files 
     */
    importGlobals(oTheme, type = 'less') {
        return super.importGlobals(oTheme, type)
    }

    /**
     * @returns {object} Object with plugins like {overlib: 'overlib'}
     */
    getProvidedPlugins() {
        return super.getProvidedPlugins()
    }

    /**
     * @return {object} Alias scripts like {'jquery': 'jquery/src/jquery'}
     */
    getPluginAlias() {
        return super.getPluginAlias()
    }
}

module.exports = ContaoWebpackConfig;