const path = require('path')
const glob = require('glob')

class Common {
    name = ''

    dir = ''

    _ENV = {}

    mode = 'production'

    bundleSrcPath = 'privateSrc'
    viewsSrcPath = 'files/themes'
    outSrcPath = 'files/themes'
    themeSrcPath = 'files/themes'

    bundleSrc = () => {}
    viewsSrc = () => {}
    outSrc = () => {}
    themeSrc = () => {}

    constructor(options) {
        for (let o in options) {
            if (this[o] !== undefined && typeof this[o] !== 'function') {
                this[o] = options[o]
            }
        }

        for(let e in process.env) {
            if(e.indexOf('CONTAO_WEBPACK_') !== -1) {
                this._ENV[e.toUpperCase()] = process.env[e]
            }
        }

        this.bundleSrc = this.findPath(this.dir, this.bundleSrcPath)
        this.viewsSrc = this.findPath(this.dir, this.viewsSrcPath)
        this.outSrc = this.findRelativePath(this.outSrcPath)
        this.themeSrc = this.findPath(this.dir, this.themeSrcPath)
    }

    getEnv(_env) {
        _env = _env.toUpperCase()
        return (this._ENV['CONTAO_WEBPACK_' + _env] || this._ENV[_env])
    }

    findPath() {
        const locations = Array.from(arguments)
        return function () {
            const segments = locations.concat(Array.from(arguments))
            return path.resolve.apply(null, segments)
        }
    }

    findRelativePath() {
        const locations = Array.from(arguments),
            _dir = this.dir
        return function () {
            const segments = locations.concat(Array.from(arguments))
            let relativePath = path.resolve.apply(null, segments)
            relativePath = relativePath.replace(_dir, '')
            relativePath = relativePath.replace('/public', '')
            return relativePath
        }
    }

    findThemePath(options) {
        let theme = this.findPath('files/themes', options.name),
            webpackTheme = []

        const matches = glob.sync(theme('.webpack'))
        for (const hasWebpack of matches) {
            let themePath = hasWebpack.replace('.webpack', '')
            webpackTheme = themePath
            break
        }
        return webpackTheme
    }

    findBundlePaths(options) {
        let bundles = this.findPath('public/bundles'),
            webpackBundles = []

        glob.sync(bundles('**/.webpack')).forEach(function (hasWebpack) {
            let bundlePath = hasWebpack.replace('.webpack', '')
            webpackBundles.push(bundlePath + options.name + '/')
        });
        return webpackBundles
    }
}

module.exports = Common;
