(
    function () {
        angular
            .module("WDP")
            .controller('nowplayingmovieListCtrl', nowplayingmovieListCtrl);

        function nowplayingmovieListCtrl($route,UserService,MovieService, $location, $routeParams, $sce,isLoggedIn) {
            var model = this;
            model.genreId = $routeParams.genreId;
            model.pagination = pagination;
            model.search = search;
            model.isLoggedIn=isLoggedIn;
            model.bookmark = bookmark;
            model.removebookmark = removebookmark;
            model.likeMovie = likeMovie;
            model.unlikeMovie = unlikeMovie;
            model.logout = logout;
            model.searchMovie = searchMovie;

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
            function init() {

                MovieService
                    .getConfig()
                    .then(function (configs) {
                        var baseURL = configs.images.secure_base_url+"";
                        var size = configs.images.profile_sizes[2];
                        var poster_config_path = baseURL + size;
                        MovieService
                            .getNowPlayingMovies()
                            .then(function (response) {
                                getMovieInfo(response,poster_config_path);
                            });
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
                        for(m in model.likedMovies) {
                            if(model.likedMovies[m] === movieId)
                                model.likedMovies.splice(m, 1);
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
                            .getNowPlayingSortedMoviesByPageNumber(attr, order, pageNumber)
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
                                .getNowPlayingMoviesByPageNumber(pageNumber)
                                .then(function (response) {
                                    getMovieInfo(response, poster_config_path, pageNumber);
                                });
                        }
                        else{
                            searchSortedMoviesByPageNumber(model.attribute,model.order,pageNumber);
                        }
                    });
            }

            function getMovieInfo(response,poster_config_path,pageNumber){
                model.pagenumber = (pageNumber-1)*10;
                for(m in response.results){
                    var movie = response.results[m];
                    model.movieId = movie.id;
                    var path = poster_config_path + movie.poster_path;
                    movie.poster_path = path;
                    arr = movie.release_date.split("-");
                    movie.release_date = arr[0];
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
                model.movies = response.results;
            }
        }
    }
)();