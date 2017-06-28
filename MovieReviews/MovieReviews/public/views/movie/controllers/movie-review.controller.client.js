
(function () {
    angular
        .module("WDP")
        .controller('movieReviewCtrl',movieReviewCtrl);

    function movieReviewCtrl(MovieService,$location,$routeParams,$sce,isLoggedIn,UserService,$route) {
        var model = this;
        model.movieId = $routeParams.movieId;
        model.getEmbedURL = getEmbedURL;
        model.getActorInfo = getActorInfo;
        model.submitReview = submitReview;
        model.user=model.isLoggedIn=isLoggedIn;
        model.userId = isLoggedIn._id;
        model.editReview = editReview;
        model.deleteReview = deleteReview;
        model.selectReview = selectReview;
        model.cancel = cancel;
       model.addFollowing=addFollowing;
       model.unfollow=unfollow;
       model.searchMovie= searchMovie;

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
        // var configUrl = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://api.themoviedb.org/3/configuration?api_key="+API_KEY,
        //     "method": "GET",
        //     "headers": {},
        //     "data": "{}"
        // };
        // //
        // var moviedata = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+API_KEY+"&language=en-US",
        //     "method": "GET",
        //     "headers": {},
        //     "data": "{}"
        // };
        // //
        // var videoUrl = {
        //     "method": "GET",
        //     "url": "https://api.themoviedb.org/3/movie/"+movieId+"/videos?api_key="+API_KEY+"&language=en-US",
        //     "headers": {},
        //     "data": "{}"
        // };
        // var creditUrl = {
        //     "method": "GET",
        //     "url": "https://api.themoviedb.org/3/movie/"+movieId+"/credits?api_key="+API_KEY,
        //     "headers": {},
        //     "data": "{}"
        // };
        // var reviewUrl = {
        //     "method": "GET",
        //     "url": "https://api.themoviedb.org/3/movie/"+movieId+"/reviews?page=1&language=en-US&api_key="+API_KEY,
        //     "headers": {},
        //     "data": "{}"
        // };

        function init() {
            model.editing = false;

            MovieService
                .getVideo(model.movieId )
                .then(function (video) {
                    model.youtubeurl = getEmbedURL("https://youtu.be/"+video.results[0].key);
                });

            UserService
                .getAllReviews()
                .then(function (reviews) {
                    model.userreviews = reviews;
                });

            MovieService
                .getReviewsByMovieId(model.movieId)
                .then(function (response) {
                   model.reviews = response.results;
                });

            MovieService
                .getConfig()
                .then(function (configs) {
                        var baseURL = configs.images.secure_base_url+"";
                        var size = configs.images.profile_sizes[2];
                        var poster_config_path = baseURL + size;
                    MovieService
                        .getCredits(model.movieId )
                        .then(function (credits) {
                            var directors=[];
                            var writers = [];
                            var actors = [];
                            for(a in credits.cast){
                                if(actors.length>15)
                                    break;
                                else{
                                    credits.cast[a].profile_path = poster_config_path + credits.cast[a].profile_path;
                                    // console.log(getActorInfo(credits.cast[a].id));
                                    // console.log(credits.cast[a].order);
                                    // MovieService
                                    //     .getActorInfo(credits.cast[a].id)
                                    //     .then(function (response) {
                                    //         credits.cast[a].order = response.biography;
                                    //     });
                                    actors.push(credits.cast[a]);
                                }
                            }
                            for(c in credits.crew){
                                if(directors.length <3) {
                                    if (credits.crew[c].department === "Directing") {
                                        directors.push(credits.crew[c].name);
                                    }
                                }
                                if(writers.length<3) {
                                    if (credits.crew[c].department === "Writing") {
                                        writers.push(credits.crew[c].name);
                                    }
                                }
                                if(directors.length>=3 && writers.length>=3)
                                    break;
                            }
                            model.directors = directors;
                            model.actors = actors;
                            model.writers = writers;
                        });

                        MovieService
                            .getMovie(model.movieId )
                            .then(function (response) {
                                        model.movie = response;
                                        MovieService
                                            .getReviewsByMovieName(model.movie.title)
                                            .then(function (response) {
                                                model.crticreviews = response.results;
                                            });
                                        model.poster_path = poster_config_path + response.backdrop_path;
                                        model.title = response.original_title;
                                        arr = response.release_date.split("-");
                                        model.releaseyear = arr[0];
                                        model.releasedate = response.release_date;
                                        model.hour = parseInt(response.runtime/60);
                                        model.minutes = response.runtime - 60*model.hour;
                                        model.genres = response.genres;
                                        model.overview = response.overview;
                                        model.averagevote = response.vote_average;
                                        model.votes = response.vote_count;
                                        model.homepage = response.homepage;
                                        model.countries = response.production_countries;
                                        model.languages = response.spoken_languages;
                                        model.status = response.status;
                                        model.companies = response.production_companies;
                                        model.budget = moneyFormat(response.budget,'$');
                                        model.gross = moneyFormat(response.revenue,'$');
                                        model.tagline = response.tagline;
                            });

                    MovieService
                        .getSimilarMovies(model.movieId )
                        .then(function (movies) {
                            var movs = [];
                            for(m in movies.results){
                                if(movs.length>8)
                                    break;
                                var similarmoviepath = poster_config_path + movies.results[m].poster_path;
                                movies.results[m].poster_path = similarmoviepath;
                                movs.push(movies.results[m]);
                            }
                            model.similarmovies = movs;
                        });
                });
        }

        init();

        function moneyFormat(price, sign) {
            const pieces = parseFloat(price).toFixed(2).split('');
            var ii = pieces.length - 3;
            while ((ii-=3) > 0) {
                pieces.splice(ii, 0, ',')
            }
            return sign + pieces.join('')
        }

        function getActorInfo(actorId) {
            MovieService
                .getActorInfo(actorId)
                .then(function (actor) {
                    return actor.biography;
                });
        }

        function getEmbedURL(embedURL) {
            //var embedURL = "https://youtu.be/AM2Ivdi9c4E";
            var urlParts = embedURL.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);
        }

        function submitReview(rating,userreview) {

            if (!model.user._id) {
                $location.url('/login');
            }
            else {
                if (rating === undefined || userreview === undefined) {
                    model.error = "Please enter  a review and a rating";
                }
                else {
                    model.error='';
                    MovieService
                        .getMovie(model.movieId)
                        .then(function (movie) {
                            UserService
                                .submitReview(isLoggedIn._id, model.movieId, rating,
                                                userreview, isLoggedIn.username,movie.title)
                                .then(function (response) {
                                    model.rating2 = "";
                                    model.userreview = "";
                                    UserService
                                        .getAllReviews()
                                        .then(function (reviews) {
                                            model.userreviews = reviews;
                                        });
                                }, function (err) {
                                    console.log(err);
                                });
                        });
                }
            }
        }


        function cancel() {
            model.selectedId = false;
        }

        function selectReview(reveiewId,text) {
            model.selectedId = reveiewId;
            model.text2 = text;
        }

        function editReview(reviewId,rating,text) {

            if(typeof rating==='undefined' && typeof text === 'undefined'){
                model.updateError='Enter rating and review';
                return ;
            }

            var review = {
                rating:rating,
                text:text
            };
            UserService
                .editReview(reviewId, review)
                .then(function (response) {
                    for(var i in model.userreviews){
                        if(reviewId === model.userreviews[i]._id){
                            var index = i;
                        }
                    }
                    model.userreviews[index].text= typeof review.text==='undefined' ? model.userreviews[index].text :review.text ;
                    model.userreviews[index].rating=typeof review.rating==='undefined'? model.userreviews[index].rating :review.rating ;

                    model.selectedId = false;
                })
        }

        function deleteReview(userId,reviewId) {
            UserService
                .deleteReview(userId,reviewId)
                .then(function (response) {
                    UserService
                        .getAllReviews()
                        .then(function (reviews) {
                            model.userreviews = reviews;
                        });
                })
        }


        function addFollowing(followeeId) {
            var followerId= model.user._id;
            UserService.addFollowing(followerId,followeeId).then(function () {
              return  model.user.following.push(followeeId);
            })
        }

        function unfollow(followeeId) {
            var followerId= model.user._id;
            UserService.unfollow(followeeId,followerId).then(function () {
               var i = model.user.following.indexOf(followeeId);
                return  model.user.following.splice(i,1);
            })
        }




        //     UserService
        //         .checkLoggedIn()
        //         .then(function (user) {
        //             if(user === "0"){
        //                 $location.url('/login');
        //             }
        //             else{
        //                 UserService
        //                     .submitReview(isLoggedIn._id,model.movieId,rating,review)
        //                     .then(function (response) {
        //                         console.log(response);
        //                     },function (err) {
        //                         console.log(err);
        //                     });
        //             }
        //         })
        // }
    }

})();