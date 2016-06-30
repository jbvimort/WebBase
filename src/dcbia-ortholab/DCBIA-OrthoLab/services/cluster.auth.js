angular.module('cTRIVIAL')
.config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
  // register the interceptor as a service
  $provide.factory('jwtInterceptor', function($q, $location) {
    return {
      // optional method
      'request': function(config) {
        // do something on success
        var token = localStorage.getItem('clusterpost_token');
        if(token){
          config.headers.authorization = "Bearer " + token;
        }
        
        return config;
      },

      // optional method
     'requestError': function(rejection) {
        // do something on error
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      },



      // optional method
      'response': function(response) {
        // do something on success
        return response;
      },

      // optional method
     'responseError': function(rejection) {
        

        if(rejection.status === 401 && !localStorage.getItem('clusterpost_token')){
          $location.path('/');
        }

        if(rejection.status === 404) {
          $location.path('/notFound');
        }
        
        
        return $q.reject(rejection);
      }
    };
  });

  $httpProvider.interceptors.push('jwtInterceptor');

}])
.factory('clusterauth', function ($q, $http, $location, $rootScope) {
  return {
    createUser: function(user){
      return $http({
        method: 'POST',
        url: '/clusterauth/user',
        data: user
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    }, 
    getUser: function(){
      if($rootScope.user){
        return Promise.resolve($rootScope.user);
      }else{
        return $http({
          method: 'GET',
          url: '/clusterauth/user'
        }).then(function(res){
          $rootScope.user = res.data;
          return res.data;
        });
      }
    },    
    deleteUser: function(user){
      return $http({
        method: 'DELETE',
        url: '/clusterauth/user',
        data: user
      });
    },
    login: function(user){
      return $http({
        method: 'POST',
        url: '/clusterauth/login',
        data: user
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    },
    updatePassword: function(user, token){
      return $http({
        method: 'PUT',
        url: '/clusterauth/login',
        data: user,
        headers: {
          authorization: "Bearer " + token
        }
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    },
    sendRecoverPassword: function(email){
       return $http({
        method: 'POST',
        url: '/clusterauth/reset',
        data: email
      });
    },
    logout: function(){
      localStorage.removeItem('clusterpost_token');
      $location.path('/');
    }
  }
})