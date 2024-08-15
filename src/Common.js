const path = require('path')

class Common {

    dir = ''

    _ENV = {}

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
    }

    getEnv(_env) {
        _env = _env.toUpperCase()
        return (this._ENV['CONTAO_WEBPACK_' + _env] || this._ENV[_env])
    }

    mode = 'production'
    bundleSrc = this.findPath('bundles', this.dir)
    viewsSrc = this.findPath('files/themes', this.dir)
    outSrc = this.findPath('files/themes', this.dir)
    themeSrc = this.findPath('files/themes', this.dir)

    findPath() {
        const locations = Array.from(arguments)
        function f() {
            // yo, I heard you like varargs
            const segments = locations.concat(Array.from(arguments))
            return path.resolve.apply(null, segments)
        }

        return f
    }
}

module.exports = Common;
