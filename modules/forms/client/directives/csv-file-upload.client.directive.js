(function () {
  'use strict';

  angular
    .module('forms')
    .directive('csvFileUpload', function() {
      return {
        transclude: true,
        replace: true,
        scope:{
          content:'=',
          result: '=',
          headerList: '=',
          headersValid: '=',
          filename: '='
        },
        template: '<div class="input-group"><span class="input-group-btn"><span class="btn btn-primary btn-file">Browse&hellip; ' +
          '<input type="file" accept="text/comma-separated-values, text/csv, application/csv"></span></span>' +
          '<input type="text" class="form-control" value="{{filename}}" readonly></div>',
        link: function(scope, element, attrs) {
          scope.header = true;
          scope.separator = ',';

          var validateHeaders = function(content) {
            if (scope.header) {
              if (scope.headerList) {
                var lines = content.csv.split('\n');
                var headerLine = lines[0].trim();
                if (headerLine.charAt(headerLine.length-1) === ',') {
                  headerLine = headerLine.substring(0, headerLine.length-1).trim();
                }
                if (headerLine.valueOf() === scope.headerList.join().valueOf()) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          };

          var csvToJSON = function(content) {
            var lines=content.csv.split('\n');
            var result = [];
            var start = 0;
            var columnCount = lines[0].split(content.separator).length;

            var headers = [];
            if (content.header) {
              headers=lines[0].split(content.separator);
              start = 1;
            }

            for (var i=start; i<lines.length; i++) {
              var obj = {};
              var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
              if (currentline.length === columnCount) {
                var allBlank = true;
                if (content.header) {
                  for (var j=0; j<headers.length; j++) {
                    if (currentline[j] !== '') allBlank = false;
                    if (headers[j] !== '') obj[headers[j]] = currentline[j];
                  }
                } else {
                  for (var k=0; k<currentline.length; k++) {
                    if (currentline[k] !== '') allBlank = false;
                    obj[k] = currentline[k];
                  }
                }
                if (!allBlank) result.push(obj);
              }
            }
            return result;
          };

          element.on('keyup', function(e){
            if (scope.content !== null) {
              var content = {
                csv: scope.content,
                header: scope.header,
                separator: scope.separator
              };
              scope.headersValid = validateHeaders(content);
              scope.result = csvToJSON(content);
              scope.$apply();
            }
          });

          element.on('change', function(onChangeEvent) {
            if (onChangeEvent && onChangeEvent.target && onChangeEvent.target.files && onChangeEvent.target.files.length &&
              onChangeEvent.target.files[0] && onChangeEvent.target.files[0].name) {
              var reader = new FileReader();
              scope.filename = onChangeEvent.target.files[0].name;
              reader.onload = function(onLoadEvent) {
                scope.$apply(function() {
                  var content = {
                    csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
                    header: scope.header,
                    separator: scope.separator
                  };

                  scope.content = content.csv;
                  scope.headersValid = validateHeaders(content);
                  scope.result = csvToJSON(content);
                  scope.result.filename = scope.filename;
                });
              };

              if ((onChangeEvent.target.type === 'file') && (onChangeEvent.target.files !== null || onChangeEvent.srcElement.files !== null)) {
                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
              } else {
                if (scope.content !== null) {
                  var content = {
                    csv: scope.content,
                    header: !scope.header,
                    separator: scope.separator
                  };
                  scope.headersValid = validateHeaders(content);
                  scope.result = csvToJSON(content);
                }
              }
            } else if (onChangeEvent && onChangeEvent.target && !onChangeEvent.target.files) {
              scope.filename = null;
              angular.element('input[type="file"]').val(null);
            }
          });
        }
      };
    });
})();
