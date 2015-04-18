define(['entity'], function(Entity) {

    function Pedro(game, pos) {
        Entity.call(this, game, pos, window.game.add.sprite(pos.x * 16, pos.y * 16, 'mob'));
    }

    function pathfind(game, pedro) {
        var target = game.player.position;
        var path = [];

        function passableCallback(x, y) {
            var k = x + ',' + y;
            return (k in game.map && game.map[k].walkable);
        }

        function pathCallback(x, y) {
            path.push([x, y]);
        }

        var astar = new ROT.Path.AStar(target.x, target.y, passableCallback, { topology: 8 });
        astar.compute(pedro.position.x, pedro.position.y, pathCallback);

        return path;
    }

    Pedro.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {
                var path = pathfind(this.game, this);
                path.shift();
                if(path.length <= 1) {
                    this.game.engine.lock();
                    alert('Game over - you were captured by Pedro!');
                }
                else {
                    this.position.x = path[0][0];
                    this.position.y = path[0][1];
                    this.sprite.position.x = path[0][0] * 16;
                    this.sprite.position.y = path[0][1] * 16;
                }
            }
        }
    });

    return Pedro;

});
