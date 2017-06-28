(function () {
    
    angular.module('WDP')
        .controller('latestReviewCtrl',latestReviewCtrl);
    
    function latestReviewCtrl($scope,$http,isLoggedIn,UserService,$location,$window,NewsService) {

        var model = this;
        model.isLoggedIn=isLoggedIn;
        model.logout = logout;
        model.redirectTo=redirectTo;
        model.searchMovie = searchMovie;

        function init() {

            return NewsService.getLatestReviews().then(function (reviews) {
                model.newsReviews = reviews;
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

        // function getAllNews() {
        //    return
        // }

    }
})();