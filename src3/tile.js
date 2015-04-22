define(function() {

    function Tile(game, pos, sprite) {
        this.game = game;
        this.position = pos;
        this.sprite = sprite;

        this.walkable = false;
        this.seeThrough = false;
    }

    Tile.prototype = {
    };

    return Tile;
});
