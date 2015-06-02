define(function(require) {

    var ko = require('knockout'),
        componentBinding = require('./componentBinding');

    var defaultComponentLoader = ko.components.defaultLoader,
        loader;

    function getKey(componentName, templateName) { return componentName + '/' + templateName; }

    function CapturingComponentLoader() {
        this.currentName = undefined;
        this.currentParams = undefined;
        this.templates = {};
        this.intercepted = false;
    }

    CapturingComponentLoader.prototype.registerTemplate = function(componentName, templateName, template) {
        var key = getKey(componentName, templateName);
        this.templates[key] = template;
    };

    CapturingComponentLoader.prototype.markInterception = function() {
        this.intercepted = true;
    };

    CapturingComponentLoader.prototype.readInterception = function() {
        var result = this.intercepted;
        this.intercepted = false;
        return result;
    };

    CapturingComponentLoader.prototype.getConfig = defaultComponentLoader.getConfig;
    CapturingComponentLoader.prototype.loadComponent = function(componentName, config, callback) {
        if(componentName === this.currentName) {
            var templateOptions = config.template,
                tmp;

            if(templateOptions && typeof templateOptions.createTemplate === 'function') {
                tmp = templateOptions.createTemplate(this.currentParams);
                config = {
                    viewModel: config.viewModel,
                    template: this.templates[getKey(componentName, tmp)]
                };
                this.markInterception();
            }
        } else {
            if(typeof console.warn !== 'undefined') {
                console.warn('CapturingComponentLoader.loadTemplate: provided component name: ' + componentName + ' does not match current name: ' + this.currentName);
            }
        }
        return defaultComponentLoader.loadComponent(componentName, config, callback);
    };
    CapturingComponentLoader.prototype.loadTemplate = defaultComponentLoader.loadTemplate;
    CapturingComponentLoader.prototype.loadViewModel = defaultComponentLoader.loadViewModel;

    loader = new CapturingComponentLoader();
    componentBinding.register(loader);

    return loader;
});