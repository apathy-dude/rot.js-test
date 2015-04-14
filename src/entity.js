define(function() {

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
    
    function Entity(game, pos, sprite) {
        var self = this;
        if(!pos)
            pos = {};

        if(typeof pos.x !== 'number')
            pos.x = 0;

        if(typeof pos.y !== 'number')
            pos.y = 0;

        if(!sprite || !sprite.symbol)
            throw "Entity sprite requires symbol";

        if(!sprite.color)
            sprite.color = "#ff0";

        function draw() {
            game.display.draw(self.position.x, self.position.y, self.sprite.symbol, self.sprite.color);
        }

        var position = pos;
        var s = sprite;

        this.__defineGetter__("position", function() {
            return position;
        });

        this.__defineGetter__("sprite", function() {
            return s;
        });

        this.move = function(x, y) {
            pos.x += x;
            pos.y += y;
        }

        this.act = function() {
            game.engine.lock();
            window.addEventListener('keydown', this);
        };

        this.handleEvent = function(e) {
            var code = e.keyCode;
            if(!(code in keyMap)) return;

            var diff = ROT.DIRS[8][keyMap[code]];
            var newX = this.position.x + diff[0];
            var newY = this.position.y + diff[1];

            var newKey = newX + ',' + newY;
            if(!(newKey in game.map)) return;

            game.display.draw(this.position.x, this.position.y, game.map[this.position.x + ',' + this.position.y]);
            pos.x = newX;
            pos.y = newY;

            draw();

            window.removeEventListener('keydown', this);
            game.engine.unlock();
        }
    }

    return Entity;
});
