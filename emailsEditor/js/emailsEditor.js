angular.module('emailsEditor', [])

   .directive('emailsEditor', function() {
      return {
         restrict: 'E',
         scope: {
            emails: '=' // модель, массив редактируемых email-ов
         },
         templateUrl: 'emailsEditor.html',
         replace: true,
         transclude: false,
         compile: function (element, attrs) {
            if (!attrs.emails)
               attrs.emails = []; // дефолтное значение
         },
         controller: 'emailsEditorController'
      };
   })

   .controller('emailsEditorController', ['$scope', '$timeout', function($scope, $timeout) {
      $scope.newEmail = '';
      $scope.invalidEmails = [];
      var emails = $scope.emails;

      $scope.addEmail = function () {
         // вставляет новый email из инпута
         // (если есть запятая или многоточие, то сразу несколько email-ов)
         if (!$scope.newEmail)
            return;

         var newEmails = $scope.newEmail.split(/[,;]+/);
         angular.forEach(newEmails, function(email) {
            email = email.trim();
            if (email !== '' && emails.indexOf(email) === -1)
               emails.push(email);
         });

         $scope.newEmail = '';
      };

      $scope.removeEmail = function (email) {
         // удаляет блок email
         var index = emails.indexOf(email);
         if (index > -1)
            emails.splice(index, 1);
      };

      var isValidCache = {};
      $scope.isValid = function (email) {
         var cached = isValidCache[email];
         if (cached !== undefined)
            return cached;
         else
            return isValidCache[email] = isValid(email);
      };


      $scope.onKeypress = function (event) {
         // при вводе запятой или точки вставляем получившиеся email-ы
         var code = event.which == null ? event.keyCode : event.which;
         if (code === 44 // comma
            || code === 59) // semicolon
         {
            $timeout(function(){
               $scope.addEmail();
            }, 0);
         }
      };

      $scope.onKeydown = function (event) {
         // при нажатии backspace и каретке в нулевой позиции стираем предыдущий блок
         var caretPos = getCaretPosition(event.target);
         if (event.keyCode === 8 && caretPos === 0 && emails.length > 0) // backspace
            $scope.removeEmail(emails[emails.length - 1]);
      };

      $scope.onPaste = function () {
         // при вставке из буфера вставляем результат, если получился валидный email
         $timeout(function(){
            if (isValid($scope.newEmail))
               $scope.addEmail();
         }, 0);
      };

      function getCaretPosition (elem) {
         var caretPos = 0;
         if (document.selection) { // IE Support
            elem.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart ('character', -elem.value.length);
            caretPos = Sel.text.length;
         }
         else if (elem.selectionStart || elem.selectionStart == '0')
            caretPos = elem.selectionStart;

         return caretPos;
      }

      function isValid(email) {
         var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return re.test(email);
      }
   }]);

