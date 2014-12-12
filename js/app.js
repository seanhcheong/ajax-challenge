"use strict";

angular.module('ToDoApp', ['ui.bootstrap'])
    .config(function($httpProvider) {

    	$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'rOeu4uapVPLeZZSs1pa7kR06141yD8BLhIc6fRbD';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'WFjkMy78gBqTw777XRy5HhohRqYFkdyAC14k3jDe';
    })

    .controller('CommentController', function($scope, $http) {
        var commentUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentUrl + '?where={"done": false}')
                .success(function(responseData) {
                    $scope.comments = responseData.results;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; 

        $scope.refreshComments();

        $scope.newComment = {done: false};

        $scope.addComment = function(comment) {
            $scope.inserting = true;
            $http.post(commentUrl, comment)
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.comments.push(comment);
                    $scope.newComment = {done: false};
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };
        $scope.updateComment = function(comment) {
            $scope.updating = true;
            $http.put(commentUrl + '/' + comment.objectId, comment)
                .success(function(responseData) {
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
        $scope.changeScore = function (comment, amount) {
            if(comment.score == 0 && amount == -1) {
                return null;
            } 
            $scope.updating = true;
            $http.put(commentUrl + '/' +comment.objectId, {
                score: {
                    __op: 'Increment', amount: amount
                }
            })
                .success(function(responseData) {
                    comment.score = responseData.score;
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                })
        };

        $scope.removeComment = function(comment) {
            $http.delete(commentUrl + '/' + comment.objectId)
                .success(function(responseData) {
                    $scope.refreshComments();
                })
                .error(function(err) {
                    console.log(err);
                });
        }

    });