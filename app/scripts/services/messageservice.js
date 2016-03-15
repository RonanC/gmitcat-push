'use strict';

/**
 * @ngdoc service
 * @name gmitcat.messageService
 * @description
 * # messageService
 * Service in the gmitcat.
 */
angular.module('gmitcat')
    .service('messageService', function ($timeout, $rootScope, $filter) {
        var vm = this;
        // var opts = { live: true };

        var local = new PouchDB('messages');
        var remote = new PouchDB('https://tstandedineatheriessever:5cda967062d17119c43e89cdc61860b44da8c7c8@ronanconnolly.cloudant.com/gmitcat-messages');
        var db = local;

        vm.messages = [];

        vm.init = init;
        vm.getDetails = getDetails;
        vm.saveMessage = saveMessage;
        vm.getMessages = getMessages;
        // vm.updateMessages = updateMessages;

        vm.init();

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
                vm.messages = [];

                doc.rows.forEach(function (element) {
                    // console.log("element: " + JSON.stringify(element));
                    vm.messages.push(element.doc);
                }, this);
            }).then(function (res) {
                
            }).catch(function (err) {
                console.log('err: ' + err);
            });

            $timeout(function () { $rootScope.$apply(); });
        }

        function saveMessage(message) {
            // console.log('message: ' + JSON.stringify(message));

            db.put(message).then(function (resp) {
                // db.replicate.to(remote, opts);
            }).catch(function (err) {
                console.log('err: ' + err);
            });
            // db.replicate.to(remote, opts);
        }

        function getMessages() {
            $timeout(function () { $rootScope.$apply(); });
            return vm.messages;
        }

        return vm;

    });
