require(['config'], function() {
    'use strict';

    require([
        'player',
        'pedro',
        'rot',
        'lodash'
    ], function(Player, Pedro) {
        function generateMap(game) {

            function drawMap(game) {
                for(var key in game.map) {
                    var parts = key.split(',');
                    var x = parseInt(parts[0]);
                    var y = parseInt(parts[1]);
                    game.display.draw(x, y, game.map[key]);
                }
            }

            function generateBoxes(game, freeCells) {
                for(var i = 0; i < 10; i++) {
                    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                    var key = freeCells.splice(index, 1)[0];
                    game.map[key] = '*';
                    if(!i) { game.ananas = key; }
                }
            }

            function createBeing(game, Entity, freeCells) {
                var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                var key = freeCells.splice(index, 1)[0];
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);

                return new Entity(game, { x: x, y: y });
            }

            var digger = new ROT.Map.Digger();
            var freeCells = [];

            var digCallback = function(x, y, value) {
                if(value)
                    return;

                var key = x + ',' + y;
                freeCells.push(key);
                game.map[key] = '.';
            };
            digger.create(digCallback.bind(game));

            generateBoxes(game, freeCells);

            drawMap(game);

            game.player = createBeing(game, Player, freeCells);
            game.pedro = createBeing(game, Pedro, freeCells);

            game.player.draw();
            game.pedro.draw();
        }

        var Game = {
            ananas: null,
            display: null,
            engine: null,
            init: function() {
                this.display = new ROT.Display();
                document.body.appendChild(this.display.getContainer());

                generateMap(this);

                var scheduler = new ROT.Scheduler.Simple();
                scheduler.add(this.player, true);
                scheduler.add(this.pedro, true);

                this.engine = new ROT.Engine(scheduler);
                this.engine.start();
            },
            map: {},
            pedro: null,
            player: null
        };

        Game.init();
    });
});
