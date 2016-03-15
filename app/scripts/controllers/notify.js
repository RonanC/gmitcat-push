'use strict';

/**
 * @ngdoc function
 * @name gmitcat.controller:NotifyCtrl
 * @description
 * # NotifyCtrl
 * Controller of the gmitcat
 */
angular.module('gmitcat')
    .controller('NotifyCtrl', function ($http, userService, $timeout, $interval, messageService, $filter, $rootScope, detailsService) {
        // http://docs.ionic.io/docs/push-api-examples
        var vm = this;

        vm.notifySuccess = false;
        vm.notifyError = false;
        vm.notifyWarning = false;

        vm.sendPush = sendPush;

        vm.messages = messageService.messages;
        vm.refreshMessages = refreshMessages;


        $timeout(function () {
            vm.refreshMessages();
            vm.userCount = userService.deviceTokens.length;
            // console.log(userService.deviceTokens);
        }, 250);

        $timeout(function () {
            vm.refreshMessages();
            vm.userCount = userService.deviceTokens.length;
            // console.log(userService.deviceTokens);
        }, 500);

        $timeout(function () {
            vm.refreshMessages();
            vm.userCount = userService.deviceTokens.length;
            // console.log(userService.deviceTokens);
        }, 1000);

        $timeout(function () {
            refreshMsgStatus();
        }, 1000);
        
        // this gets called every 5 seconds
        // this is not efficient, it is only needed the first time you visit the page
        var refreshInterval;
        refreshInterval = $interval(function () {
            // console.log('interval...');
            refreshMsgStatus();
            vm.userCount = userService.deviceTokens.length;
            // console.log(userService.deviceTokens);
            
            vm.refreshMessages();
            $timeout(function () { $rootScope.$apply(); });
        }, 10000);



        function refreshMessages() {
            vm.messages = messageService.messages;
        }

        // add user simulation
        // // test user
        // var userRonan = {};
        // userRonan.deviceToken = '0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961';
        // userRonan.deviceType = 'ios';
        // userRonan.timeStamp = new Date().toISOString().slice(0, 16);
        // $timeout(function () {
        //     console.log('adding user...');
        //     userService.saveUser(userRonan);
        // }, 5000);

        function refreshMsgStatus() {

            if (vm.messages != undefined && vm.messages.length > 0) {
                

            
                // var def = $q.defer();
                var index = 0;
                // var length = vm.messages.length;

                vm.messages.forEach(function (message) {

                    if (message.result == 'queued') {
                        // console.log('message: ' + JSON.stringify(message));
                        checkStatus(message, index);
                    }

                    // if (index >= length - 1) {
                    //     console.log('count: ' + index + '\nlength-1: ' + (length - 1));
                    //     def.resolve();
                    // }

                    index++;
                }, this);

                // def.promise.then(function () {
                //     // console.log('ready');
                //     userService.updateMessages(vm.messages);
                // });

                $timeout(function () {
                    // messageService.updateMessages(vm.messages);
                    vm.messages = messageService.getMessages();
                }, 5000);
            }
        }


        // vm.debugLog = userService.debugLog;

        function sendPush(message) {
            vm.notifyWarning = true;

            // console.log('message text: ' + JSON.stringify(message));
            
            // Define relevant info
            var privateKey = detailsService.appDetails.privateKey;
            var tokens = userService.deviceTokens;
            var appId = detailsService.appDetails.appId;

            // Encode your key
            var auth = btoa(privateKey + ':');

            // Build the request object
            var req = {
                method: 'POST',
                url: 'https://push.ionic.io/api/v1/push',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ionic-Application-Id': appId,
                    'Authorization': 'basic ' + auth
                },
                data: {
                    'tokens': tokens,
                    'notification': {
                        'alert': message.message
                    }
                }
            };

            // console.log('req: ' + JSON.stringify(req));

            // Make the API call
            $http(req).success(function (resp) {
                // Handle success
                //console.log('Ionic Push: Push success!');

                // console.log('resp: ' + JSON.stringify(resp));
                // console.log('req: ' + JSON.stringify(req));

                resp.message = req.data.notification.alert;
                resp.tokens = req.data.tokens;

                // var date = new Date();
                // var dateFormatted = $filter('date')(date, 'EEE MMM dd yyyy hh:MM'); // for conversion to string
                // console.log('dateFormatted: ' + dateFormatted);
                
                // var dateFormatted = dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
                
                resp.timeStamp = Date.now(); //getTimestamp(); //Date.now();
                //$filter('date')(new Date(), 'EEE MMM dd yyyy hh:MM'); //dateFormatted; //new Date().toISOString().slice(0, 16);
                
                resp._id = Date.now().toString(); //dateToNum(new Date());
                // console.log('resp._id: ' + JSON.stringify(resp._id));
                // resp._rev = '3-d00e377018a5fd6888a0664311b1ab0a'; // need to have a _rev (cloudant bug)
                           
                // save to db
                messageService.saveMessage(resp);

                vm.messages = messageService.getMessages();
                //console.log('resp: ' + JSON.stringify(resp));

                vm.notifyWarning = false;
                vm.notifySuccess = true;

                vm.messages = messageService.messages;
                $timeout(function () {
                    vm.notifySuccess = false;
                    vm.messages = messageService.messages;
                }, 3000);
            }).error(function (error) {
                // Handle error 
                console.log('error: ' + JSON.stringify(error));
                console.log('Ionic Push: Push error...');

                vm.notifyWarning = false;
                vm.notifyError = true;
                $timeout(function () {
                    vm.notifyError = false;
                }, 3000);
            });
        }

        function getTimestamp() {
            var date = new Date();
            console.log('date: ' + date);
            var timeStamp = $filter('date')(date, 'EEE MMM dd yyyy hh:MM');
            console.log('timeStamp: ' + timeStamp);

            return timeStamp;
        }

        // private
        // function dateToNum(date) {
        //     // var dateToConvert = date + ':00 GMT+0000 (GMT)';
        //     var newDate = new Date(date);
        //     var dateNum = Number(newDate);
        //     var dateStr = dateNum.toString();

        //     // console.log('time stamp: ' + isostr);
        //     // console.log('human readable: ' + parsedDate);

        //     return dateStr;
        // }
        
        // private
        function numToDate(date) {
            var asDate = new Date(parseInt(date));
            var parsedDate = asDate.toString().slice(0, 21);

            // console.log('time stamp: ' + timestr);
            // console.log('human readable: ' + parsedDate);

            return parsedDate;
        }

        function checkStatus(message, index) {
            var privateKey = detailsService.appDetails.privateKey;
            var appId = detailsService.appDetails.appId;
            var statusId = message.message_id;

            // Encode your key
            var auth = btoa(privateKey + ':');

            // Build the request object
            var req = {
                method: 'GET',
                url: 'https://push.ionic.io/api/v1/status/' + statusId,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ionic-Application-Id': appId,
                    'Authorization': 'basic ' + auth
                }
            };

            // Make the API call
            $http(req).success(function (resp) {
                // Handle success
                // console.log('Ionic Push: Push success!');
                // console.log('req: ' + JSON.stringify(req));
                // console.log('resp: ' + JSON.stringify(resp.status));
                // newStatus = resp.status;÷
                // return resp.status;
                vm.messages[index].result = resp.status;
                messageService.saveMessage(vm.messages[index]);

                vm.messages = messageService.getMessages();
                
                // console.log(vm.messages[index]);
            }).error(function (error) {
                // Handle error 
                console.log('Ionic Push: Push error...');
                console.log('error: ' + JSON.stringify(error));
                // return 'Unknown';
            });

        }

    });
