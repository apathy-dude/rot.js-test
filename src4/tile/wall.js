define(['./tile'], function(Tile) {

    function Wall(game, pos) {
        Tile.call(this, game, pos, game.add.sprite(pos.x, pos.y, 'tiles', 7));
    }

    Wall.prototype = Object.create(Tile.prototype, {
    });

    return Wall;

});
