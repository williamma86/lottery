"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeController = function (_ListController) {
    _inherits(HomeController, _ListController);

    function HomeController() {
        _classCallCheck(this, HomeController);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HomeController).call(this));

        _this.wrapper = $("#homeController");
        _this.homeScope = null;
        return _this;
    }

    _createClass(HomeController, [{
        key: "init",
        value: function init() {
            _get(Object.getPrototypeOf(HomeController.prototype), "init", this).call(this);
            this.app.controller("homeController", function ($scope, $http) {
                $scope.channelOptions = {};
                $scope.actionOptions = GLOB.options.actions;
                $scope.action = "leastAppear";
                $scope.withinTimes = 1;
                $scope.channelId = 0;
                $scope.configs = GLOB.configs;
                $scope.headers = [];
                $scope.contents = [];
                $scope.isTwoNumber = 0;
                $scope.searchRows = {};
                $scope.maxTimes = 1;
                $scope.selectedNumber = -1;

                console.log($scope.configs);
                // call ajax and get channel options
                $http({
                    method: "GET",
                    url: "home/getChannels"
                }).then(function (response) {
                    var data = response.data;
                    $scope.channelOptions = data;
                    if (data.length > 0) {
                        $scope.channelId = data[0].value;
                        $scope.changeChannel();
                    }
                }, function (response) {});

                // when user change the channel
                $scope.changeChannel = function () {
                    console.log("changeChannel");
                    $scope.searchRows = {};
                    $http({
                        method: "POST",
                        url: "home/getResults",
                        data: { channelId: $scope.channelId }
                    }).then(function (response) {
                        // format date time
                        var headers = response.data.headers;

                        for (var i = 0; i < headers.length; i++) {
                            headers[i] = moment(headers[i], $scope.configs.databaseDateTimeFormat).valueOf();
                        }

                        $scope.contents = response.data.contents;
                        $scope.headers = headers;

                        $scope.maxTimes = headers.length;
                        console.log($scope.headers);
                    }, function (response) {});
                };

                // when user click on Submit button
                $scope.doAction = function () {
                    $http({
                        method: "POST",
                        url: "home/doAction",
                        data: {
                            channelId: $scope.channelId,
                            action: $scope.action,
                            withinTimes: $scope.withinTimes
                        }
                    }).then(function (response) {
                        $scope.searchRows = response.data;
                    }, function (response) {});
                };

                // when uer click on result table
                $scope.highlightNumber = function (number) {
                    $scope.selectedNumber = number;
                };
            });
        }
    }, {
        key: "angularReadyFunction",
        value: function angularReadyFunction() {
            _get(Object.getPrototypeOf(HomeController.prototype), "angularReadyFunction", this).call(this);
            this.homeScope = angular.element(this.wrapper).scope();
        }
    }]);

    return HomeController;
}(ListController);

(function () {
    GLOB.controllers.home = new HomeController();
    GLOB.controllers.home.init();
})();

// this function is fired when module and controller in angular init completed
angular.element(document).ready(function () {
    GLOB.controllers.home.angularReadyFunction();
});
//# sourceMappingURL=home.js.map
