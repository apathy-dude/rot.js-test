define(function() {
    return function lightPassesConstructor(map) {
        return function lightPasses(x, y) {
            return x + ',' + y in map;
        };
    };
});
