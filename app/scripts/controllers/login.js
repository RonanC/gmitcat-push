'use strict';

/**
 * @ngdoc function
 * @name gmitcat.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the gmitcat
 */
angular.module('gmitcat')
    .controller('LoginCtrl', function ($timeout, $rootScope, auth, detailsService, $location) {
        var vm = this;
        vm.loginAttempt = login;
        vm.loginError = false;
        vm.user = detailsService.user;
        //  $rootScope.isLoggedOut = true;
        $rootScope.isLoggedOut = !auth.isLoggedIn();
        // vm.errorMsg = "error message";


        if (auth.isLoggedIn()) {
            $location.path('/home');
        }

        function login(user) {
            vm.user = detailsService.user;
            if (vm.user.username == user.username && vm.user.password == user.password) {
                $rootScope.isLoggedOut = false;
                auth.setUser(true);
                console.log('Login Successful!');
                $location.path('/home');
            } else {
                console.log('Login Failed!');
                vm.loginError = true;

                $timeout(function () {
                    vm.loginError = false;
                }, 2000);
                
                // error(user);
            }

            // console.log("vm.user: " + JSON.stringify(vm.user));
            // console.log("user: " + JSON.stringify(user));
        } // login
        
        // function error(user) {
        //     vm.errorMsg = "vm.user: " + JSON.stringify(vm.user) + "\n\nuser: " + JSON.stringify(user);

        // }
    });
