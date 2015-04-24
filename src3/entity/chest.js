define(['./entity'], function(Entity) {

    function Chest(gameData, pos) {
        Entity.call(this, gameData, pos, game.add.sprite(pos.x * 16, pos.y * 16 - 4, 'tiles', 414));
    }

    Chest.prototype = Object.create(Entity.prototype, {
        act: {
            value: function() {}
        },
        interact: {
            value: function(source) {
                if(this.gameData.ananas === this.position.x + ',' + this.position.y) {
                    alert('Hooray! You found an ananas and won this game.');
                    this.gameData.engine.lock();
                    window.removeEventListener('keydown', source);
                }
                else {
                    alert('This box is empty');
                }
            }
        }
    });

    return Chest;

});
