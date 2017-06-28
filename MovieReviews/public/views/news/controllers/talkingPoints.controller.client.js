(function () {
    
    angular.module('WDP')
        .controller('talkingPointsCtrl',talkingPointsCtrl);
    
    function talkingPointsCtrl($http,isLoggedIn,UserService,$location,$window,NewsService) {

        var model = this;
        model.isLoggedIn=isLoggedIn;
        model.logout = logout;
        model.redirectTo=redirectTo;
        model.searchMovie = searchMovie;

        function init() {

            return NewsService.getTalkingPoints().then(function (talkingPoints) {
                model.talkingPoints = talkingPoints;
            })
        }init();

        function redirectTo(url) {
            $window.open(url);
        }
        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/');
                });
        }
        function searchMovie(query) {
            $location.url('/movie/search/'+query);
        }

    }
})();