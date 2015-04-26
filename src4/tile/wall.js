define(['./tile'], function(Tile) {

    function Wall(game, pos, map, layer) {
        Tile.call(this, game, pos, map.putTile(7, pos.x, pos.y, layer));
    }

    Wall.prototype = Object.create(Tile.prototype, {
    });

    return Wall;

});
