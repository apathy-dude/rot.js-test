require(['config'], function() {
    'use strict';

    require([
        'rot',
        'lodash',
    ], function() {
        window.game = new Phaser.Game(800, 600, Phaser.AUTO);

        require([
            'states'
        ], function() {
            game.state.start('boot');
        });
    });
});
