'use strict';

/**
 * @ngdoc function
 * @name gmitcat.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the gmitcat
 */
angular.module('gmitcat')
    .controller('HomeCtrl', function (auth) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            auth.logout();
        }
    });
