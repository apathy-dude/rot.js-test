define(['./tile'], function(Tile) {

    function Floor(game, pos) {
        Tile.call(this, game, pos, game.add.sprite(pos.x * 16, pos.y * 16, 'tiles', 6));
        this.walkable = true;
        this.seeThrough = true;
    }

    Floor.prototype = Object.create(Tile.prototype, {
    });

    return Floor;

});
