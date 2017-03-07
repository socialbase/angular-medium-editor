/*global MediumEditor */
'use strict';

angular.module('angular-medium-editor', [])

  .directive('mediumEditor', function() {

    function toInnerText(value) {
      var tempEl = document.createElement('div'),
          text;
      tempEl.innerHTML = value;
      text = tempEl.textContent || '';
      return text.trim();
    }

    return {
      require: 'ngModel',
      restrict: 'AE',
      scope: { bindOptions: '=' },
      link: function(scope, iElement, iAttrs, ngModel) {

        angular.element(iElement).addClass('angular-medium-editor');

        // Global MediumEditor
        ngModel.editor = new MediumEditor(iElement, scope.bindOptions);

        ngModel.$render = function() {
          ngModel.editor.setContent(ngModel.$viewValue || "");
          var placeholder = ngModel.editor.getExtensionByName('placeholder');
          if (placeholder) {
            placeholder.updatePlaceholder(iElement[0]);
          }
        };

        ngModel.$isEmpty = function(value) {
          if (/[<>]/.test(value)) {
            return toInnerText(value).length === 0;
          } else if (value) {
            return value.length === 0;
          } else {
            return true;
          }
        };
        
	subscribeToChanges();

        scope.$watch('bindOptions', function(bindOptions) {
          ngModel.editor.destroy();
          ngModel.editor = new MediumEditor(iElement, bindOptions);
          
          subscribeToChanges();
        });

        scope.$on('$destroy', function() {
          ngModel.editor.destroy();
        });

        function subscribeToChanges() {
          ngModel.editor.subscribe('editableInput', function (event, editable) {
            ngModel.$setViewValue(editable.innerHTML.trim());
          });
        }
      }
    };

  });
