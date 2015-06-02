define(function(require) {

    var ko = require('knockout');

    var componentBinding = ko.bindingHandlers['component'];

    function createValueAccessor(obj) {
        return function() {
            return obj;
        };
    }

    function register(loader) {
        ko.bindingHandlers['component'] = {
            'init': function (element, valueAccessor, allBindings, deprecated, bindingContext) {
                var value, name, params, subComponent;

                value = ko.unwrap(valueAccessor());
                if (typeof value === 'string') {
                    name = value;
                } else {
                    name = ko.unwrap(value['name']);
                    params = ko.unwrap(value['params']);
                }

                subComponent = loader.getSubComponent(name, params);
                if(subComponent) {
                    name = name + '!' + subComponent;
                }
                componentBinding.init(element, createValueAccessor({
                    name: name,
                    params: params
                }), allBindings, deprecated, bindingContext);
            }
        }
    }

    return {
        register: register
    };
});