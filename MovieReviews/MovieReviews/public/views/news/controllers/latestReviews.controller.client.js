(function () {
    
    angular.module('WDP')
        .controller('latestReviewCtrl',latestReviewCtrl);
    
    function latestReviewCtrl($scope,$http,isLoggedIn,UserService,$location,$window,NewsService) {

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
        var url ='http://content.guardianapis.com/search?&format=json&tag=film/film,tone/reviews&show-fields=trailText,byline,thumbnail,shortUrl,starRating,publication&from-date=2017-06-01&&order-by=newest&api-key=d5457e48-805f-4353-aca6-32df568fab15';
        function init() {

           return NewsService.getLatestReviews().then(function (reviews) {
               model.newsReviews = reviews;
            })
        }init();

        // function getAllNews() {
        //    return
        // }

    }
})();