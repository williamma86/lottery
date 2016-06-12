@extends('layout')

@section('content')
<section class="wrapper" ng-controller="homeController" id="homeController">
    <div class="row ">
        <div class="col-lg-6">
            <h3 class="page-header"><i class="fa fa-table"></i> BẢNG KẾT QUẢ</h3>
        </div>
        <div class="col-lg-6 pull-right text-right mt15">
            Chọn đài: <select ng-options="opt.value as opt.text for opt in channelOptions" ng-model="channelId" ng-change="changeChannel()"></select>&nbsp;&nbsp;&nbsp;
            <input type="checkbox" value="1" ng-model="isTwoNumber"/><label for="showTwoNumber">Chỉ hiển thị 2 số cuối</label>
        </div>
    </div>

    {{--<div class="row">--}}
        {{--<div class="col-lg-12">--}}
            {{--<ol class="breadcrumb">--}}
                {{--<li><i class="fa fa-home"></i><a href="/">Home</a></li>--}}
            {{--</ol>--}}
        {{--</div>--}}
    {{--</div>--}}

    <div class="row">
        <div class="col-lg-12">
            <section class="panel">
            <table class="table table-striped table-advance table-hover">
                <thead>
                <tr>
                    <th width="36px"></th>
                    <th ng-repeat="h in headers" width="90px">
                        <i class="icon_calendar"></i> @{{h | date:configs.displayDateFormat}}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="contentData in contents">
                    <td>@{{ contentData[0] }}</td>
                    <td ng-repeat="data in contentData" ng-if="$index > 0" ng-class="{'warning': data.last_two_number == selectedNumber}">
                        @{{ isTwoNumber == 1 ? data.last_two_number : data.number}}
                    </td>
                </tr>
                </tbody>
            </table>
            </section>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-8">
            <div class="row">
                <div class="col-lg-2 text-right">Action:</div>
                <div class="col-lg-4"><select class="form-control" ng-options="value as text for (value, text) in actionOptions" ng-model="action"></select></div>
                <div class="col-lg-2 text-right">Within Times:</div>
                <div class="col-lg-2"><input class="form-control" type="number" min="1" max="@{{ maxTimes }}" ng-model="withinTimes"/></div>
                <div class="col-lg-2"><input type="submit" class="btn btn-primary form-control" ng-click="doAction()"/></div>
            </div>
        </div>
    </div>

    <div class="row mt20" ng-if="!equal({}, searchRows)">
        <div class="col-lg-12">
            <section class="panel">
                <table class="table table-striped table-advance table-hover">
                    <thead>
                    <tr>
                        <th width="60px">Count</th>
                        <th class="text-left">Numbers</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="(count, numbers) in searchRows">
                        <td>@{{ count }}</td>
                        <td>
                            <ul class="table-numbers">
                                <li ng-repeat="number in numbers" ng-click="highlightNumber(number)">@{{ number }}</li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</section>
@endsection

@section('footer')
    <script src="{{ asset('/js/pages/home.js') }} "></script>
@endsection