var events = require('events');
/**
 * Simple wrapper API for object methods. Enables investigations in the method
 * and its callback.  
 * @param {Object} object - The object under investigation.
 * @param {String} method - The name of the method under investigations.
 */
var noprobe = function (object, method) {
    if (object[method]._probe) return object[method]._probe;
    var probe = new events.EventEmitter();
    var stub = function (func) {
        return function () {
            if (typeof arguments[arguments.length-1] === 'function') {
                probe.callback = probe.callback || arguments[arguments.length-1];
                arguments[arguments.length-1] = function () {
                    probe.callback.callCount = probe.callback.callCount+1 || 1;
                    probe.callback.args = probe.callback.args || arguments;
                    probe.emit('callback');
                    return probe.callback.apply(this, probe.callback.args);
                };
            }
            probe.callCount = probe.callCount+1 || 1;
            probe.args = probe.args || arguments;
            probe.emit('call');
            return func.apply(object, probe.args);
        };
    };
    object[method] = stub(object.constructor.prototype[method]);
    probe.detach = function () {
        probe.removeAllListeners();
        delete object[method]
    }; 
    probe.stub = function (func) {
        object[method] = stub(func);
        object[method]._probe = probe;
        return probe;
    };
    probe.stub.callback = function (func) {
        probe.callback = stub(func);    
        return probe;
    };
    object[method]._probe = probe;
    return probe;
};
module.exports = noprobe;
