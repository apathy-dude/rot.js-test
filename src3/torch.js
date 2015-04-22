define(['entity'], function(Entity) {

    function Torch(gameData, pos) {
        Entity.call(this, gameData, pos, game.add.sprite(pos.x * 16, pos.y * 16, 'tiles', 417));
        this.lightRange = 5;
    }

    Torch.prototype = Object.create(Entity.prototype, {
        act: { value: function() {} }
    });

    return Torch;
});
