(function () {
    angular
        .module('WDP')
        .controller('homeCtrl',homeCtrl);
    
    function homeCtrl($routeParams,UserService,$location,MovieService,isLoggedIn,$http,$route,$window,NewsService) {
        var model = this;
        // model.searchMovie = searchMovie;
        model.bookmark = bookmark;
        model.removebookmark = removebookmark;
        model.searchMovie = searchMovie;

        model.user=model.isLoggedIn=isLoggedIn;
        model.logout = logout;
        function logout() {
            UserService
                .logout()
                .then(function () {
                    // $window.location.href='/#!/home';
                    model.user=model.isLoggedIn=null;
                });
        }

        function init() {

            NewsService
                .getLatestReviews()
                .then(function (reviews) {
                    model.newsReviews = reviews;
            });

            MovieService
                .getConfig()
                .then(function (configs) {
                    var baseURL = configs.images.secure_base_url+"";
                    var size = configs.images.profile_sizes[2];
                    var poster_config_path = baseURL + size;
                    MovieService
                        .getUpcomingMovies()
                        .then(function (response) {
                            getUpcomingMovieInfo(response,poster_config_path);
                        });
                    MovieService
                        .getTrendingMoviesOfThisYear()
                        .then(function (response) {
                            getTrendingMovieMovieInfo(response,poster_config_path);
                        });
                });
           if(isLoggedIn._id){
               UserService
                   .getMoviesFromWatchList(isLoggedIn._id)
                   .then(function (movies) {
                       var movieIds = [];
                       for(m in movies)
                           movieIds.push(movies[m].id);
                       model.watchListMovies = movieIds;
                   });
           }

            MovieService
                .getPopularMovies()
                .then(function (popularmovies) {
                    model.popularmovies = popularmovies.results;
                });
            MovieService
                .getNowPlayingMovies()
                .then(function (nowplayingmovies) {
                    model.nowplayingmovies = nowplayingmovies.results;
                });
            MovieService
                .getTopRatedMovies()
                .then(function (topratedmovies) {
                    model.topratedmovies = topratedmovies.results;
                });
        }

        init();

        function getUpcomingMovieInfo(response,poster_config_path) {
            for (m in response.results) {
                var movie = response.results[m];
                model.movieId = movie.id;
                var path = poster_config_path + movie.poster_path;
                movie.poster_path = path;
                // MovieService
                //     .getCredits(model.movieId)
                //     .then(function (credits) {
                //         var directors=[];
                //         var actors = [];
                //         for(a in credits.cast){
                //             if(actors.length>3)
                //                 break;
                //             else{
                //                 actors.push(credits.cast[a]);
                //             }
                //         }
                //         for(c in credits.crew){
                //             if(directors.length >2) {
                //                 break;
                //             }
                //             else{
                //                 if (credits.crew[c].department === "Directing") {
                //                     directors.push(credits.crew[c].name);
                //                 }
                //             }
                //         }
                //         model.directors = directors;
                //         model.actors = actors;
                //     });
            }
            model.upcomingmovies = response.results;
        }

        function getTrendingMovieMovieInfo(response,poster_config_path) {
            for (m in response.results) {
                var movie = response.results[m];
                model.movieId = movie.id;
                var path = poster_config_path + movie.poster_path;
                movie.poster_path = path;
            }
            model.trendingmovies = response.results;
        }

        function bookmark(movieId) {
            UserService
                .checkLoggedIn()
                .then(function (user) {
                    if(user === "0"){
                        $location.url('/login');
                    }
                    else{
                        MovieService
                            .getConfig()
                            .then(function (configs) {
                                var baseURL = configs.images.secure_base_url + "";
                                var size = configs.images.profile_sizes[2];
                                var poster_config_path = baseURL + size;
                                MovieService
                                    .getMovie(movieId)
                                    .then(function (movie) {
                                        movie.poster_path = poster_config_path + movie.poster_path;
                                        UserService
                                            .addToWatchList(movie,user._id)
                                            .then(function (response) {
                                                model.watchListMovies.push(movieId);
                                            });
                                    });
                            });
                    }
                });
        }

        function removebookmark(movieId) {
            UserService
                .checkLoggedIn()
                .then(function (user) {
                    if(user === "0"){
                        $location.url('/login');
                    }
                    else{
                        UserService
                            .deleteMovie(movieId,isLoggedIn._id)
                            .then(function (response) {
                                for(m in model.watchListMovies) {
                                    if(model.watchListMovies[m] === movieId)
                                        model.watchListMovies.splice(m, 1);
                                }
                            })
                    }
                });
        }

        function searchMovie(query) {
            $location.url('/movie/search/'+query);
        }
        // function searchMovie(query) {
        //     $location.url('/search/' + query);
        // }
    }
})();