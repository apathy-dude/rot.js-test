define(function() {
    
    function Entity(gameData, pos, sprite) {
        this.gameData = gameData;
        this.position = pos;
        this.sprite = sprite;
        this.lightRange = 0;
    }

    Entity.prototype = {
        move: function(x, y) {
            this.position.x += x;
            this.position.y += y;
        },
        act: function() { throw "Not implemented"; },
        interact: function(source) {}
    };

    return Entity;
});
