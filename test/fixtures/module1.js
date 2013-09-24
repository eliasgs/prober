var Mod2 = require('./module2');
var mod2 = new Mod2('hello from module1');
var Mod1 = function () {
    this._mod2 = mod2;
};
Mod1.prototype.hello = function (msg) {
    return this._mod2.speak(msg);
};
Mod1.prototype.wait = function (callback) {
    setTimeout(callback, 100, 1, 2, 3);
};
Mod1.prototype.method = function (arg) {return arg;};
module.exports = Mod1;
