define([
    '../player',
    '../pedro',
    '../torch',
    '../chest',
    '../floor',
    '../wall',
    '../lightPasses'
    ], function(Player, Pedro, Torch, Chest, Floor, Wall, lightPassConstructor) {

    var data;

    function generateMap(data) {
        //TODO: Move to entity list
        function generateBoxes(data, freeCells) {
            for(var i = 0; i < 10; i++) {
                var chest = createBeing(data, Chest, freeCells);
                chest.sprite.alpha = 0;
                data.entities.push(chest);
                if(!i) { data.ananas = chest.position.x + ',' + chest.position.y; }
            }
        }

        function generateTorches(data, freeCells) {
            for(var i = 0; i < 10; i++)
                data.entities.push(createBeing(data, Torch, freeCells));
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
            data.map[key] = new Floor(game, { x: x, y: y });
            data.map[key].sprite.alpha = 0;
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
                        data.map[k] = new Wall(game, { x: newX, y: newY });
                        data.map[k].sprite.alpha = 0;
                    }
                }
            }
        }

        generateTorches(data, freeCells);
        generateBoxes(data, freeCells);

        data.player = createBeing(data, Player, freeCells);
        data.player.lightRange = 3;

        data.entities.push(data.player);
        data.entities.push(createBeing(data, Pedro, freeCells));
    }

    function calculateEntityLight(gameData, target) {
        var light = {
            tiles: [],
            amount: {}
        };

        if(!target || !target.position)
            return light;

        function lightHandle(x, y, r, visibility) {
            var key = x + ',' + y;
            light.tiles.push(key);
            light.amount[key] = 1 - r / target.lightRange;
        }

        gameData.shadowcaster.compute(target.position.x, target.position.y, target.lightRange, lightHandle);

        return light;
    }

    function updateLight(data) {
        for(var l = 0; l < data.lit.length; l++) {
            var lKey = data.lit[l];
            if(!data.map[lKey])
                continue;
            data.map[lKey].sprite.alpha = 0;
            if(data.map[lKey].chest)
                data.map[lKey].chest.alpha = 0;
        }

        data.lit = [];
        data.lightStrength = {};

        for(var en in data.entities) {
            if(data.entities[en].lightRange === 0)
                continue;
            var lit = calculateEntityLight(data, data.entities[en]);
            data.lit = data.lit.concat(lit.tiles);
            for(var ls in lit.amount) {
                if(!data.lightStrength[ls])
                    data.lightStrength[ls] = 0;
                data.lightStrength[ls] += lit.amount[ls];
                if(data.lightStrength[ls] > 1)
                    data.lightStrength[ls] = 1;
            }
        }
    }

    function getVisible(data, target) {
        var fov = [];
        var visible;

        data.shadowcaster.compute(target.position.x, target.position.y, 50, function(x, y, r, visibility) {
            fov.push(x + ',' + y);
        });

        return _.intersection(data.lit, fov);
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
                lightStrength: {},
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
            updateLight(data);

            var visible = getVisible(data, data.player);

            for(var k = 0; k < visible.length; k++) {
                var key = visible[k];
                if(!data.map[key])
                    continue;
                data.map[key].sprite.alpha = data.lightStrength[key];
                if(data.map[key].chest)
                    data.map[key].chest.alpha = data.lightStrength[key];
            }

            for(var e in data.entities) {
                var ent = data.entities[e];
                if(!ent || !ent.position)
                    return;
                var pos = ent.position.x + ',' + ent.position.y;
                if(_.indexOf(visible, pos) > -1)
                    ent.sprite.alpha = data.lightStrength[pos];
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
