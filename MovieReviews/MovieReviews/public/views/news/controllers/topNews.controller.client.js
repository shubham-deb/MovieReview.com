(function () {
    
    angular.module('WDP')
        .controller('topNewsCtrl',topNewsCtrl);
    
    function topNewsCtrl($http,isLoggedIn,UserService,$location,$window,NewsService) {

        var model = this;
        model.isLoggedIn=isLoggedIn;
        model.logout = logout;
        model.redirectTo=redirectTo;
        model.searchMovie  = searchMovie;
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
        function init() {

           return NewsService.getTopNews().then(function (news) {
               model.allNews= news;
            })
        }init();

        // function getAllNews() {
        //    return
        // }

    }
})();