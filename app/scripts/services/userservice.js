'use strict';

/**
 * @ngdoc service
 * @name gmitcat.userService
 * @description
 * # userService
 * Service in the gmitcat.
 */
angular.module('gmitcat')
    .service('userService', function ($timeout, $rootScope) {
        var vm = this;
        // var opts = { live: true };

        var local = new PouchDB('users');
        var remote = new PouchDB('https://tstandedineatheriessever:5cda967062d17119c43e89cdc61860b44da8c7c8@ronanconnolly.cloudant.com/gmitcat-users');
        var db = local;

        // appDetails
        // vm.appDetails = {};
        // vm.appDetails.privateKey = '2e218f3f3198512516f2a127d483ad7937111a3fd04da710';
        // vm.appDetails.appId = '00dc3d1a';
        
        // users
        vm.users = [];
        vm.deviceTokens = [];
        
        // add user to list
        // vm.users.users.push(userRonan);
        
        // // messages
        // vm.messages = [];

        vm.init = init;
        vm.getDetails = getDetails;
        vm.saveUser = saveUser;
        // vm.saveMessageId = saveMessageId;

        vm.init();

        // vm.debugLog = debugLog;
        // function debugLog() {
        //     console.log('test');
        //     console.log('vm.users: ' + JSON.stringify(vm.users));
        // }

        // function saveMessagesToDb(){
            
        // }

        function init() {
            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.getDetails();
                // db.replicate.to(remote);
            });

            local.sync(remote, {
                live: true
            }).on('change', function (change) {
                // yo, something changed!
            }).on('error', function (err) {
                // yo, we got an error! (maybe the user went offline?)
            });
            
            // db.replicate.to(remoteCouch, opts, syncError);
            // db.replicate.from(remote, opts);
            vm.getDetails();
        }

        function getDetails() {
            // console.log("getting notify details");

            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                //console.log('DB Change');
                // console.log('doc: ' + JSON.stringify(doc.rows));

                vm.users = [];

                doc.rows.forEach(function (element) {
                    // console.log("element: " + JSON.stringify(element.id));
                    // if (element.id === 'appDetails') {
                    // console.log("element: " + JSON.stringify(element.id));
                    // vm.appDetails = element.doc;
                    // console.log("vm.appDetails: " + JSON.stringify(vm.appDetails));
                    // }
                    // else if (element.id === 'users') {
                    vm.users.push(element.doc);
                        
                    // console.log("vm.users: " + JSON.stringify(vm.users));

                    // } 
                    // else if (element.id === 'messages') {
                    //     vm.messages = element.doc;
                    //     // console.log("vm.messages: " + JSON.stringify(vm.messages.messages));
                    // }
                }, this);
                getDeviceTokens(vm.users);
            }).catch(function (err) {
                console.log('err: ' + err);
            });

            $timeout(function () { $rootScope.$apply(); });
        }

        // function saveMessageId(resp) {
        //     // console.log('vm.messages: ' + JSON.stringify(vm.messages.messages));
        //     vm.messages.messages.push(resp);
        //     db.put(vm.messages).catch(function (err) {
        //         console.log('err: ' + err);
        //     });
        //     // db.replicate.to(remote, opts);
        // }

        function saveUser(newUser) {
            // var userUnique = true;

            // vm.users.forEach(function (user) {
            //     console.log('newUser.deviceToken: ' + vm.users.users.deviceToken + '\nuser.deviceToken: ' + user.deviceToken);
            //     if (newUser.deviceToken == user.deviceToken) {
            //         // console.log('user already added...');
            //         userUnique = false;
            //     }
            // }, this);

            // if (userUnique) {
            // console.log('vm.users before: ' + JSON.stringify(vm.users.users));
            // vm.users.push(newUser);
            db.put(newUser).catch(function (err) {
                console.log('err: ' + err);
            }.catch(function (err) {
                console.log('err: ' + JSON.stringify(err));
            }))
            // console.log('vm.users after: ' + JSON.stringify(vm.users.users));

            getDeviceTokens(vm.users.users);
            // }
            // else {
            // console.log('user with device token '' + user.deviceToken + ' already exists, aborting save...');
            // }

        }

        function getDeviceTokens(users) {
            // console.log('users : ' + JSON.stringify(users));
            vm.deviceTokens = [];
            if (users != undefined && users.length > 0) {
                users.forEach(function (user) {
                    vm.deviceTokens.push(user.deviceToken);
                }, this);

                // console.log('vm.deviceTokens: ' + vm.deviceTokens);
            }
        }

        // vm.getMessages = getMessages;
        // function getMessages() {
        //     return vm.messages.messages
        // }

        // vm.updateMessages = updateMessages;
        // function updateMessages(updatedMessages) {
        //     // console.log('updatedMessages: ' + JSON.stringify(updatedMessages));
        //     // console.log('vm.messages.messages : ' + JSON.stringify(vm.messages.messages));
        //     vm.messages.messages = updatedMessages;
        //     db.put(vm.messages).catch(function (err) {
        //         console.log('err: ' + err);
        //     });
        // }

        return vm;
    });
