export default function OpendashTab() {
  return {
    restrict: "E",
    transclude: true,
    require: "^od-tabs",
    template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
    scope: {
      label: "@"
    },
    link: OpendashTabLinker
  };
}

function OpendashTabLinker(scope, elem, attr, $tabs) {
  scope.active = false;
  $tabs.addTab(scope);
}
