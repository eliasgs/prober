var assert = require('assert');
var Mod1 = require('./fixtures/module1');
var probe = require('../lib/probe');
mod1 = new Mod1();
describe('Probe object#method', function () {
    it('should be able to inspect a method call', function () {
        var method = probe(mod1, 'method');
        assert.equal(method.callCount, undefined);
        var res = mod1.method('test');
        assert.equal(method.callCount, 1); 
        assert.equal(method.args[0], res);
    });
    it('should be possible to inspect on events', function (done) {
        var wait = probe(mod1, 'wait');
        wait.on('call', done);
        mod1.wait(function () {});
    });
    it('should be posible to inspect callback on events', function (done) {
        var wait = probe(mod1, 'wait');
        wait.on('callback', function () {
            assert.equal(wait.callback.args[0], 1);
            assert.equal(wait.callback.args[1], 2);
            assert.equal(wait.callback.args[2], 3);
            done();
        });
        mod1.wait(function (a, b, c) {});
    });
    it('should be posible to inspect external method calls', function () {
        var speak = probe(mod1._mod2, 'speak');
        assert.equal(mod1.hello('test'), 'test:from #speak');
        assert.equal(speak.callCount, 1);
        assert.equal(speak.args[0], 'test');
    });
});
