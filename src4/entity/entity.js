define(['../util'], function(util) {
    
    function Entity(gameData, pos, sprite, offset) {
        this.gameData = gameData;
        this.position = pos;
        this.sprite = util.gridTileToScreen(sprite, false, offset);
        this.lightRange = 0;
    }

    Entity.prototype = {
        move: function(diff) {
            this.position.x += diff[0];
            this.position.y += diff[1];

            this.sprite.position.x += util.tileSize * diff[0];
            this.sprite.position.y += util.tileSize * diff[1];
        },
        act: function() { throw "Not implemented"; },
        interact: function(source) {}
    };

    return Entity;
});
