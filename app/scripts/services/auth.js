'use strict';

/**
 * @ngdoc service
 * @name gmitcat.auth
 * @description
 * # auth
 * Service in the gmitcat.
 */
angular.module('gmitcat')
    .service('auth', function($location) {
        var user = false;

        return {
            setUser: function(aUser) {
                user = aUser;
            },
            isLoggedIn: function() {
                return (user) ? user : false;
            },
            logout: function() {
                user = false;
                console.log('logging out');
                $location.path('/login');
            }
        };

    });
