define([
    '../player',
    '../pedro',
    '../lightPasses'
    ], function(Player, Pedro, lightPassConstructor) {

    return {
        create: function() {

            function generateMap(game) {
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

                game.player = createBeing(game, Player, freeCells);
                game.pedro = createBeing(game, Pedro, freeCells);
            }

            var Game = {
                ananas: null,
                display: null,
                draw: function draw() {
                    var lightRadius = 5;

                    function calculateLight(game, target) {
                        function lightHandle(x, y, r, visibility) {
                            game.lit.push(x + ',' + y);
                        }

                        game.shadowcaster.compute(target.position.x, target.position.y, lightRadius, lightHandle);
                    }

                    this.lit = [];

                    calculateLight(this, this.player);
                    calculateLight(this, this.pedro);

                    var fov = [];
                    this.shadowcaster.compute(this.player.position.x, this.player.position.y, 50, function(x, y, r, visibility) {
                        fov.push(x + ',' + y);
                    });

                    var playerVisible = _.intersection(this.lit, fov);

                    this.display.clear();

                    for(var k = 0; k < playerVisible.length; k++) {
                        var key = playerVisible[k];
                        var parts = key.split(',');
                        var x = parseInt(parts[0]);
                        var y = parseInt(parts[1]);
                        this.display.draw(x, y, this.map[key]);
                    }

                    this.player.draw();

                    var pedroKey = this.pedro.position.x + ',' + this.pedro.position.y;

                    if(_.indexOf(playerVisible, pedroKey) > -1)
                        this.pedro.draw();
                },
                engine: null,
                init: function init() {
                    this.display = new ROT.Display();
                    //document.body.appendChild(this.display.getContainer());

                    generateMap(this);

                    var scheduler = new ROT.Scheduler.Simple();
                    scheduler.add(this.player, true);
                    scheduler.add(this.pedro, true);

                    this.shadowcaster = new ROT.FOV.RecursiveShadowcasting(lightPassConstructor(this.map));

                    this.engine = new ROT.Engine(scheduler);
                    this.engine.start();
                },
                lit: [],
                map: {},
                pedro: null,
                player: null,
                shadowcaster: null
            };

            Game.init();

            window.game.data = Game;

        },
        update: function() {
        }
    };

});
