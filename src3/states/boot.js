define([
    '../player',
    '../pedro',
    '../lightPasses'
    ], function(Player, Pedro, lightPassConstructor) {

    return {
        init: function() {
        },
        preload: function() {
            game.load.image('boy', 'assets/jumping-boy.png');
            game.load.image('mob', 'assets/monster-sprite.png');
            game.load.spritesheet('tiles', 'assets/rlpack/Spritesheet/roguelikeSheet_transparent.png', 16, 16, -1, 0, 1);
        },
        create: function() {
            //var floorTexture = game.add.sprite(0, 0, 'tiles', 6);
            //var wallTexture = game.add.sprite(0, 0, 'tiles', 7);
            //var chestTexture = game.add.sprite(16, -4, 'tiles', 414);

            function generateMap(game) {
                function generateBoxes(game, freeCells) {
                    for(var i = 0; i < 10; i++) {
                        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                        var key = freeCells.splice(index, 1)[0];
                        var split = key.split(',');
                        var x = Number.parseInt(split[0]);
                        var y = Number.parseInt(split[1]);
                        game.data.map[key].chest = game.add.sprite(x * 16, y * 16 - 4, 'tiles', 414);
                        game.data.map[key].chest.alpha = 0;
                        if(!i) { game.data.ananas = key; }
                    }
                }

                function createBeing(game, Entity, freeCells) {
                    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                    var key = freeCells.splice(index, 1)[0];
                    var parts = key.split(",");
                    var x = parseInt(parts[0]);
                    var y = parseInt(parts[1]);

                    return new Entity(game.data, { x: x, y: y });
                }

                var digger = new ROT.Map.Digger(50 , 37);
                var freeCells = [];

                var digCallback = function(x, y, value) {
                    if(value)
                        return;

                    var key = x + ',' + y;
                    freeCells.push(key);
                    game.data.map[key] = { walkable: true, seeThrough: true, tile: game.add.sprite(x * 16, y * 16, 'tiles', 6) };
                    game.data.map[key].tile.alpha = 0;
                };
                digger.create(digCallback.bind(game));

                for(var t in game.data.map) {
                    var split = t.split(',');
                    var x = Number.parseInt(split[0]);
                    var y = Number.parseInt(split[1]);
                    for(var tX = -1; tX < 2; tX++) {
                        for(var tY = -1; tY < 2; tY++) {
                            var newX = x + tX;
                            var newY = y + tY;
                            if(!game.data.map[newX + ',' + newY]) {
                                var k = newX + ',' + newY;
                                game.data.map[k] = { tile: game.add.sprite(newX * 16, newY * 16, 'tiles', 7) };
                                game.data.map[k].tile.alpha = 0;
                            }
                        }
                    }
                }

                generateBoxes(game, freeCells);

                game.data.player = createBeing(game, Player, freeCells);
                game.data.pedro = createBeing(game, Pedro, freeCells);
            }

            game.data = {
                ananas: null,
                draw: function draw() {
                    var lightRadius = 5;

                    function calculateLight(game, target) {
                        function lightHandle(x, y, r, visibility) {
                            game.lit.push(x + ',' + y);
                        }

                        game.shadowcaster.compute(target.position.x, target.position.y, lightRadius, lightHandle);
                    }

                    for(var l = 0; l < this.lit.length; l++) {
                        var lKey = this.lit[l];
                        if(!this.map[lKey])
                            continue;
                        this.map[lKey].tile.alpha = 0;
                        if(this.map[lKey].chest)
                            this.map[lKey].chest.alpha = 0;
                    }

                    this.lit = [];

                    calculateLight(this, this.player);
                    calculateLight(this, this.pedro);

                    var fov = [];
                    this.shadowcaster.compute(this.player.position.x, this.player.position.y, 50, function(x, y, r, visibility) {
                        fov.push(x + ',' + y);
                    });

                    var playerVisible = _.intersection(this.lit, fov);

                    for(var k = 0; k < playerVisible.length; k++) {
                        var key = playerVisible[k];
                        if(!this.map[key])
                            continue;
                        this.map[key].tile.alpha = 1;
                        if(this.map[key].chest)
                            this.map[key].chest.alpha = 1;
                    }

                    this.player.draw();

                    var pedroKey = this.pedro.position.x + ',' + this.pedro.position.y;

                    if(_.indexOf(playerVisible, pedroKey) > -1)
                        this.pedro.draw();
                    else
                        this.pedro.sprite.alpha = 0;
                },
                engine: null,
                lit: [],
                map: {},
                pedro: null,
                player: null,
                shadowcaster: null
            };

            generateMap(game);

            var scheduler = new ROT.Scheduler.Simple();
            scheduler.add(game.data.player, true);
            scheduler.add(game.data.pedro, true);

            game.data.shadowcaster = new ROT.FOV.RecursiveShadowcasting(lightPassConstructor(game.data.map));

            game.data.engine = new ROT.Engine(scheduler);
            game.data.engine.start();

        },
        update: function() {
        },
        render: function() {
        },
        paused: function() {
        },
        pausedUpdate: function() {
        },
        resize: function() {
        },
        shutdown: function() {
        }
    };

});
