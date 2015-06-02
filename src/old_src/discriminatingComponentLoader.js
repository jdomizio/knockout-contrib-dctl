define(function(require) {
    var ko = require('knockout'),
        binding = require('./discriminatingComponentBinding'),
        registrar = require('./discriminatingRegistrar');

    var loader = {}, defaultLoader;

    defaultLoader = ko.components.defaultLoader;

    loader.getConfig = defaultLoader.getConfig;
    loader.loadComponent = defaultLoader.loadComponent;
    loader.loadTemplate = defaultLoader.loadTemplate;
    loader.loadViewModel = defaultLoader.loadViewModel;
    loader.getSubComponent = function(componentName, params) {
        return this.discriminators[componentName](params);
    };
    loader.registerDiscriminator = function(componentName, discriminator) {
        this.discriminators = this.discriminators || {};

        this.discriminators[componentName] = discriminator;
    };

    binding.register(loader);
    registrar.register(loader);
    ko.components['loaders'].splice(0, 0, loader);

    return loader;
});