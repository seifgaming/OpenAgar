// No license here!

module.exports = {
argsParser: function(str,splitpoint) { // commandname first:hello,secound:just,third:testing --> Object{first:"hello",secound:"just",third:"testing"  }
        var cmd = str.split(" ");
        if (!splitpoint) splitpoint = 1;
        var args = cmd.slice(splitpoint,cmd.length).join(" ").split(",");
        var results = [];
        for (var i in args) {
            var arg = args[i];
            var a = arg.split(":");
            results[a[0]] = a[1];
        }
        return results; 
    }
}