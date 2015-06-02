/**
 * Knockout Component Template Loader (knockout-ctl)
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('knockout-ctl', ['knockout'], factory);
    } else {
        if(typeof root.ko === 'undefined') {
            throw new Error('knockoutjs is required for knockout-ctl.');
        }
        root.koComponentTemplateLoader = factory(root.ko);
    }
}(this, function (ko) {
    'use strict';

    /** Get Existing Knockout stuff */
    var componentBinding = ko.bindingHandlers['component'],
        register = ko.components.register,
        defaultLoader = ko.components.defaultLoader,
        loader = {};

    /**
     * Utility function to create a valueAccessor
     * @param obj
     * @returns {Function}
     */
    function createValueAccessor(obj) {
        return function () {
            return obj;
        };
    }

    /**
     * Overrides knockout's component binding, creating the opportunity for our loader to intercept first
     * @param loader - an instantiated knockout-ctl loader
     */
    function registerComponentBinding(loader) {
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
                if (subComponent) {
                    name = name + '!' + subComponent;
                }
                return componentBinding.init(element, createValueAccessor({
                    name: name,
                    params: params
                }), allBindings, deprecated, bindingContext);
            }
        };
    }

    /**
     * Overrides knockout's components.register method to intercept and register subComponents
     * @param loader
     */
    function overrideRegisterMethod(loader) {
        ko.components.register = function (componentName, config) {
            if (config.subComponents) {

                // Register a dummy component so KO won't barf
                register(componentName, {viewModel: {}, template: ''});

                // Register subComponent discriminator for this component
                loader.registerDiscriminator(componentName, config.getSubComponent);

                // Register each sub-component
                ko.utils.objectForEach(config.subComponents, function (prop, value) {

                    // We can optionally provide one viewModel definition, or provide one for
                    // each subcomponent
                    if (typeof value.viewModel === 'undefined' && config.viewModel) {
                        value.viewModel = config.viewModel;
                    }
                    register(componentName + '!' + prop, value);
                });
                return;
            }

            // if it wasn't a sub-componenty component, let KO handle it
            register(componentName, config);
        };
    }

    // Set our loader to be use knockout's defaults */
    loader.getConfig = defaultLoader.getConfig;
    loader.loadComponent = defaultLoader.loadComponent;
    loader.loadTemplate = defaultLoader.loadTemplate;
    loader.loadViewModel = defaultLoader.loadViewModel;

    /**
     * Gets a subComponent configuration
     * @param componentName - The parent component name
     * @param params - The parameters being passed to the component
     * @returns {*} - A valid component configuration: { viewModel, template }
     */
    loader.getSubComponent = function (componentName, params) {
        var discriminator = this.discriminators[componentName];
        return discriminator && discriminator(params);
    };

    /**
     * Registers a handler that will find the correct subComponent - handler
     * is used by getSubComponent later
     * @param componentName - The parent component name
     * @param discriminator - The subComponent finding function
     */
    loader.registerDiscriminator = function (componentName, discriminator) {
        this.discriminators = this.discriminators || {};
        this.discriminators[componentName] = discriminator;
    };

    registerComponentBinding(loader);
    overrideRegisterMethod(loader);

    // Insert our loader to be the first checked
    ko.components['loaders'].splice(0, 0, loader);

    return loader;
}));