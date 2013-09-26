var events = require('events');
/**
 * Simple wrapper API for object methods. Enables investigations in the method
 * and its callback.  
 * @param {Object} object - The object under investigation.
 * @param {String} method - The name of the method under investigations.
 */
var probe = function (object, method) {
    if (object[method]._probe) return object[method]._probe;
    var _probe = new events.EventEmitter();
    object[method] = function () {
        if (typeof arguments[arguments.length-1] === 'function') {
            _probe.callback = _probe.callback || arguments[arguments.length-1];
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
        object[method] = object.constructor.prototype[method];
    }; 
    _probe.stub = function (func) {
        object[method] = func;
        return _probe;
    };
    _probe.stub.callback = function (func) {
        _probe.callback = func;    
        return _probe;
    };
    object[method]._probe = _probe;
    return _probe;
};
module.exports = probe;
