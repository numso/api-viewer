angular.module('api').controller('mainCtrl',
  function ($scope, $http) {
    $scope.meta = {
      name: '',
      version: '',
      baseURL: ''
    };

    $scope.api = {
      tableData: [],
      tabsData: []
    };

    $scope.map = function (data) {
      if (data == 'GET') return 'btn-info';
      if (data == 'POST') return 'btn-success';
      if (data == 'DELETE') return 'btn-danger';
      if (data == 'PUT') return 'btn-primary';
      return '';
    }

    $scope.showType = 'Table';

    $http.get('/meta').then(
      function (resp) {
        $scope.meta = resp.data;
      },
      function (err) {
        console.error(err);
      }
    );

    $http.get('/file/api').then(
      function (resp) {
        var rows = resp.data;
        var tempObj = {};
        for (var i = 0; i < rows.length; ++i) {
          var d = rows[i];
          tempObj[d.group] = tempObj[d.group] || [];
          tempObj[d.group].push(d);
        }

        for (var key in tempObj) {
          $scope.api.tabsData.push({
            heading: key,
            data: tempObj[key]
          });
        }

        for (var key in tempObj) {
          $scope.api.tableData.push({
            heading: key
          });

          for (var i = 0; i < tempObj[key].length; ++i) {
            $scope.api.tableData.push(tempObj[key][i]);
          }
        }
      },
      function (err) {
        console.error(err);
      }
    );
  }
);
