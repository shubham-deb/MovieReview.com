
(function () {
    var app = angular.module("WDP");
    app.config(configuration);

    function configuration($routeProvider) {
         $routeProvider
            .when('/',{
                templateUrl:'views/home/templates/home2.view.client.html',
                controller:'homeCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
            .when('/home',{
                templateUrl:'views/home/templates/home2.view.client.html',
                controller:'homeCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
             .when('/login',{
                 templateUrl:'views/user/templates/login.view.client.html',
                 controller: 'loginCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
             .when('/movie/search/:query',{
                 templateUrl:'views/movie/templates/movie-search-list.view.client.html',
                 controller:'movieSearchCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
             .when('/movie/genre/:genreId',{
                 templateUrl:'views/movie/templates/movie-genre-list.view.client.html',
                 controller:'movieGenreCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
            .when('/movie/:movieId',{
                templateUrl:'views/movie/templates/movie-review.view.client.html',
                controller:'movieReviewCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
            .when('/theatremovie',{
                templateUrl:'views/movie/templates/theatre-movie-list.view.client.html',
                controller:'theatremovieListCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
             .when('/coming-soon',{
                 templateUrl:'views/movie/templates/upcoming-movie-list.view.client.html',
                 controller:'upcomingmovieListCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
             .when('/top-rated',{
                 templateUrl:'views/movie/templates/top-rated-movie-list.view.client.html',
                 controller:'topratedmovieListCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
             .when('/now-playing',{
                 templateUrl:'views/movie/templates/now-playing-movie-list.view.client.html',
                 controller:'nowplayingmovieListCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
             .when('/most-popular',{
                 templateUrl:'views/movie/templates/popular-movie-list.view.client.html',
                 controller:'popularmovieListCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
            .when('/contactUs',{
                templateUrl:'views/contact/templates/contact.view.client.html',
                controller:'homeCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
            .when('/aboutUs',{
                templateUrl:'views/home/templates/about.view.client.html',
                controller:'homeCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }

            })

             .when('/news/top_news',{
                templateUrl:'views/news/templates/topNews.view.client.html',
                controller:'topNewsCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
             .when('/news/latest_reviews',{
                 templateUrl:'views/news/templates/latestReviews.view.client.html',
                 controller:'latestReviewCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkLoggedIn }
             })
            .when('/news/talking_points',{
                templateUrl:'views/news/templates/talkingPoints.view.client.html',
                controller:'talkingPointsCtrl',
                controllerAs:'model',
                resolve: { isLoggedIn: checkLoggedIn }
            })
        //    User Congig Settings
             .when('/profile',{
                 templateUrl: 'views/user/templates/profile.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:"model",
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/account',{
                 templateUrl:'views/user/templates/account-settings.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/watchlist',{
                 templateUrl:'views/user/templates/watchlist.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/likedmovies',{
                 templateUrl:'views/user/templates/likedmovies.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/user_reviews',{
                 templateUrl:'views/user/templates/user-reviews.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/followers',{
                 templateUrl:'views/user/templates/followers.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/following',{
                 templateUrl:'views/user/templates/following.view.client.html',
                 controller: 'profileCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/user/view_person/:personId',{
                 templateUrl:'views/user/templates/person.view.client.html',
                 controller: 'personCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: resolveProfile }
             })
             .when('/admin/dashboard',{
                 templateUrl:'views/admin/templates/dashboard.view.client.html',
                 controller: 'adminDashboardCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkAdmin }
             })
             .when("/admin/dashboard/edit_users",{
                 templateUrl:'views/admin/templates/users.view.client.html',
                 controller: 'adminDashboardCtrl',
                 controllerAs:'model',
                 resolve: { isLoggedIn: checkAdmin }
             })
             .when("/admin/dashboard/create_user",{
                 templateUrl:'views/admin/templates/create-user.view.client.html',
                 controller: 'adminDashboardCtrl',
                 controllerAs:'model',
                  resolve: { isLoggedIn: checkAdmin }
             })
             .when("/admin/dashboard/reviews",{
                 templateUrl:'views/admin/templates/reviews.view.client.html',
                 controller: 'adminDashboardCtrl',
                 controllerAs:'model',
                  resolve: { isLoggedIn: checkAdmin }
             })
             .when("/admin/user/:userId",{
             templateUrl:'views/admin/templates/user-details.view.client.html',
             controller: 'adminDashboardCtrl',
             controllerAs:'model',
             resolve: { isLoggedIn: checkAdmin }
         })
        }


        function checkLoggedIn($q, $timeout, $http, $location, $rootScope,UserService) {
            var deferred = $q.defer();
            UserService
                .checkLoggedIn()
                .then(function (user) {
                    if(user==='0'){
                        deferred.resolve({});
                        //$location.url('/');
                    }else{
                        deferred.resolve(user);
                    }
                });
            return deferred.promise;
        }


        function resolveProfile($q, $timeout, $http, $location, $rootScope,UserService) {
            var deferred = $q.defer();
            UserService
                .checkLoggedIn()
                .then(function (user) {
                    if(user==='0'){
                        deferred.reject({});
                        $location.url('/login');
                    }else{
                        deferred.resolve(user);
                    }
                });
            return deferred.promise;
        }

        function checkAdmin($q, $timeout, $http, $location, $rootScope,UserService) {
            var deferred = $q.defer();
            UserService
                .checkAdmin()
                .then(function (user) {
                    if(user==='0'){
                        deferred.resolve({});
                        $location.url('/home');
                    }else{
                        deferred.resolve(user);
                    }
                });
            return deferred.promise;
        }



    }
)();