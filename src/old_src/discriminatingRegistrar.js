define(function(require) {
    var ko = require('knockout');

    var register = ko.components.register;

    function reg(loader) {
        ko.components.register = function (componentName, config) {

            if (config.subComponents) {
                register(componentName, { viewModel: {}, template: ''});
                loader.registerDiscriminator(componentName, config.getSubComponent);
                ko.utils.objectForEach(config.subComponents, function (prop, value) {
                    if(typeof value.viewModel === 'undefined' && config.viewModel) {
                        value.viewModel = config.viewModel;
                    }
                    register(componentName + '!' + prop, value);
                });
                return;
            }

            register(componentName, config);
        };
    }

    return {
        register: reg
    };
});