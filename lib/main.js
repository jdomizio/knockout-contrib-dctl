require(['knockout', 'src/discriminatingComponentLoader', 'lib/chips'], function(ko) {

    ko.applyBindings({ title: ko.observable('title')});
});