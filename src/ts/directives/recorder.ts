﻿import { appPrefix } from '../globals';
import { ng } from '../ng-start';
import { recorder } from '../recorder';

export let recorderComponent = ng.directive('recorder', function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            format: '@',
            onUpload: '&'
        },
        templateUrl: '/' + appPrefix + '/public/template/entcore/recorder.html',
        link: function (scope, element, attributes) {
            scope.recorder = recorder;
            if (attributes.protected !== undefined) {
                recorder.protected = true;
            }
            recorder.state(function () {
                scope.$apply('recorder');
            });
            scope.switchRecord = function () {
                if (recorder.status === 'recording') {
                    recorder.pause();
                }
                else {
                    recorder.record();
                }
            };
            scope.time = function () {
                var minutes = parseInt(recorder.elapsedTime / 60);
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                var seconds = parseInt(recorder.elapsedTime % 60);
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                return minutes + ':' + seconds;
            };
            scope.switchPlay = function () {
                if (recorder.status === 'playing') {
                    recorder.pause();
                }
                else {
                    recorder.play();
                }
            };
            scope.saveRecord = function () {
                recorder.save(function (doc) {
                    scope.ngModel = doc;
                    scope.onUpload();
                    scope.$apply();
                });
            };
        }
    }
});