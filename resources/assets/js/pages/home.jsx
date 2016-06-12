class HomeController extends ListController {
    constructor() {
        super();
        this.wrapper = $("#homeController");
        this.homeScope = null;
    }

    init() {
        super.init();
        this.app.controller("homeController", ($scope, $http) => {
            $scope.channelOptions = {};
            $scope.actionOptions = GLOB.options.actions;
            $scope.action = "leastAppear";
            $scope.withinTimes = 1;
            $scope.channelId = 0;
            $scope.configs = GLOB.configs;
            $scope.headers = [];
            $scope.contents = [];
            $scope.isTwoNumber = 0;
            $scope.searchRows = null;
            $scope.maxTimes = 1;
            $scope.selectedNumber = -1;

            console.log($scope.configs);
            // call ajax and get channel options
            $http({
                method: "GET",
                url: "home/getChannels"
            }).then((response) => {
                var data = response.data;
                $scope.channelOptions = data;
                if (data.length > 0) {
                    $scope.channelId = data[0].value;
                    $scope.changeChannel();
                }
            }, (response) => {});

            // when user change the channel
            $scope.changeChannel = () => {
                console.log("changeChannel");
                $scope.searchRows = null;
                $http({
                    method: "POST",
                    url: "home/getResults",
                    data: {channelId: $scope.channelId}
                }).then((response) => {
                    // format date time
                    var headers = response.data.headers;

                    for(var i = 0; i < headers.length; i++) {
                        headers[i] = moment(headers[i], $scope.configs.databaseDateTimeFormat).valueOf();
                    }

                    $scope.contents = response.data.contents;
                    $scope.headers = headers;

                    $scope.maxTimes = headers.length;
                    console.log($scope.headers);
                }, (response) => {});
            };

            // when user click on Submit button
            $scope.doAction = () => {
                $http({
                    method: "POST",
                    url: "home/doAction",
                    data: {
                        channelId: $scope.channelId,
                        action: $scope.action,
                        withinTimes: $scope.withinTimes
                    }
                }).then((response) => {
                    $scope.searchRows = response.data;
                }, (response) => {});
            }

            // when uer click on result table
            $scope.highlightNumber = (number) => {
                $scope.selectedNumber = number;
            }
        });
    }

    angularReadyFunction() {
        super.angularReadyFunction();
        this.homeScope = angular.element(this.wrapper).scope();
    }
}

(() => {
    GLOB.controllers.home = new HomeController();
    GLOB.controllers.home.init();
})();

// this function is fired when module and controller in angular init completed
angular.element(document).ready(() => {
    GLOB.controllers.home.angularReadyFunction();
});