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
        _probe.callback = arguments[arguments.length-1];
        arguments[arguments.length-1] = function () {
            _probe.callback.callCount = _probe.callback.callCount+1 || 1;
            _probe.callback.args = _probe.callback.args || arguments;
            _probe.callback.apply(this, _probe.callback.args);
            _probe.emit('callback');
        };
        _probe.callCount = _probe.callCount+1 || 1;
        _probe.args = _probe.args || arguments;
        this.constructor.prototype[method].apply(this, _probe.args);
        _probe.emit('call');
    };
    return _probe;
};
module.exports = probe;
