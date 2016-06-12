<div ng-controller="modalController" id="modalWrapper" ng-init="alertInit()">
    <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="vertical-alignment-helper">
            <div class="modal-dialog vertical-align-center">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" aria-label="Close" ng-click="alertClose()"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" ng-class="{red: alertInRed}">@{{ alertTitle }}</h4>
                    </div>
                    <div class="modal-body" ng-bind-html="alertMessage | sanitize"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" ng-class="{'btn-primary': !alertInRed, 'btn-danger': alertInRed}" ng-click="alertClose()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="vertical-alignment-helper">
            <div class="modal-dialog vertical-align-center">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" aria-label="Close" ng-click="confirmClose()"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">@{{ confirmTitle }}</h4>
                    </div>
                    <div class="modal-body" ng-bind-html="confirmMessage | sanitize"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" ng-click="confirmYes()">@{{ confirmYesTitle }}</button>
                        <button type="button" class="btn btn-default" ng-click="confirmNo()">@{{ confirmNoTitle }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="updateDBModal" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="vertical-alignment-helper">
            <div class="modal-dialog vertical-align-center">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" aria-label="Close" ng-click="updateDBClose()"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Update Addition Fields</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="to_do">
                            <li ng-repeat="field in fieldList" on-finish-render="fieldRenderFinish()">
                                <input type="checkbox" class="cbField" value="@{{ field.value }}" ng-model="field.selected">
                                @{{ field.text }}
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" ng-click="updateDBConfirm()">Confirm</button>
                        <button type="button" class="btn btn-default" ng-click="updateDBClose()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>