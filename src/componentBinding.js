define(function(require) {

    var ko = require('knockout');

    var oldComponentBinding = ko.bindingHandlers['component'];

    function register(loader) {
        ko.bindingHandlers['component'] = {
            'init': function(element, valueAccessor, allBindings, deprecated, bindingContext) {
                var value, params, name;

                value = ko.unwrap(valueAccessor());
                if(typeof value === 'string') {
                    name = value;
                }
                else {
                    name = ko.unwrap(value['name']);
                    params = ko.unwrap(value['params']);
                }

                loader.currentName = name;
                loader.currentParams = params;

                if(loader.readInterception()) {
                    ko.components.clearCachedDefinition(name);
                }

                oldComponentBinding.init(element, valueAccessor, allBindings, deprecated, bindingContext);
            }
        };
    }

    return {
        register: register
    };
});