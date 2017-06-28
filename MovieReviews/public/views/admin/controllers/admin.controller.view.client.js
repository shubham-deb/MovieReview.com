(function () {

    angular.module('WDP').controller('adminDashboardCtrl',adminDashboardCtrl)


    function adminDashboardCtrl(UserService,MovieService,isLoggedIn,$routeParams,$location) {

        var model = this;
        model.user = model.isLoggedIn=isLoggedIn;
        model.register = register;
        model.deleteReview = deleteReview;
        model.registereduser = $routeParams.userId;
        model.editReview = editReview;
        model.deleteUser = deleteUser;
        model.submitReview = submitReview;
        model.cancel = cancel;
        model.selectReview = selectReview;
        model.user = model.isLoggedIn = isLoggedIn;
        model.deleteMovieFromWatchlist = deleteMovieFromWatchlist;
        model.deleteLikedMovie =  deleteLikedMovie;
        model.unfollow=unfollow;
        model.findUserById = findUserById;
        model.logout=logout;
        model.checkPassword = checkPassword;

        function init() {
            //    get all users
            getAllUsers();
            getAllReviews();

            if(model.registereduser){
                UserService
                    .getUserReviews(model.registereduser)
                    .then(function (userreviews) {
                        model.userreviews = userreviews;
                    });

                UserService
                    .getLikedMovies(model.registereduser)
                    .then(function (likedmovies) {
                        if(likedmovies.length>0)
                            model.likedmovies = likedmovies;
                    });

                UserService
                    .getFollowings(model.registereduser)
                    .then(function (following) {
                        return  model.editUser.following=following;
                    });

                UserService
                    .findUserById(model.registereduser)
                    .then(function (user) {
                        model.editUser = user;
                    });

                UserService
                    .getFollowers(model.registereduser)
                    .then(function (followers) {
                        return  model.editUser.followers=followers;
                    });

                UserService
                    .getMoviesFromWatchList(model.registereduser)
                    .then(function (movies) {
                        if(movies.length>0)
                            model.movies = movies;
                    });

                UserService
                    .getLikedMovies(model.registereduser)
                    .then(function (likedmovies) {
                        if(likedmovies.length>0)
                            model.likedmovies = likedmovies;
                    });
            }


        }init();

        function findUserById() {
            UserService
                .findUserById(model.registereduser)
                .then(function (user) {
                    model.editUser = user;
                })
        }

        function unfollow(followeeId) {
            var followerId= model.registereduser;
            UserService.unfollow(followeeId,followerId).then(function () {

                for(var i in model.editUser.following){
                    var following = model.editUser.following[i];
                    if(following._id===followeeId){
                        return model.editUser.following.splice(i,1);
                    }
                }
            })
        }

        function deleteMovieFromWatchlist(movieId) {
            UserService
                .deleteMovie(movieId,model.registereduser)
                .then(function (response) {
                    UserService
                        .getMoviesFromWatchList(model.registereduser)
                        .then(function (movies) {
                            if(movies.length>0)
                                model.movies = movies;
                        });
                    // $location.url('/user/watchlist');
                });
        }

        function deleteLikedMovie(movieId) {
            UserService
                .unlikeMovie(movieId,model.registereduser)
                .then(function (response) {
                    // console.log(response);
                    UserService
                        .getLikedMovies(model.registereduser)
                        .then(function (movies) {
                            if(movies.length>0)
                                model.likedmovies = movies;
                        });
                    // $location.url('/user/watchlist');
                });
        }
        
        function register(username,roles,firstname,lastname,email,password,verifyPassword) {

            if(password!==verifyPassword ){
                model.pwdMismatch="Password doesnot match";
                return;
            }

            UserService
                .findUserByUsername(username)
                .then(function (found) {
                    if(found){
                        model.error = "Username already exists";
                    }
                    else{
                        model.error = false;
                        var user = {
                            username:username,
                            role:roles,
                            firstName:firstname,
                            lastName:lastname,
                            password:password,
                            email:email
                        };
                        model.username = "";
                        model.roles = "";
                        model.firstName = "";
                        model.lastname = "";
                        model.rpwd = "";
                        model.rvpwd = "";
                        model.email="";
                        UserService
                            .createUser(user)
                            .then(function () {
                                model.successMessage='New User Created';
                                getAllUsers();
                            });
                    }
                });
        }

        function checkPassword() {
            if(model.rvpwd === model.rpwd){
                model.pwdMismatch='';
            }
        }

        function getAllUsers() {
            UserService
                .getAllUsers()
                .then(function (users) {
                    var results = [];
                    for(u in users){
                        if(users[u]._id != isLoggedIn._id)
                            results.push(users[u]);
                    }
                    model.users = results;
                    // model.users=users;
                },function (err) {
                    console.log(err);
                });
        }

        function submitReview(rating,userreview) {

            if (!model.user._id) {
                $location.url('/login');
            }
            else {
                if (rating === undefined && userreview === undefined) {
                    model.error = "Please enter either a review or a rating";
                }
                else {
                    MovieService
                        .getMovie(model.movieId)
                        .then(function (movie) {
                            UserService
                                .submitReview(isLoggedIn._id, model.movieId, rating,
                                    userreview, isLoggedIn.username,movie.title)
                                .then(function (response) {
                                    console.log(response);
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

        function selectReview(reveiewId,text,rating) {
            model.selectedId = reveiewId;
            model.text2 = text;
            model.rating = rating;
        }

        function editReview(reviewId,review) {
            UserService
                .editReview(reviewId, review)
                .then(function (response) {
                    getAllReviews();
                })
        }
        
        function deleteReview(userId,reviewId) {
            UserService
                .deleteReview(userId,reviewId)
                .then(function (response) {
                    getAllReviews();
                })
        }

        function getAllReviews() {
            UserService
                .getAllReviews()
                .then(function (reviews) {
                    model.reviews = reviews;
                });
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(function (response) {
                    UserService
                        .deleteUserReviews(userId)
                        .then(function (response) {
                            getAllUsers();
                            getAllReviews();
                        },function (err) {
                            console.log(err);
                        });
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/login');
                });
        }

    }
})();