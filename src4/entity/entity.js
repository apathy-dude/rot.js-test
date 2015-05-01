define(['../util'], function(util) {
    
    function Entity(gameData, pos, sprite, offset) {
        this.gameData = gameData;
        this.position = pos;
        this.sprite = util.gridTileToScreen(sprite, false, offset);
        this.lightRange = 0;
        this.speed = 100;
    }

    Entity.prototype = {
        move: function(diff) {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;

            //TODO: Do proper speed
            this.sprite.body.velocity.x = this.speed * diff[0];
            this.sprite.body.velocity.y = this.speed * diff[1];

            var newX = Math.floor(this.sprite.body.x / util.getTrueTileSize());
            var newY = Math.floor(this.sprite.body.y / util.getTrueTileSize());

            this.position.x = newX;
            this.position.y = newY;
        },
        act: function() { throw "Not implemented"; },
        interact: function(source) {}
    };

    return Entity;
});
