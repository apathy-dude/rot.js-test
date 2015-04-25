define(['../util'], function(util) {

    function Tile(game, pos, sprite, offset) {
        this.game = game;
        this.position = pos;
        this.sprite = util.gridTileToScreen(sprite, true, offset);

        this.walkable = false;
        this.seeThrough = false;
    }

    Tile.prototype = {
    };

    return Tile;
});
