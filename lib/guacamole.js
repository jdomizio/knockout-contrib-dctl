define(function(require) {

    var ko = require('knockout'),
        ctLoader = require('src/capturingComponentLoader');

    ctLoader.registerTemplate('guacamole', 'default', '<div data-bind="text: text"></div>');
    ctLoader.registerTemplate('guacamole', 'description', '<div data-bind="text: description"></div>');

    ko.components.register('guacamole', {
        viewModel: function(params) {
            this.text = ko.observable('text'),
            this.description = ko.observable('some other text')
        },
        template: {
            createTemplate: function(params) {
                return params.templateToUse;
            }
        }
    });

});