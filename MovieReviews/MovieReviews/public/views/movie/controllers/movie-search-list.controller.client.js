(
    function () {
        angular
            .module("WDP")
            .controller('movieSearchCtrl', movieSearchCtrl);

        function movieSearchCtrl(UserService,MovieService, $location, $routeParams, $sce,isLoggedIn,$route) {
            var model = this;
            model.pagination = pagination;
            model.query = $routeParams.query;
            model.search = search;
            model.bookmark = bookmark;
            model.removebookmark = removebookmark;
            model.likeMovie = likeMovie;
            model.unlikeMovie = unlikeMovie;
            model.searchMovie = searchMovie;
            model.user = model.isLoggedIn = isLoggedIn;

            function searchMovie(query) {
                $location.url('/movie/search/'+query);
            }
model.logout = logout;
            function logout() {
                UserService
                    .logout()
                    .then(function () {
                        $location.url('/');
                    });
            }

            function init() {

                MovieService
                    .getMovieIdBySearch(model.query)
                    .then(function (response) {
                        if(response.total_results <= 0)
                            model.search = false;
                        else {
                            model.search = true;
                            MovieService
                                .getConfig()
                                .then(function (configs) {
                                    var baseURL = configs.images.secure_base_url + "";
                                    var size = configs.images.profile_sizes[2];
                                    var poster_config_path = baseURL + size;
                                    getMovieInfo(response, poster_config_path);
                                });
                        }
                    });

                if(isLoggedIn._id) {
                    UserService
                        .getMoviesFromWatchList(isLoggedIn._id)
                        .then(function (movies) {
                            var movieIds = [];
                            for (m in movies)
                                movieIds.push(movies[m].id);
                            model.watchListMovies = movieIds;
                        });

                    UserService
                        .getLikedMovies(isLoggedIn._id)
                        .then(function (movies) {
                            var movieIds = [];
                            for (m in movies)
                                movieIds.push(movies[m].id);
                            model.likedMovies = movieIds;
                        })
                }
            }
            init();

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
                                                .addToWatchList(movie,isLoggedIn._id)
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

            function likeMovie(movieId) {
                UserService
                    .checkLoggedIn()
                    .then(function (user) {
                        if(user === "0"){
                            $location.url('/login');
                        }
                        else {
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
                                                .likeMovie(movie, isLoggedIn._id)
                                                .then(function (response) {
                                                    model.likedMovies.push(movieId);
                                                });
                                        });
                                });
                        }
                    });
            }

            function unlikeMovie(movieId) {
                UserService
                    .unlikeMovie(movieId,isLoggedIn._id)
                    .then(function (response) {
                        for(m in model.likedMovies){
                            movie = model.likedMovies[m];
                            if(movie === movieId){
                                model.likedMovies.splice(m,1);
                            }
                        }
                    })
            }

            function search(attr,order) {
                MovieService
                    .getConfig()
                    .then(function (configs) {
                        var baseURL = configs.images.secure_base_url + "";
                        var size = configs.images.profile_sizes[2];
                        var poster_config_path = baseURL + size;
                        MovieService
                            .getMoviesBySorting(attr, order)
                            .then(function (response) {
                                getMovieInfo(response,poster_config_path);
                            });
                    });
            }

            function searchSortedMoviesByPageNumber(attr,order,pageNumber) {
                MovieService
                    .getConfig()
                    .then(function (configs) {
                        var baseURL = configs.images.secure_base_url + "";
                        var size = configs.images.profile_sizes[2];
                        var poster_config_path = baseURL + size;
                        MovieService
                            .getRecentSortedMoviesByPageNumber(attr, order, pageNumber)
                            .then(function (response) {
                                getMovieInfo(response,poster_config_path);
                            });
                    });
            }

            function pagination(pageNumber) {
                MovieService
                    .getConfig()
                    .then(function (configs) {
                        var baseURL = configs.images.secure_base_url+"";
                        var size = configs.images.profile_sizes[2];
                        var poster_config_path = baseURL + size;
                        if((model.attribute === "" || model.attribute === undefined)
                            && (model.order === undefined || model.order === "")) {
                            MovieService
                                .getMoviesBySearchByPageNumber(pageNumber)
                                .then(function (response) {
                                    getMovieInfo(response,poster_config_path,pageNumber);
                                });
                        }else{
                            searchSortedMoviesByPageNumber(model.attribute,model.order,pageNumber);
                        }
                    });
            }

            function getMovieInfo(response,poster_config_path,pageNumber) {
                model.pagenumber = (pageNumber - 1) * 10;
                for (m in response.results) {
                    var movie = response.results[m];
                    model.movieId = movie.id;
                    var path = poster_config_path + movie.poster_path;
                    movie.poster_path = path;
                    arr = movie.release_date.split("-");
                    movie.release_date = arr[0];
                    // MovieService
                    //     .getCredits(model.movieId)
                    //     .then(function (credits) {
                    //         var directors = [];
                    //         var actors = [];
                    //         for (a in credits.cast) {
                    //             if (actors.length > 3)
                    //                 break;
                    //             else {
                    //                 actors.push(credits.cast[a]);
                    //             }
                    //         }
                    //         for (c in credits.crew) {
                    //             if (directors.length > 2) {
                    //                 break;
                    //             }
                    //             else {
                    //                 if (credits.crew[c].department === "Directing") {
                    //                     directors.push(credits.crew[c].name);
                    //                 }
                    //             }
                    //         }
                    //         model.directors = directors;
                    //         model.actors = actors;
                    //     });
                }
                model.movies = response.results;
            }
        }
    }
)();