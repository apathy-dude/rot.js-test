define(function() {
    
    function Entity(game, pos, sprite) {
        this.game = game;
        this.position = pos;
        this.sprite = sprite;
    }

    Entity.prototype = {
        move: function(x, y) {
            this.position.x += x;
            this.position.y += y;
        },
        act: function() { /* Placeholder */ },
        draw: function() {
            //TODO
            this.game.display.draw(this.position.x, this.position.y, this.sprite.symbol, this.sprite.color);
        }
    };

    return Entity;
});
