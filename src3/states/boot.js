define([
    '../player',
    '../pedro',
    '../lightPasses'
    ], function(Player, Pedro, lightPassConstructor) {

    var data;
    var lightRadius = 5; //TODO: remove temp hardcoded value

    function generateMap(data) {
        function generateBoxes(data, freeCells) {
            for(var i = 0; i < 10; i++) {
                var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                var key = freeCells.splice(index, 1)[0];
                var split = key.split(',');
                var x = Number.parseInt(split[0]);
                var y = Number.parseInt(split[1]);
                data.map[key].chest = game.add.sprite(x * 16, y * 16 - 4, 'tiles', 414);
                data.map[key].chest.alpha = 0;
                if(!i) { data.ananas = key; }
            }
        }

        function createBeing(data, Entity, freeCells) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);

            return new Entity(data, { x: x, y: y });
        }

        var digger = new ROT.Map.Digger(50 , 37);
        var freeCells = [];

        var digCallback = function(x, y, value) {
            if(value)
                return;

            var key = x + ',' + y;
            freeCells.push(key);
            data.map[key] = { walkable: true, seeThrough: true, tile: game.add.sprite(x * 16, y * 16, 'tiles', 6) };
            data.map[key].tile.alpha = 0;
        };
        digger.create(digCallback.bind(data));

        for(var t in data.map) {
            var split = t.split(',');
            var x = Number.parseInt(split[0]);
            var y = Number.parseInt(split[1]);
            for(var tX = -1; tX < 2; tX++) {
                for(var tY = -1; tY < 2; tY++) {
                    var newX = x + tX;
                    var newY = y + tY;
                    if(!data.map[newX + ',' + newY]) {
                        var k = newX + ',' + newY;
                        data.map[k] = { tile: game.add.sprite(newX * 16, newY * 16, 'tiles', 7) };
                        data.map[k].tile.alpha = 0;
                    }
                }
            }
        }

        generateBoxes(data, freeCells);

        data.player = createBeing(data, Player, freeCells);

        data.entities.push(data.player);
        data.entities.push(createBeing(data, Pedro, freeCells));
    }

    function calculateLight(gameData, target) {
        if(!target || !target.position)
            return;

        var lit = [];

        function lightHandle(x, y, r, visibility) {
            lit.push(x + ',' + y);
        }

        gameData.shadowcaster.compute(target.position.x, target.position.y, lightRadius, lightHandle);

        return lit;
    }

    return {
        init: function() {
        },
        preload: function() {
            game.load.image('boy', 'assets/jumping-boy.png');
            game.load.image('mob', 'assets/monster-sprite.png');
            game.load.spritesheet('tiles', 'assets/rlpack/Spritesheet/roguelikeSheet_transparent.png', 16, 16, -1, 0, 1);
        },
        create: function() {

            data = {
                ananas: null,
                engine: null,
                lit: [],
                fovCache: {},
                map: {},
                entities: [],
                player: null,
                shadowcaster: null
            };

            generateMap(data);

            var scheduler = new ROT.Scheduler.Simple();
            for(var e in data.entities)
                if(data.entities[e] && data.entities[e].act instanceof Function)
                    scheduler.add(data.entities[e], true);

            data.shadowcaster = new ROT.FOV.RecursiveShadowcasting(lightPassConstructor(data.map));

            data.engine = new ROT.Engine(scheduler);
            data.engine.start();

        },
        update: function() {
            var playerVisible;
            var fov = [];
            for(var l = 0; l < data.lit.length; l++) {
                var lKey = data.lit[l];
                if(!data.map[lKey])
                    continue;
                data.map[lKey].tile.alpha = 0;
                if(data.map[lKey].chest)
                    data.map[lKey].chest.alpha = 0;
            }

            data.lit = [];

            for(var en in data.entities) {
                var lit = calculateLight(data, data.entities[en]);
                data.lit = data.lit.concat(lit);
            }

            data.shadowcaster.compute(data.player.position.x, data.player.position.y, 50, function(x, y, r, visibility) {
                fov.push(x + ',' + y);
            });

            playerVisible = _.intersection(data.lit, fov);

            for(var k = 0; k < playerVisible.length; k++) {
                var key = playerVisible[k];
                if(!data.map[key])
                    continue;
                data.map[key].tile.alpha = 1;
                if(data.map[key].chest)
                    data.map[key].chest.alpha = 1;
            }

            for(var e in data.entities) {
                var ent = data.entities[e];
                if(!ent || !ent.position)
                    return;
                var pos = ent.position.x + ',' + ent.position.y;
                if(_.indexOf(playerVisible, pos) > -1)
                    ent.sprite.alpha = 1;
                else
                    ent.sprite.alpha = 0;
            }

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
