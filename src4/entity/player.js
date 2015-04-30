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

    var speed = 150;

    function Player(gameData, pos) {
        Entity.call(this, gameData, pos, game.add.sprite(pos.x, pos.y, 'boy'));
        this.cursors = game.input.keyboard.createCursorKeys();
    }

    Player.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;

                if(this.cursors.left.isDown)
                    this.sprite.body.velocity.x -= speed;
                if(this.cursors.right.isDown)
                    this.sprite.body.velocity.x += speed;

                if(this.cursors.up.isDown)
                    this.sprite.body.velocity.y -= speed;
                if(this.cursors.down.isDown)
                    this.sprite.body.velocity.y += speed;
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
