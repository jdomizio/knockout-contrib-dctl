(function(ko) {

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

    ko.components.register('template-component', {
        viewModel: {
            createViewModel: function() {
                return {
                    model: ko.observable('template-component!')
                };
            }
        },
        template: '<div data-bind="template: { nodes: $componentTemplateNodes, data: $data }"></div>'
    });

    function init() {
        ko.applyBindings({ title: ko.observable('title')});
    }

    if(/complete|interactive|ready/i.test(document.readyState)) {
        init();
    }
    else {
        document.addEventListener('DOMContentLoaded', init);
    }

})(ko);