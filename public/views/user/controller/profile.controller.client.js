(function () {
    
    angular.module("WDP").controller('profileCtrl',profileCtrl);
    
    function profileCtrl(UserService,isLoggedIn,$location,$route) {

        var model = this;
        model.deleteMovie = deleteMovie;
        model.deleteLikedMovie = deleteLikedMovie;
        model.user=model.isLoggedIn=isLoggedIn;
        model.profilePic='';
        model.logout = logout;
        model.curUrl = $location.path();
        model.deleteUser=deleteUser;
        model.updateUser=updateUser;
        model.unfollow=unfollow;
        model.viewPerson=viewPerson;
        model.gotoFollowingPerson=gotoFollowingPerson;
        model.gotoFollower=gotoFollower;
        model.username=model.user.username;
        model.email=model.user.email;
        model.firstName=model.user.firstName;
        model.lastName=model.user.lastName;
        model.checkPassword=checkPassword;
        model.changePassword=changePassword;
        model.searchMovie = searchMovie;
        model.editReview = editReview;
        model.deleteReview = deleteReview;
        model.submitReview = submitReview;
        model.cancel = cancel;
        model.selectReview = selectReview;

        function init() {
            model.userId = isLoggedIn._id;

            UserService
                .getUserReviews(model.userId)
                .then(function (userreviews) {
                    model.userreviews = userreviews;
                });

            UserService
                .getMoviesFromWatchList(model.userId)
                .then(function (movies) {
                    if(movies.length>0)
                        model.movies = movies;
                });

            UserService
                .getLikedMovies(model.userId)
                .then(function (likedmovies) {
                    if(likedmovies.length>0)
                        model.likedmovies = likedmovies;
                });

                UserService
                    .getFollowings(model.userId)
                    .then(function (following) {
                        return  model.following=model.user.following=following;
                    });


                UserService
                    .getFollowers(model.userId)
                    .then(function (followers) {
                        return  model.followers=model.user.followers=followers;
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

        function deleteUser(user) {
            UserService
                .unregisterUser(user)
                .then(function (response) {
                    $location.url('/login');
                },function (err) {
                    console.log(err);
                });
        }
        function updateUser() {
            UserService
                .updateUser(model.user._id,model.user)
                .then(function (status) {
                    model.updateSuccess='Profile Updated';
                });
        }

        function deleteMovie(movieId) {
            UserService
                .deleteMovie(movieId,model.userId)
                .then(function (response) {
                    for(var i in model.movies){
                        var movie = model.movies[i];
                        if(movieId === movie.id){
                            return model.movies.splice(i,1);
                        }
                    }
                    // $location.url('/user/watchlist');
                });
        }

        function deleteLikedMovie(movieId) {
            UserService
                .unlikeMovie(movieId,model.userId)
                .then(function (response) {
                    // console.log(response);
                    for(var i in model.likedmovies){
                        var movie = model.likedmovies[i];
                        if(movieId === movie.id){
                            return model.likedmovies.splice(i,1);
                        }
                    }




                    // UserService
                    //     .getLikedMovies(model.userId)
                    //     .then(function (movies) {
                    //         if(movies.length>0)
                    //             model.movies = movies;
                    //     });
                    // $location.url('/user/watchlist');
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

        function viewPerson(id) {
            model.watchingProfile = id;
        }

        function gotoFollowingPerson(personId) {
            for(var i in model.following){
                var person=model.following[i];
                if(personId === person._id){
                    model.person = person;
                    $location.url('/user/view_person/'+personId);
                }
            }
        }

        function gotoFollower(personId) {
            for(var i in model.followers){
                var person=model.followers[i];
                if(personId === person._id){
                    model.person = person;
                    $location.url('/user/view_person/'+personId);
                }
            }
        }

        function checkPassword() {

                return model.pwdMismatch='';
        }

        function changePassword(newPwd,oldPwd) {
            if(newPwd !== model.confirmPwd){
                return model.pwdMismatch=true;
            }
            UserService
                .changePassword(model.user._id,newPwd,oldPwd)
                .then(function (response) {

                    if(response ==='OK'){
                        model.pwdUpdateSuccess='Password Updated';
                    }
                    else{
                        model.pwdUpdateFailure=response;
                    }

                });
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
                                        .getUserReviews(userId)
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
            var review = {
                rating:rating,
                text:text
            };
            UserService
                .editReview(reviewId, review)
                .then(function (response) {
                    for(m in model.userreviews){
                        if(model.userreviews[m]._id === reviewId){
                            model.userreviews[m].text= typeof review.text==='undefined' ? model.userreviews[m].text :text ;
                            model.userreviews[m].rating=typeof review.rating==='undefined'?model.userreviews[m].rating :rating ;
                            break;
                        }
                    }
                    model.selectedId = false;
                })
        }

        function deleteReview(userId,reviewId) {
            UserService
                .deleteReview(userId,reviewId)
                .then(function (response) {
                    UserService
                        .getUserReviews(userId)
                        .then(function (reviews) {
                            model.userreviews = reviews;
                        });
                })
        }
    }
})();