angular.module('starter.controllers', ['ngStorage', 'ngCordova'])

  .controller('DashCtrl', function ($scope, $http, $ionicLoading, $state, $ionicModal, $localStorage, $cordovaFileTransfer ) {
    $scope.posts = [];
    $scope.newPost = {};
    $scope.newPost.wifi = false;
    $scope.newPost.pets = false;
    $scope.newPost.parking = false;
    $scope.newPost.laundry = false;
    $scope.newPost.furnished = false;
    $scope.newPost.smoking = false;
    $scope.newPost.content = "";

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

      console.log($scope.newPost.title);

      var filename = "photo.png";

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/png",
        params: {
          'token': $localStorage.token,
          'user_id': $localStorage.user_id,
          'title': $scope.newPost.title,
          'rooms': $scope.newPost.rooms,
          'price': $scope.newPost.price,
          'wifi': $scope.newPost.wifi,
          'pets': $scope.newPost.pets,
          'parking': $scope.newPost.parking,
          'laundry': $scope.newPost.laundry,
          'furnished': $scope.newPost.furnished,
          'smoking': $scope.newPost.smoking
        }
      };

      console.log("2"+ $scope.newPost.content);
      $cordovaFileTransfer.upload("http://localhost:8080/api/post", $scope.newPost.content, options).success(function(response){
        console.log(response);
        alert("Post was successful!");
        console.log($scope.newPost);
        $scope.newPost = {};
        $scope.newPost.wifi = false;
        $scope.newPost.pets = false;
        $scope.newPost.parking = false;
        $scope.newPost.laundry = false;
        $scope.newPost.furnished = false;
        $scope.newPost.smoking = false;
        $ionicLoading.hide();
        $scope.closeModal();
      }).error(function(error){
        alert("There was an issue posting your ad.");
        console.log(error);
        $ionicLoading.hide();
        $scope.closeModal();
      })

    };

    $scope.takePhoto = function() {
      var cameraOptions = {
        destinationType: Camera.DestinationType.FILE_URI,
        targetWidth: 700,
        targetHeight: 700
      };

      navigator.camera.getPicture(function(data){

        $scope.newPost.content = data;
      }, function(err){
        alert("Oops ! Can't take your photo!");
      }, cameraOptions);
    };

    $scope.deletePost = function(id) {
      $ionicLoading.show({
        template: 'Removing your Post...'
      });

      $http.delete('http://localhost:8080/api/post/' + id).success(function(data) {
        $scope.todos = data; // assign our new list of todos
        $state.go($state.current, {}, {reload: true});
        $ionicLoading.hide();
      });
    };

    $scope.toggleFilter = function(filter) {
      switch (filter) {
        case "wifi":
          console.log('wifi have been toggled');
          $scope.newPost.wifi = !$scope.newPost.wifi;
          console.log($scope.newPost.wifi);
          if ($scope.newPost.wifi) {
            $(".tagIconWifi").addClass("tagIconActive");
          } else {
            $(".tagIconWifi").removeClass("tagIconActive");
          }
          break;
        case "pets":
          console.log('pets have been toggled');
          $scope.newPost.pets = !$scope.newPost.pets;
          console.log($scope.newPost.pets);
          if ($scope.newPost.pets) {
            $(".tagIconPets").addClass("tagIconActive");
          } else {
            $(".tagIconPets").removeClass("tagIconActive");
          }
          break;
        case "parking":
          console.log('parking has been toggled');
          $scope.newPost.parking = !$scope.newPost.parking;
          console.log($scope.newPost.parking);
          if ($scope.newPost.parking) {
            $(".tagIconPark").addClass("tagIconActive");
          } else {
            $(".tagIconPark").removeClass("tagIconActive");
          }
          break;
        case "laundry":
          console.log("laundry has been toggled");
          $scope.newPost.laundry = !$scope.newPost.laundry;
          console.log($scope.newPost.laundry);
          if ($scope.newPost.laundry) {
            $(".tagIconLaun").addClass("tagIconActive");
          } else {
            $(".tagIconLaun").removeClass("tagIconActive");
          }
          break;
        case "furnished":
          console.log("furnished has been toggled");
          $scope.newPost.furnished = !$scope.newPost.furnished;
          console.log($scope.newPost.furnished);
          if ($scope.newPost.furnished) {
            $(".tagIconFurn").addClass("tagIconActive");
          } else {
            $(".tagIconFurn").removeClass("tagIconActive");
          }
          break;
        case "smoking":
          console.log("smoking has been toggled");
          $scope.newPost.smoking = !$scope.newPost.smoking;
          console.log($scope.newPost.smoking);
          if ($scope.newPost.smoking) {
            $(".tagIconSmok").addClass("tagIconActive");
          } else {
            $(".tagIconSmok").removeClass("tagIconActive");
          }
          break;

      }

    }

  })

  .controller('AppCtrl', function ($scope, $http, $localStorage, $state, isLoggedIn) {
    $scope.loginData = {};
    $scope.loggedIn = isLoggedIn;

    if($scope.loggedIn){
      $state.go('tab.dash');
    }


    console.log("The login status is "+ $scope.loggedIn);

    $scope.logout = function() {
      delete $localStorage.user_id;
      delete $localStorage.token;
      $scope.loggedIn = false;
      $state.go('login');
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

  .controller('AccountCtrl', function ($scope, $state, $localStorage) {
    $scope.logout = function() {
      delete $localStorage.user_id;
      delete $localStorage.token;
      $scope.loggedIn = false;
      $state.go('login');
      console.log($localStorage.user_id, $localStorage.token);
    };
  });
