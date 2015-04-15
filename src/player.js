define(['entity'], function(Entity) {

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

    function Player(game, pos) {
        Entity.call(this, game, pos, { symbol: '@', color: '#ff0' });
    }

    Player.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {
                this.game.engine.lock();
                window.addEventListener('keydown', this);
            }
        },
        handleEvent: {
            value: function(e) {
                var code = e.keyCode;
                if(code === 13 || code === 32) {
                    var key = this.position.x + ',' + this.position.y;
                    if(this.game.map[key] !== '*') {
                        alert('There is no box here!');
                    }
                    else if(key === this.game.ananas) {
                        alert('Hooray! You found an ananas and won this game.');
                        this.game.engine.lock();
                        window.removeEventListener('keydown', this);
                    }
                    else {
                        alert('This box is empty');
                    }
                }

                if(!(code in keyMap)) return;

                var diff = ROT.DIRS[8][keyMap[code]];
                var newX = this.position.x + diff[0];
                var newY = this.position.y + diff[1];

                var newKey = newX + ',' + newY;
                if(!(newKey in this.game.map)) return;

                this.game.display.draw(this.position.x, this.position.y, this.game.map[this.position.x + ',' + this.position.y]);
                this.position.x = newX;
                this.position.y = newY;

                this.draw();

                window.removeEventListener('keydown', this);
                this.game.engine.unlock();
            }
        }
    });

    return Player;
});
