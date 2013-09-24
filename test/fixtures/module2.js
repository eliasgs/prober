var Mod2 = function (msg) {
   this.msg = msg;
}; 
Mod2.prototype.speak = function (msg) {
    return msg+':from #speak';
};
module.exports = Mod2;
