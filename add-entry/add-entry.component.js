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

        $scope.selected = undefined;

        $scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

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
          $http.get(`https://blooming-peak-77662.herokuapp.com/entry_types/${$scope.entry.entry_type_id}/get_custom_form.json`).then(function(response) {
            $scope.page.custom_page = "add-entry/add_templates" + response.data.custom_fields.create_url
          });
          $http.get('https://blooming-peak-77662.herokuapp.com/tags/5bc5ad3c647dbf2011452758/values.json').then(function(response) {
            $scope.projects = response.data;
          });
        }

        $scope.saveEntry = function () {
          let errors = [];
          if($scope.entry.entry_type_id == undefined) {
            errors.push("Select Entry Type");
          }
          if($scope.entry.title == undefined || $scope.entry.title.trim() == "") {
            errors.push("Enter title");
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

      }]
  });