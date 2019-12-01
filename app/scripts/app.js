(function () {
    'use strict';

    angular.module('IDH', [
        'ngRoute',
        'hmTouchEvents',
        'ui.bootstrap'
        //'digestHud'
    ])
    
//    .config(function (digestHudProvider) {
//        digestHudProvider.enable();
//
//        // Optional configuration settings:
//        digestHudProvider.setHudPosition('top right'); // setup hud position on the page: top right, bottom left, etc. corner
//        digestHudProvider.numTopWatches = 20;  // number of items to display in detailed table
//        digestHudProvider.numDigestStats = 25;  // number of most recent digests to use for min/med/max stats
//    });

})();