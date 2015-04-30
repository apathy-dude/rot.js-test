define(function() {
    return {
        gridTileToScreen: function(sprite, scale, offset) {
            offset = offset || { x: 0, y: 0 };
            offset.x = offset.x || 0;
            offset.y = offset.y || 0;
            scale = scale === true || scale === false ? scale : true;

            sprite.x = sprite.x * this.getTrueTileSize() + (offset.x * this.getTrueTileSize());
            sprite.y = sprite.y * this.getTrueTileSize() + (offset.y * this.getTrueTileSize());

            if(scale && this.tileScale !== 1) {
                sprite.scale.x = this.tileScale;
                sprite.scale.y = this.tileScale;
            }
            else if(this.tileScale !== 1) {
                sprite.x += this.getTrueTileSize() / 2 - sprite.width / 2;
                sprite.y += this.getTrueTileSize() / 2 - sprite.height / 2;
            }

            return sprite;
        },
        tileSize: 16,
        tileScale: 1,
        getTrueTileSize: function() {
            return this.tileSize * this.tileScale;
        }
    };
});
