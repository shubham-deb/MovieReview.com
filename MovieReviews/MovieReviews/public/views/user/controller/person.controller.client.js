(function () {
    
    angular.module("WDP").controller('personCtrl',personCtrl);
    
    function personCtrl(UserService,isLoggedIn,$location,$route,$routeParams) {

        var model = this;
        model.personId=$routeParams.personId;
        model.user=model.isLoggedIn=isLoggedIn;
        model.profilePic='';
        model.logout = logout;
        model.curUrl = $location.path();
        model.unfollow=unfollow;
        model.expandWatchlist=expandWatchlist;
        model.searchMovie = searchMovie;
        // model.viewPerson=viewPerson;

        function init() {
            model.userId = isLoggedIn._id;
            model.showWatchlist=false;
            model.showReviews=false;
            model.showLikes=false;

            UserService
                .getUserReviews(model.personId)
                .then(function (userreviews) {
                    model.userreviews = userreviews;
                });

            UserService
                .getMoviesFromWatchList(model.personId)
                .then(function (movies) {
                    if(movies.length>0)
                        model.movies = movies;
                });

            UserService
                .getLikedMovies(model.personId)
                .then(function (likedmovies) {
                    if(likedmovies.length>0)
                        model.likedmovies = likedmovies;
                });
            UserService
                .getPersonById(model.personId)
                .then(function (person) {
                    model.person=person;
                });

        }init();

        function searchMovie(query) {
            $location.url('/movie/search/'+query);
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/');
                });
        }



        function unfollow(followeeId) {
            var followerId= model.user._id;
            UserService.unfollow(followeeId,followerId).then(function () {

                for(var i in model.user.following){
                    var following = model.user.following[i];
                    if(following._id===followeeId){
                        return model.user.following.splice(i,1);
                    }
                }
            })
        }

        function expandWatchlist() {
            model.showWatchlist = !model.showWatchlist;
        }

    }
})();