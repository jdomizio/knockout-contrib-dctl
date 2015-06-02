define(function(require) {
    var ko = require('knockout');
    require('src/discriminatingComponentLoader');

    var viewModel = function(params) {
        this.text = 'Text';
        this.otherText = 'Other Text';
    };

    ko.components.register('chips', {
        viewModel: viewModel,
        getSubComponent: function(params) {
            return params.templateToUse;
        },
        subComponents: {
            'default': {
                template: '<div data-bind="text: text"></div>'
            },
            'other': {
                template: '<div data-bind="text: otherText"></div>'
            }
        }
    });
});