var events = require('events');
/**
 * Simple wrapper API for object methods. Enables investigations in the method
 * and its callback.  
 * @param {Object} object - The object under investigation.
 * @param {String} method - The name of the method under investigations.
 */
var probe = function (object, method) {
    var _probe = new events.EventEmitter();
    object[method] = function () {
        if (typeof arguments[arguments.length-1] === 'function') {
            _probe.callback = arguments[arguments.length-1];
            arguments[arguments.length-1] = function () {
                _probe.callback.callCount = _probe.callback.callCount+1 || 1;
                _probe.callback.args = _probe.callback.args || arguments;
                _probe.emit('callback');
                return _probe.callback.apply(this, _probe.callback.args);
            };
        }
        _probe.callCount = _probe.callCount+1 || 1;
        _probe.args = _probe.args || arguments;
        _probe.emit('call');
        return object.constructor.prototype[method].apply(object, _probe.args);
    };
    _probe.detach = function () {
        _probe.removeAllListeners();
        object[method] = function () {
            if (_probe.callback) {
                arguments[arguments.length-1] = function () {
                    return this.apply(this, arguments);
                }
            }
            return object.constructor.prototype[method].apply(object, arguments);
        };

    }; 
    return _probe;
};
module.exports = probe;
