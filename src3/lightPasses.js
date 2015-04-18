define(function() {
    return function lightPassesConstructor(map) {
        return function lightPasses(x, y) {
            var k = x + ',' + y;
            return k in map && map[k].seeThrough;
        };
    };
});
