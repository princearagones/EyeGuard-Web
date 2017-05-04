(function() {
    angular
        .module('app', [
            'ui.router',
            'ngMaterial'
        ]);
    
    require('./app.router');

    var assets = require.context('./assets', true, /.*\.(png|jpg|gif)$/);
    var services = require.context('./services', true, /.*\.service\.js$/);
    var components = require.context('./components', true, /.*\.component\.js$/);

    assets.keys().forEach(assets);
    services.keys().forEach(services);
    components.keys().forEach(components);

})();
