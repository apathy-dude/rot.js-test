define(['./entity'], function(Entity) {

    var keyMap = {
        38: 0,
        33: 1,
        39: 2,
        34: 3,
        40: 4,
        35: 5,
        37: 6,
        36: 7,
    };

    function Player(gameData, pos) {
        Entity.call(this, gameData, pos, game.add.sprite(pos.x, pos.y, 'boy'));
    }

    Player.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {
                this.gameData.engine.lock();
                window.addEventListener('keydown', this);
            }
        },
        handleEvent: {
            value: function(e) {
                var code = e.keyCode;
                if(code === 13 || code === 32) {
                    var key = this.position.x + ',' + this.position.y;
                    for(var en in this.gameData.entities) {
                        var entity = this.gameData.entities[en];
                        if(entity.position && entity.position.y === this.position.y && entity.position.x === this.position.x)
                            entity.interact(this);
                    }
                }

                if(!(code in keyMap)) return;

                var diff = ROT.DIRS[8][keyMap[code]];
                var newX = this.position.x + diff[0];
                var newY = this.position.y + diff[1];

                var newKey = newX + ',' + newY;
                if(!(newKey in this.gameData.map) || !this.gameData.map[newKey].walkable) return;

                this.move(diff);

                window.removeEventListener('keydown', this);

                this.gameData.engine.unlock();
            }
        }
    });

    return Player;
});
