define(['./tile'], function(Tile) {
    function Floor(game, pos, map, layer) {
        Tile.call(this, game, pos, map.putTile(6, pos.x, pos.y, layer));
        this.walkable = true;
        this.seeThrough = true;
    }

    Floor.prototype = Object.create(Tile.prototype, {
    });

    return Floor;

});
