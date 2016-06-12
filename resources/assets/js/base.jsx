class BaseController {
    constructor() {
        this.utils = new Utils();
        this.app = null;
        this.modalScope = null;
        this.currency = new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"});
        this.modalWrapper = $("#modalWrapper");
    }

    init() {
        this.initModule();
        this.initModalController();
        this.bindCommonEvent();
    }

    initModalController() {
        let $this = this;
        this.app.controller('modalController', ($scope) => {
            /* alert modal */
            $scope.alertInit = () => {
                $scope.alertTitle = "Message";
                $scope.alertMessage = "";
                $scope.alertCloseFunction = null;
                $scope.alertInRed = false;
            };
            $scope.alertClose = () => {
                if ($scope.alertCloseFunction) $scope.alertCloseFunction();
                $this.hideAlertMessage();
            };

            /* confirm modal */
            $scope.confirmInit = () => {
                $scope.confirmTitle = "Confirm";
                $scope.confirmYesTitle = "Yes";
                $scope.confirmNoTitle = "No";
                $scope.confirmMessage = "";
                $scope.confirmCloseFunction = null;
                $scope.confirmYesFunction = null;
                $scope.confirmNoFunction = null;
            };
            $scope.confirmClose = () => {
                if ($scope.confirmCloseFunction) $scope.confirmCloseFunction();
                $this.hideConfirmMessage();
            };
            $scope.confirmYes = () => {
                $scope.confirmYesFunction();
                $this.hideConfirmMessage();
            };
            $scope.confirmNo = () => {
                if ($scope.confirmNoFunction) $scope.confirmNoFunction();
                $this.hideConfirmMessage();
            };
        });
    }

    initModule() {
        this.app =
            angular
                .module('lottery', ['ngResource'])
                .filter('range', () => {
                    return (input, min, max, step = 1) => {
                        min = parseInt(min);
                        max = parseInt(max);

                        for (let i = min; i <= max; i += step) {
                            input.push(i);
                        }
                        return input;
                    }
                })
                .filter("sanitize", ['$sce', ($sce) => {
                    return (htmlCode) => {
                        return $sce.trustAsHtml(htmlCode);
                    }
                }])
                .directive('onFinishRender', ($timeout) => {
                    return (scope, element, attrs) => {
                        if (scope.$last === true){
                            $timeout(() => {
                                scope.$eval(attrs.onFinishRender);
                            }, 5);
                        }
                    };
                })
                .config(['$httpProvider', ($httpProvider) => {
                    $httpProvider.interceptors.push('customHttpInterceptor');
                }])
                .factory('customHttpInterceptor', () => {
                    // intercept function for show / hide loading when sending http ajax
                    return {
                        request: (config) => {
                            $("#mainLoading").show();
                            return config;
                        },

                        requestError: (config) => {
                            $("#mainLoading").hide();
                            console.log("request Error");
                            return config;
                        },

                        response: (res) =>{
                            console.log(res.data);
                            $("#mainLoading").hide();

                            return res;
                        },

                        responseError: (res) => {
                            $("#mainLoading").hide();
                            console.log("response Error");
                            console.log(res);
                            return res;
                        }
                    }
                });
    }

    /**
     * this function listen to common event on the master page
     */
    bindCommonEvent() {

    }

    /**
     * call this function when angular ready render component
     */
    angularReadyFunction() {
        this.modalScope = angular.element($("#modalWrapper")).scope();
    }

    /**
     * show alert message
     * @param options {message, title, onClose, inRed}
     */
    showAlertMessage(options) {
        if (!options.message) {
            console.warn("message param is required when calling showAlertMessage");
            return;
        }

        let message = options.message;
        let title = options.title || "Message";
        let closeFunction = options.onClose || null;
        let inRed = options.inRed || false;
        this.modalScope.alertTitle = title;
        this.modalScope.alertMessage = message;
        this.modalScope.alertCloseFunction = closeFunction;
        this.modalScope.alertInRed = inRed;
        $("#alertModal").modal('show');
    }

    /**
     * hide alert message and reset params
     */
    hideAlertMessage() {
        // reset params
        this.modalScope.alertInit();
        $("#alertModal").modal('hide');
    }

    /**
     * show confirm message with Yes No button
     * @param options {message, title, yesTitle, noTitle, onClose, onNo, onYes}
     */
    showConfirmMessage(options) {
        if (!options.message || !options.onYes) {
            console.warn("message param and onYes callback function are required when calling showConfirmMessage");
            return;
        }

        let message = options.message;
        let title = options.title || "Message";
        let yesTitle = options.yesTitle || "Yes";
        let noTitle = options.noTitle || "No";
        let closeFunction = options.onClose || null;
        let noFunction = options.onNo || null;
        let yesFunction = options.onYes || null;
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
    hideConfirmMessage() {
        // reset params
        this.modalScope.confirmInit();
        $("#confirmModal").modal('hide');
    }
}