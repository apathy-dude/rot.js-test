define(function() {
    
    function Entity(gameData, pos, sprite) {
        this.gameData = gameData;
        this.position = pos;
        this.sprite = sprite;
    }

    Entity.prototype = {
        move: function(x, y) {
            this.position.x += x;
            this.position.y += y;
        },
        act: function() { throw "Not implemented"; },
    };

    return Entity;
});
