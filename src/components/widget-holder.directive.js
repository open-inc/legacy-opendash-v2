function WidgetHolder($compile, $rootScope) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            const widget = scope.$ctrl.widget;
            const widgetScope = $rootScope.$new();

            widgetScope.widget = widget;

            const template = `<div style="display:block;width:100%;height:100%;">
                          <od-widget-${widget.type}
                            ng-if="widget.config && widget.state"
                            widget="widget.operations"
                            config="widget.config"
                            state="widget.state"
                            loading="widget.state.loading"
                            style="display:block;width:100%;height:100%;"
                            class="od-widget--width--{{ widget.grid[0] || '2' }} od-widget--height--{{ widget.grid[1] || '2' }}">
                          </od-widget-${widget.type}>
                          <od-loading ng-show="widget.state.loading"></od-loading>
                        </div>`;

            const widgetElement = $compile(template)(widgetScope);

            element.append(widgetElement);
        },
    };
}

WidgetHolder.$inject = ['$compile', '$rootScope'];

export default WidgetHolder;
