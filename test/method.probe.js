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
        wait.detach();
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
    it('should not work after detach', function (done) {
        var wait = probe(mod1, 'wait');
        wait.on('call', function () {
            done(new Error('probe still works'));
        });
        wait.on('callback', function () {
            done(new Error('probe still works'));
        });
        wait.detach();
        mod1.wait(function () {done();});
    });
    it('should to change method behaviour', function () {
        var wait = probe(mod1, 'wait').stub(function () {
            return 'hello from stub';
        });
        assert.equal(mod1.wait(), 'hello from stub');
    });
    it('should to change callback behaviour', function () {
        var wait = probe(mod1, 'wait').stub.callback(function (arg) {
            assert.equal(arg, 1);
            arguments[0] = 'hello from callback';
        });
        mod1.wait(function () {
            throw new Error('callback behaviour still active');
        });
        wait.on('callback', function () {
            assert.equal(wait.callback.args[0], 'hello from callback');
        });
    });
    it('should return already created probe', function () {
        probe(mod1, 'wait').detach();
        assert.equal(mod1.wait._probe, undefined);  
        probe(mod1, 'wait');
        assert(mod1.wait._probe);
        mod1.wait._probe = 'probe';
        probe(mod1, 'wait');
        assert.equal(mod1.wait._probe, 'probe');
    });
});
