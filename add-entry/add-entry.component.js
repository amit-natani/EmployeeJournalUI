angular.
  module('addEntry').
  component('addEntry', {
    templateUrl: 'add-entry/add-entry.template.html',
    controller: ['$http', '$scope',  function AddEntryController($http, $scope) {
        var self = this;

        $scope.entry = {
          approver_ids: []
        }

        $scope.page = {
          custom_page: null
        }

        $scope.showSharingUserList = false;

        $scope.sharingLevels = [
          {
            key: 'private',
            value: 'Private (Self only)'
          }, {
            key: 'public',
            value: 'Public (Everyone)'
          }, {
            key: 'managers',
            value: 'Managers (Only manager/skip level manager)'
          }, {
            key: 'custom',
            value: 'Custom (Select a custom set of users)'
          }, {
            key: 'colleagues',
            value: 'Colleagues (Other people whom are directly connected to you)'
          }, {
            key: 'tagged_users',
            value: 'Tagged users only'
          }
        ]

        $http.get('https://blooming-peak-77662.herokuapp.com/entry_types.json').then(function(response) {
          $scope.entryTypes = response.data
        });

        $http.get('https://blooming-peak-77662.herokuapp.com/users.json').then(function(response) {
          $scope.users = response.data
        });

        $http.get('https://blooming-peak-77662.herokuapp.com/entries.json').then(function(response) {
          $scope.entries = response.data
        });

        $scope.getCustomFields = function () {
          $scope.entry.content = {}
          $scope.entry.title = "";
          $scope.entry.description = "";
          $scope.entry.sharee_ids = [];
          $scope.entry.sharing_level = undefined;
          $scope.entry.tagged_user_ids = [];
          $http.get(`https://blooming-peak-77662.herokuapp.com/entry_types/${$scope.entry.entry_type_id}/get_custom_form.json`).then(function(response) {
            $scope.page.custom_page = "add-entry/add_templates" + response.data.custom_fields.create_url
          });
          $http.get('https://blooming-peak-77662.herokuapp.com/tags/get_project_list.json').then(function(response) {
            $scope.projects = response.data;
          });
        }

        $scope.saveEntry = function () {
          let errors = [];
          if($scope.entry.entry_type_id == undefined) {
            errors.push("Select Entry Type");
          }
          if($scope.entry.description == undefined || $scope.entry.description.trim() == "") {
            errors.push("Enter Description");
          }
          if($scope.entry.sharing_level == undefined || $scope.entry.description.trim() == "") {
            errors.push("Select Sharing level");
          }
          if(errors.length == 0) {
            $scope.entry.shared_with = {
              permissionLevel: "READ",
              permissionLabel: "Project Members",
              users: $scope.entry.sharee_ids
            }
            $http.post('https://blooming-peak-77662.herokuapp.com/entries.json', $scope.entry).then(function(response) {
              $scope.entry = {}
              $scope.page = {
                custom_page: null
              }
              alert("Entry created successfully")
            }, function (response) {
              alert(response.data)
            })
          } else {
            alert(errors)
          }
        }

        $scope.handleAccessibilityChange = function () {
          if($scope.entry.sharing_level == 'custom') {
            $scope.showSharingUserList = true;
          } else {
            $scope.showSharingUserList = false;
          }
          $scope.entry.sharee_ids = []
        }

      }]
  });