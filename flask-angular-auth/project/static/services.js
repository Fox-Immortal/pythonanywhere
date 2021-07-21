angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {      
      var user_in = false;
      return ({
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        register: register,
        getUserStatus: getUserStatus
      });

      function isLoggedIn() {
        return user_in;
      }

      function login(email, password) {

        // create a new instance of deferred
        var deferred = $q.defer();
        loggedOut = false;
        // send a post request to the server
        $http.post('/api/login', { email: email, password: password })
          // handle success
          .then((response) => {
            if (response.status === 200 && response.data.result) {
              user_in = true;
              deferred.resolve();
            } else {
              user_in = false;
              deferred.reject();
            }
          }, (response) => {
            user_in = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

      function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        loggedOut = false;
        $http.get('/api/logout')
          .then((response) => {
            user_in = false;
            deferred.resolve();
          }, (response) => {
            user_in = false; 
            deferred.reject();
          });
        return deferred.promise;

      }

      function register(email, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/api/register', { email: email, password: password })
          .then((response) => {
            if (response.status === 200 && response.data.result) {
              deferred.resolve();
            }
          }, (response) => {
            deferred.reject();
          });
        // return promise object
        return deferred.promise;
      }

      function getUserStatus() {
        var deferred = $q.defer();

        return $http.get('/api/status')
          .then((response) => {
            // alert(response.status);
            if (response.status == 200) 
              user_in = response.data.result;
            deferred.resolve();
          }, (response) => {
            user_in = false;
            deferred.reject();
          });
      }

    }]);