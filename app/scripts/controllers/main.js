'use strict';

/**
 * @ngdoc function
 * @name gmitcat.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gmitcat
 */
angular.module('gmitcat')
    .controller('MainCtrl', function ($scope, auth, $location) {
        $scope.$watch(auth.isLoggedIn, function (value, oldValue) {

            if (!value && oldValue) {
                console.log('Disconnect');
                $location.path('/login');
            }

            if (value) {
                console.log('Connect');
                //Do something when the user is connected
            }

        }, true);
    });
    
   