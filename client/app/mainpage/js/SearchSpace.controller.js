'use strict';


/***************************************************************************************************************
 * Controller: Search provenance
 ***************************************************************************************************************/

var enterpriseSearchApp = angular.module('enterpriseSearchApp');

enterpriseSearchApp.controller('searchspaceController', ["$modal", "$scope", "$http", "$window", "$rootScope",
  function ($modal, $scope, $http, $window, $rootScope) {


    $rootScope.treemapCoordinates = {
      x: 0,
      y: 0,
      w: $window.innerWidth - 20,
      h: $window.innerHeight - 20
    };

    $scope.treemapBuildData = [];

    // Setting attributes for fsglyphs & treemap
    $scope.settingAttributes = {
      type: "",
      size: "",
      date: "",
      time: "",
      depth: "2"
    }


    $scope.searchresult = [];

    /*******************************************************************************************************************
     * Set event listener on local storage
     *******************************************************************************************************************/
    angular.element($window).on('storage', function (event) {

      //alert("W2: localstorage: triggered!");
      $scope.updateResult();
    });


    /***************************************************************************************************************
     * Call treemapBuild only once, when webpage loads firt time
     ****************************************************************************************************************/

    $scope.$on('$viewContentLoaded', function () {
      //alert("Page loaded:");
      $scope.treemapBuild();
    });


    /***************************************************************************************************************
     * treemapbuild : http request to server for the
     * Send: Co-ordinates
     * Receive Json data and then draw treemap
     ****************************************************************************************************************/
    $scope.treemapBuild = function () {
      $http.post('/api/common/treemapbuild', $scope.treemapCoordinates).success(function (response) {

        //response received from server
        if (response.length > 0) {
          $scope.treemapBuildData = response;
          $rootScope.$broadcast('event:treemapbuild-received', $scope.treemapBuildData);
        }
      })
    }


    /*******************************************************************************************************************
     * Saved Result / portfolio
     *******************************************************************************************************************/
    $scope.updateResult = function () {
      var resdata = $window.localStorage.getItem('new-result');
      if (resdata != null && resdata.length != 0) {
        var rdata = JSON.parse(resdata);
        //console.log("W2::$scope.updateResult::rdata = ", rdata);
        if (rdata != null) {
          $rootScope.$apply();
          $scope.$broadcast('event:searchresult-received', rdata);
        }
        $window.localStorage.removeItem('new-result');
      }
    }

}]); // controller


