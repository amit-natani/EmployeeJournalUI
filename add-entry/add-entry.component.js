angular.
module('addEntry').
component('addEntry', {
  templateUrl: 'add-entry/add-entry.template.html',
  controller: ['$http', '$scope', '$compile', function AddEntryController($http, $scope, $compile) {

    $scope.entry = {
      approver_ids: []
    }

    $scope.api_url = "https://employee-journal.herokuapp.com";
    // $scope.api_url = "http://localhost:3001";

    $scope.page = {
      custom_page: null
    }

    $scope.showSharingUserList = false;

    $scope.sharingLevels = [{
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
    }]

    $http.get(`${$scope.api_url}/entry_types/root_entry_types.json`).then(function (response) {
      $scope.rootEntryTypes = response.data
    });

    // $http.get(`${$scope.api_url}/entry_types.json`).then(function (response) {
    //   $scope.entryTypes = response.data
    // });

    $http.get(`${$scope.api_url}/users.json`).then(function (response) {
      $scope.users = response.data
    });

    $http.get(`${$scope.api_url}/entries.json`).then(function (response) {
      $scope.entries = response.data
    });

    $scope.getSubEntryTypes = function (selected) {
      $http.get(`${$scope.api_url}/entry_types/${selected.id}/sub_entry_types.json`).then(function (response) {
        $scope.entryTypes = response.data
      });
    }

    $scope.getCustomFields = function () {
      $scope.entry.content = {}
      $scope.entry.title = "";
      $scope.entry.description = "";
      $scope.entry.sharee_ids = [];
      $scope.entry.sharing_level = undefined;
      $scope.entry.tagged_user_ids = [];
      $http.get(`${$scope.api_url}/entry_types/${$scope.entry.entry_type_id}/get_custom_form.json`).then(function (response) {
        $scope.page.custom_page = "add-entry/add_templates" + response.data.custom_fields.create_url
      });
      $http.get(`${$scope.api_url}/tags/get_billing_head_list.json`).then(function (response) {
        $scope.projects = response.data;
      });
    }

    $scope.saveEntry = function () {
      let errors = [];
      if ($scope.entry.root_entry_type_id == undefined) {
        errors.push("Select Entry domain");
      }
      if ($scope.entry.entry_type_id == undefined) {
        errors.push("Select Entry Type");
      }
      if ($scope.entry.description == undefined || $scope.entry.description.trim() == "") {
        errors.push("Enter Description");
      }
      if ($scope.entry.sharing_level == undefined || $scope.entry.description.trim() == "") {
        errors.push("Select Sharing level");
      }
      if (errors.length == 0) {
        $scope.entry.shared_with = {
          permissionLevel: "READ",
          permissionLabel: "Project Members",
          users: $scope.entry.sharee_ids
        }
        $http.post(`${$scope.api_url}/entries.json`, $scope.entry).then(function (response) {
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
      $scope.entry.sharee_ids = []
    }

    $scope.selectSuggestion = function(suggestion) {
      var str = $("#textarea").val();
      var div = document.createElement("div");
      $("#textarea").parent().parent().find(".suggestions").html(div);
      let currentIndex = $("#textarea").get(0).selectionStart;
      let sub_str = str.substr(0, currentIndex)
      let lastIndexOfHash = str.lastIndexOf("#");
      let sub_str1 = str.substr(0, lastIndexOfHash + 1);
      sub_str1 += suggestion;
      $("#textarea").val(sub_str1)
    }

    // $('#textarea').textcomplete([
    //   {
    //     match: /(^|\s)@(\w*(?:\s*\w*))$/,
    //     search: function(query, callback) {
    //       lastQuery = query;
    //       console.log("--",lastQuery)
    //       index.search(lastQuery, { hitsPerPage: NB_RESULTS_DISPLAYED })
    //         .then(function searchSuccess(content) {
    //           if (content.query === lastQuery) {
    //             callback(content.hits);
    //           }
    //         })
    //         .catch(function searchFailure(err) {
    //           console.error(err);
    //         });
    //     },
    //     // #5 - Template used to display each result obtained by the Algolia API
    //     template: function (hit) {
    //       // Returns the highlighted version of the name attribute
    //       return hit._highlightResult.name.value;
    //     },
    //     // #6 - Template used to display the selected result in the textarea
    //     replace: function (hit) {
    //       return ' @' + hit.name.trim() + ' ';
    //     }
    //   }
    // ], {
    //     footer: '<div style="text-align: center; display: block; font-size:12px; margin: 5px 0 0 0;">Powered by <a href="http://www.algolia.com"><img src="https://www.algolia.com/assets/algolia128x40.png" style="height: 14px;" /></a></div>'
    // });

    $scope.handleTagging = function (event) {
      var str = $("#textarea").val();
    
      $("#textarea").parent().parent().find(".highlighter").css("width", $("#textarea").css("width"));
      str = str.replace(/\n/g, '<br>');
      if (!str.match(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?#([a-zA-Z0-9]+)/g) && !str.match(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?@([a-zA-Z0-9]+)/g) && !str.match(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?#([\u0600-\u06FF]+)/g) && !str.match(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?@([\u0600-\u06FF]+)/g)) {
        if (str.match(/#/g)) {
          if(str.indexOf("#") == str.lastIndexOf("#")) {
            new_str = str.substr(0, $("#textarea").get(0).selectionStart)
          } else {
            new_str = str.substr(str.lastIndexOf("#"), $("#textarea").get(0).selectionStart)
          }
          console.log(new_str)
          if(new_str.match(/#([_a-zA-Z0-9])/g) != null) {
            text = new_str.match(/#([_a-zA-Z0-9])/g)[new_str.match(/#([_a-zA-Z0-9]+)/g).length - 1];
            text = text.slice(1, text.length);
            $http({
              url: `${$scope.api_url}/tags/get_open_suggestions.json`,
              method: "GET",
              params: {
                query: text
              }
            }).then(function (response) {
              $scope.suggestions = response.data;
              if($scope.suggestions.length == 0) {
                var div = document.createElement("div");
                $("#textarea").parent().parent().find(".suggestions").html(div);
              } else {
                let txt1 = "<ul>"
                $scope.suggestions.forEach(suggestion => {
                  txt1 += `<li ng-click='selectSuggestion("${suggestion}")'>` + suggestion + "</li>"
                });
                txt1 += "</ul>";
                // $("#textarea").parent().find(".suggestions").html(txt1);
                // ______________________
                var x = $("#textarea").offset().left + $("#textarea").get(0).selectionEnd;
                var y = $("#textarea").offset().top;

                var div = document.createElement("div");
                div.style.position = "relative";
                div.style.width = "100px";
                div.style.background = "transparent";
                div.style.color = "black"
                div.style.border = "thin solid black";
                div.innerHTML = txt1;
                div.style.left = x.toString()+"px";
                div.style.marginTop = "-25px";
                div.style.zIndex = "100000000";
                div.setAttribute("id", "Please");
                // document.body.appendChild(div);
                $("#textarea").parent().parent().find(".suggestions").html(div);
                $compile(div)($scope);
              }
            });
          } else {
            var div = document.createElement("div");
            $("#textarea").parent().parent().find(".suggestions").html(div);
          }
          str = str.replace(/#(([_a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g, '<span class="hashtag">#$1</span>');
        } else {
          str = str.replace(/#(([_a-zA-Z0-9]+)|([\u0600-\u06FF]+))#(([_a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g, '<span class="hashtag">#$1</span>');
        }
        if (str.match(/@(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g)) {
          new_str = str.substr(0, $("#textarea").get(0).selectionStart)
          text = new_str.match(/@(([_a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g)[new_str.match(/@(([_a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g).length - 1];
          text = text.slice(1, text.length);
          $http({
            url: `${$scope.api_url}/users/get_users.json`,
            method: "GET",
            params: {
              query: text
            }
          }).then(function (response) {
            return response.data
          });
          str = str.replace(/@(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g, '<span class="hashUser">@$1</span>');
        } else {
          str = str.replace(/@(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))@(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g, '<span class="hashUser">@$1</span>');
        }
      }
      $("#textarea").parent().parent().find(".highlighter").html(str);
    }
  }]
});