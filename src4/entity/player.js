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
        this.cursors = game.input.keyboard.createCursorKeys();
        this.speed = 150;
    }

    Player.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {
                var diff = [0, 0];

                if(this.cursors.left.isDown)
                    diff[0]--;
                if(this.cursors.right.isDown)
                    diff[0]++;

                if(this.cursors.up.isDown)
                    diff[1]--;
                if(this.cursors.down.isDown)
                    diff[1]++;

                this.move(diff);
            }
        }
    });

    return Player;
});
