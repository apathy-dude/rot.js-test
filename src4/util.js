define(function() {
    var tileSize = 32;
    var tileScale = 2;

    return {
        gridTileToScreen: function(sprite, scale, offset) {
            offset = offset || { x: 0, y: 0 };
            offset.x = offset.x || 0;
            offset.y = offset.y || 0;
            scale = scale === true || scale === false ? scale : true;

            sprite.x = sprite.x * tileSize + (offset.x * tileSize);
            sprite.y = sprite.y * tileSize + (offset.y * tileSize);

            if(scale && tileScale !== 1) {
                sprite.scale.x = tileScale;
                sprite.scale.y = tileScale;
            }
            else if(tileScale !== 1) {
                sprite.x += tileSize / 2 - sprite.width / 2;
                sprite.y += tileSize / 2 - sprite.height / 2;
            }

            return sprite;
        },
        tileScale: 2,
        tileSize: 32
    };
});
