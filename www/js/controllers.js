angular.module('starter.controllers', ['ngStorage'])

  .controller('DashCtrl', function ($scope, $ionicLoading, $ionicModal, $localStorage, $http, $state) {
    $scope.posts = [];
    $scope.newPost = {};

    //$ionicLoading.show({
    //  template: 'Loading Posts...'
    //});

    $scope.loadPosts = function(){
      $http.get("http://localhost:8080/api/post").then(function(result){
        $scope.posts = result.data;
        $ionicLoading.hide();
      }, function(error){
        alert("There was an issue retrieving posts. Check the logs.");
        console.log(error);
        $ionicLoading.hide();
      })
    };

    $ionicModal.fromTemplateUrl('templates/post-form.html', {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
    });

    $scope.openModal = function(){
      $scope.modal.show();
    };

    $scope.closeModal = function(){
      $scope.modal.hide();
    };

    $scope.createPost = function(){

      $ionicLoading.show({
        template: 'Posting your ad...'
      });

      $http.post("http://localhost:8080/api/post", $scope.newPost).success(function(response){
        alert("Post was successful!");
        $scope.newPost = {};
        $ionicLoading.hide();
        $scope.closeModal();
      }).error(function(error){
        alert("There was an issue posting your ad.");
        console.log(error);
        $ionicLoading.hide();
        $scope.closeModal();
      })

    }


  })

  .controller('AppCtrl', function ($scope, $http, $localStorage, $state, isLoggedIn) {
    $scope.loginData = {};
    $scope.loggedIn = isLoggedIn;

    $scope.logout = function() {
      delete $localStorage.user_id;
      delete $localStorage.token;
      $scope.loggedIn = false;
      console.log($localStorage.user_id, $localStorage.token);
    };

    $scope.signup = function(){
      $http.post("http://localhost:8080/api/signup", {display_name: $scope.loginData.display_name, email: $scope.loginData.email, password: $scope.loginData.password}).then(function(result){
        if(result.data.signupstatus == "success"){
          $localStorage.user_id = result.data.userid;
          $localStorage.token = result.data.token;
          $scope.loggedIn = true;
          $state.go('tab.dash');
          alert("Account successfully created!");
        }else{
          alert(result.data.message);
        }
      }, function(error){
        alert("There was an issue with creating your account.");
        console.log(error);
      });
    };

    $scope.login = function () {
      console.log("LOGIN user: " + $scope.loginData.email + " - PW: " + $scope.loginData.password);
      $http.post("http://localhost:8080/api/login", {email: $scope.loginData.email, password: $scope.loginData.password}).then(function(result){
        if (result.data.loginstatus == "success"){
          $localStorage.user_id = result.data.userid;
          $localStorage.token = result.data.token;
          $scope.loggedIn = true;
          $state.go('tab.dash');
          alert("Yay! You have successfully logged in with the name:" + result.data.userid);
        }
        else{
          //Failed to Login
          alert(result.data.message);
        }
      }, function(error){
        alert("There was a problem getting your profile. Check the logs for details.");
        console.log(error);
      });
    };

    $scope.go = function(location){
      $state.go(location);
    }
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
