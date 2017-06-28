
(function () {
        angular
            .module("WDP")
            .factory('MovieService',MovieService);

        function MovieService($http) {
            // var API_KEY = process.env.TMDB_API_KEY;
            // var NY_API_KEY = process.env.NY_API_KEY;


            var api = {
                getConfig:getConfig,
                getMovie:getMovie,
                getVideo:getVideo,
                getCredits:getCredits,
                getActorInfo:getActorInfo,
                getSimilarMovies:getSimilarMovies,
                getGenres:getGenres,
                getMoviesByGenre:getMoviesByGenre,
                getMoviesByPageNumber:getMoviesByPageNumber,
                getSortedGenreMovies:getSortedGenreMovies,
                getMovieIdBySearch:getMovieIdBySearch,
                getRecentMovies:getRecentMovies,
                getRecentMoviesByPageNumber:getRecentMoviesByPageNumber,
                getRecentSortedMoviesByPageNumber:getRecentSortedMoviesByPageNumber,
                getUpcomingMovies:getUpcomingMovies,
                getUpcomingMoviesByPageNumber:getUpcomingMoviesByPageNumber,
                getUpcomingSortedMoviesByPageNumber:getUpcomingSortedMoviesByPageNumber,
                getTopRatedMovies:getTopRatedMovies,
                getTopRatedMoviesByPageNumber:getTopRatedMoviesByPageNumber,
                getSortedTopRatedMoviesByPageNumber:getSortedTopRatedMoviesByPageNumber,
                getReviewsByMovieName:getReviewsByMovieName,
                getReviewsByMovieId:getReviewsByMovieId,
                getMoviesBySorting:getMoviesBySorting,
                getNowPlayingMovies:getNowPlayingMovies,
                getNowPlayingMoviesByPageNumber:getNowPlayingMoviesByPageNumber,
                getNowPlayingSortedMoviesByPageNumber:getNowPlayingSortedMoviesByPageNumber,
                getPopularMovies:getPopularMovies,
                getPopularMoviesByPageNumber:getPopularMoviesByPageNumber,
                getPopularMoviesSortedMoviesByPageNumber:getPopularMoviesSortedMoviesByPageNumber,
                getTrendingMoviesOfThisYear:getTrendingMoviesOfThisYear,
                getTrendingMoviesOfThisYearByPageNumber:getTrendingMoviesOfThisYearByPageNumber,
                getMoviesBySearchByPageNumber:getMoviesBySearchByPageNumber,
                getMoviesSortedMoviesByPageNumber:getMoviesSortedMoviesByPageNumber
        };

            return api;
            
            function getMoviesBySorting(sortBy,order) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
                            "&language=en-US&sort_by=" + sortBy + "." + order + "&include_adult=false&include_video=false&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getReviewsByMovieId(movieId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getReviewsByMovieName(query) {
                var API_KEY='';
                var url = "/api/project/getNyKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
                        url += '?' + $.param({
                                'api-key': API_KEY ,
                                'query': query
                            });
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getTopRatedMovies() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getSortedTopRatedMoviesByPageNumber(attr,order,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                            }
                            else {
                                return getTopRatedMoviesByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getTopRatedMoviesByPageNumber(pageNumer) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumer;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getUpcomingMovies() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getUpcomingMoviesByPageNumber(pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumber;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getUpcomingSortedMoviesByPageNumber(attr,order,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                            }
                            else {
                                return getUpcomingMoviesByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getRecentMovies() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getRecentSortedMoviesByPageNumber(attr,order,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                            }
                            else {
                                return getRecentMoviesByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getRecentMoviesByPageNumber(pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumber;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getMovieIdBySearch(query) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY +
                            "&language=en-US&query=" + query + "&page=1&include_adult=false";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getMoviesByPageNumber(pageNumer,genreId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumer;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getMoviesByGenre(genreId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getSortedGenreMovies(attr,order,genreId,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                            }
                            else {
                                return getMoviesByGenre(genreId);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getGenres() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY + "&language=en-US";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getSimilarMovies(movieId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/" + movieId + "/similar?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getActorInfo(actorId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/person/" + actorId +
                            "?api_key=" + API_KEY + "&language=en-US";
                        return $http
                            .get(url)
                            .then(function (response) {
                                console.log(response);
                                return response.data;
                            });
                    });
            }
            
            function getCredits(movieId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=" + API_KEY;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getVideo(movieId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + API_KEY + "&language=en-US";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getMovie(movieId) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_KEY + "&language=en-US";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getConfig() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/configuration?api_key=" + API_KEY;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getNowPlayingMovies() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getNowPlayingMoviesByPageNumber(pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumber;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getNowPlayingSortedMoviesByPageNumber(attr,order,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                            }
                            else {
                                return getNowPlayingMoviesByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getPopularMovies() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY + "&language=en-US&page=1";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getPopularMoviesByPageNumber(pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY +
                            "&language=en-US&include_adult=false&sort_by=created_at.asc&page=" + pageNumber;
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getPopularMoviesSortedMoviesByPageNumber(attr,order,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                            console.log(url);
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                                console.log(url);
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                                console.log(url);
                            }
                            else {
                                return getPopularMoviesByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            function getTrendingMoviesOfThisYear() {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
                            "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=" +
                            "false&page=1&primary_release_year=2017";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getTrendingMoviesOfThisYearByPageNumber(pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
                            "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=" +
                            "false&page=" + pageNumber + "&primary_release_year=2017";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
            
            // function getMoviesBySearch(query) {
            //     var url = "https://api.themoviedb.org/3/search/movie?api_key="+API_KEY+
            //                 "&language=en-US&query="+query+"&page=1&include_adult=false";
            //     return $http
            //         .get(url)
            //         .then(function (response) {
            //             return response.data;
            //         });
            // }
            //
            function getMoviesBySearchByPageNumber(query,pageNumber) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        var url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY +
                            "&language=en-US&query=" + query + "&page=" + pageNumber + "&include_adult=false";
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }

            function getMoviesSortedMoviesByPageNumber(attr,order,pageNumber,query) {
                var API_KEY='';
                var url = "/api/project/getTmdbKey";
                return $http.get(url)
                    .then(function (response) {
                        API_KEY = this.API_KEY = response.data;
                        if (attr && order) {
                            var url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY +
                                "&language=en-US&include_adult=false&sort_by=" + attr + "." + order + "&page=" + pageNumber;
                            console.log(url);
                        }
                        else {
                            if (attr) {
                                url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + attr + "&page=" + pageNumber;
                                console.log(url);
                            }
                            else if (order) {
                                url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY +
                                    "&language=en-US&include_adult=false&sort_by=" + order + "&page=" + pageNumber;
                                console.log(url);
                            }
                            else {
                                return getMoviesBySearchByPageNumber(pageNumber);
                            }
                        }
                        return $http
                            .get(url)
                            .then(function (response) {
                                return response.data;
                            });
                    });
            }
        }
    }

)();