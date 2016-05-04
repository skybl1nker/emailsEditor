angular.module('demo', ['emailsEditor'])

.controller('demoController', ['$scope', function($scope) {
   $scope.emails = ['sidorov@mail.ru'];

   $scope.addRandomEmail = function () {
      $scope.emails.push(generateEmail());
   };

   $scope.getEmailsCount = function () {
      alert($scope.emails.length);
   };

   function generateEmail() {
      var length = Math.random() * 10 + 2,
         symbols = 'abcdefghijklmnopqrstuvwxyz',
         domains = ['gmail.com', 'hotmail.com', 'mail.ru', 'yandex.ru'],
         ret = '';

         for( var i = 0; i < length; i++ )
            ret += symbols.charAt(Math.random() * symbols.length | 0);

         ret += '@' + domains[Math.random() * domains.length | 0];
         return ret;
   };
}]);