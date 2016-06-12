"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLOB = {};
GLOB.controllers = {};

GLOB.configs = {
    databaseDateTimeFormat: "YYYY-MM-DD HH:mm:ss", // moment
    databaseDateFormat: "YYYY-MM-DD", //moment
    displayDateMomentFormat: 'MM/DD/YYYY', // moment
    displayDateFormat: "dd/MM" // angular
};

GLOB.options = {
    actions: { "leastAppear": 'Số ít xuất hiện nhất' }
};

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, [{
        key: "init",
        value: function init() {}

        // upper case the first letter of a given string

    }, {
        key: "captitalize",
        value: function captitalize(string) {
            return string.replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        }
    }, {
        key: "formatPhone",
        value: function formatPhone(phoneNumber) {
            var raw = phoneNumber.replace(/[\(\)\-\s]/gi, '');
            if (raw.length < 3) return "";
            return "(" + raw.slice(0, 3) + ") " + raw.slice(3, 6) + "-" + raw.slice(6);
        }
    }, {
        key: "padLeft",
        value: function padLeft(value) {
            var length = arguments.length <= 1 || arguments[1] === undefined ? 7 : arguments[1];

            var str = "" + value;
            var pad = "0".repeat(length);
            return pad.substring(0, pad.length - str.length) + str;
        }
    }]);

    return Utils;
}();

var BaseController = function () {
    function BaseController() {
        _classCallCheck(this, BaseController);

        this.utils = new Utils();
        this.app = null;
        this.modalScope = null;
        this.currency = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD" });
        this.modalWrapper = $("#modalWrapper");
    }

    _createClass(BaseController, [{
        key: "init",
        value: function init() {
            this.initModule();
            this.initModalController();
            this.bindCommonEvent();
        }
    }, {
        key: "initModalController",
        value: function initModalController() {
            var $this = this;
            this.app.controller('modalController', function ($scope) {
                /* alert modal */
                $scope.alertInit = function () {
                    $scope.alertTitle = "Message";
                    $scope.alertMessage = "";
                    $scope.alertCloseFunction = null;
                    $scope.alertInRed = false;
                };
                $scope.alertClose = function () {
                    if ($scope.alertCloseFunction) $scope.alertCloseFunction();
                    $this.hideAlertMessage();
                };

                /* confirm modal */
                $scope.confirmInit = function () {
                    $scope.confirmTitle = "Confirm";
                    $scope.confirmYesTitle = "Yes";
                    $scope.confirmNoTitle = "No";
                    $scope.confirmMessage = "";
                    $scope.confirmCloseFunction = null;
                    $scope.confirmYesFunction = null;
                    $scope.confirmNoFunction = null;
                };
                $scope.confirmClose = function () {
                    if ($scope.confirmCloseFunction) $scope.confirmCloseFunction();
                    $this.hideConfirmMessage();
                };
                $scope.confirmYes = function () {
                    $scope.confirmYesFunction();
                    $this.hideConfirmMessage();
                };
                $scope.confirmNo = function () {
                    if ($scope.confirmNoFunction) $scope.confirmNoFunction();
                    $this.hideConfirmMessage();
                };
            });
        }
    }, {
        key: "initModule",
        value: function initModule() {
            this.app = angular.module('lottery', ['ngResource']).filter('range', function () {
                return function (input, min, max) {
                    var step = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

                    min = parseInt(min);
                    max = parseInt(max);

                    for (var i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                };
            }).filter("sanitize", ['$sce', function ($sce) {
                return function (htmlCode) {
                    return $sce.trustAsHtml(htmlCode);
                };
            }]).directive('onFinishRender', function ($timeout) {
                return function (scope, element, attrs) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$eval(attrs.onFinishRender);
                        }, 5);
                    }
                };
            }).config(['$httpProvider', function ($httpProvider) {
                $httpProvider.interceptors.push('customHttpInterceptor');
            }]).factory('customHttpInterceptor', function () {
                // intercept function for show / hide loading when sending http ajax
                return {
                    request: function request(config) {
                        $("#mainLoading").show();
                        return config;
                    },

                    requestError: function requestError(config) {
                        $("#mainLoading").hide();
                        console.log("request Error");
                        return config;
                    },

                    response: function response(res) {
                        console.log(res.data);
                        $("#mainLoading").hide();

                        return res;
                    },

                    responseError: function responseError(res) {
                        $("#mainLoading").hide();
                        console.log("response Error");
                        console.log(res);
                        return res;
                    }
                };
            });
        }

        /**
         * this function listen to common event on the master page
         */

    }, {
        key: "bindCommonEvent",
        value: function bindCommonEvent() {}

        /**
         * call this function when angular ready render component
         */

    }, {
        key: "angularReadyFunction",
        value: function angularReadyFunction() {
            this.modalScope = angular.element($("#modalWrapper")).scope();
        }

        /**
         * show alert message
         * @param options {message, title, onClose, inRed}
         */

    }, {
        key: "showAlertMessage",
        value: function showAlertMessage(options) {
            if (!options.message) {
                console.warn("message param is required when calling showAlertMessage");
                return;
            }

            var message = options.message;
            var title = options.title || "Message";
            var closeFunction = options.onClose || null;
            var inRed = options.inRed || false;
            this.modalScope.alertTitle = title;
            this.modalScope.alertMessage = message;
            this.modalScope.alertCloseFunction = closeFunction;
            this.modalScope.alertInRed = inRed;
            $("#alertModal").modal('show');
        }

        /**
         * hide alert message and reset params
         */

    }, {
        key: "hideAlertMessage",
        value: function hideAlertMessage() {
            // reset params
            this.modalScope.alertInit();
            $("#alertModal").modal('hide');
        }

        /**
         * show confirm message with Yes No button
         * @param options {message, title, yesTitle, noTitle, onClose, onNo, onYes}
         */

    }, {
        key: "showConfirmMessage",
        value: function showConfirmMessage(options) {
            if (!options.message || !options.onYes) {
                console.warn("message param and onYes callback function are required when calling showConfirmMessage");
                return;
            }

            var message = options.message;
            var title = options.title || "Message";
            var yesTitle = options.yesTitle || "Yes";
            var noTitle = options.noTitle || "No";
            var closeFunction = options.onClose || null;
            var noFunction = options.onNo || null;
            var yesFunction = options.onYes || null;
            this.modalScope.confirmTitle = title;
            this.modalScope.confirmYesTitle = yesTitle;
            this.modalScope.confirmNoTitle = noTitle;
            this.modalScope.confirmMessage = message;
            this.modalScope.confirmCloseFunction = closeFunction;
            this.modalScope.confirmYesFunction = yesFunction;
            this.modalScope.confirmNoFunction = noFunction;
            $("#confirmModal").modal('show');
        }

        /**
         * hide confirm message and reset params
         */

    }, {
        key: "hideConfirmMessage",
        value: function hideConfirmMessage() {
            // reset params
            this.modalScope.confirmInit();
            $("#confirmModal").modal('hide');
        }
    }]);

    return BaseController;
}();

var ListController = function (_BaseController) {
    _inherits(ListController, _BaseController);

    function ListController() {
        _classCallCheck(this, ListController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ListController).call(this));
    }

    _createClass(ListController, [{
        key: "init",
        value: function init() {
            _get(Object.getPrototypeOf(ListController.prototype), "init", this).call(this);
        }
    }]);

    return ListController;
}(BaseController);
//# sourceMappingURL=common.js.map
