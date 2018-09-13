(function () {
    
    angular.module('WDP')
        .controller('talkingPointsCtrl',talkingPointsCtrl);
    
    function talkingPointsCtrl($http,isLoggedIn,UserService,$location,$window,NewsService) {

        var model = this;
        model.isLoggedIn=isLoggedIn;
        model.logout = logout;
        model.redirectTo=redirectTo;
        model.searchMovie = searchMovie;

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
        //var url ='http://newsapi.org/v1/articles?source=techcrunch&apiKey=e652550722294cb5b5ef87e76ae5e2f3';
        function init() {

            return NewsService.getTalkingPoints().then(function (talkingPoints) {
                model.talkingPoints = talkingPoints;
            })
        }init();

        // function getAllNews() {
        //    return
        // }

    }
})();