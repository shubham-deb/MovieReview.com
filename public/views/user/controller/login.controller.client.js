(
    function () {

        angular.module("WDP").controller('loginCtrl',loginCtrl);

        function loginCtrl(UserService,$location) {
            
            var model = this;
            //model.isLoggedIn=isLoggedIn;
            model.login=login;
            model.register = register;
            model.changeTab= changeTab;
            model.checkPassword=checkPassword;
            model.searchMovie = searchMovie;
            // model.currentTab='register';
            model.loginErrors={

            };
            model.registerErrors={

            }
            ;
            function searchMovie(query) {
                $location.url('/movie/search/'+query);
            }
            // function init() {
            //     model.currentTab='login';
            // }init();

            function changeTab(tab) {
               if(tab==='login'){
                   model.registerErrors={};
               }
               else{
                   model.loginErrors={};
               }
                console.log(model.currentTab);
            }

            function login(uname,pwd){

                //var found = UserService.findUserByCredentials(uname,pwd);
                //UserService.findUserByCredentials(uname,pwd)
                UserService.login(uname,pwd)
                    .then(function (found) {
                        if(found!==null){

                            if(found.role.indexOf('admin')!==-1){
                                $location.url('admin/dashboard');
                            }else{
                                $location.url('/profile');
                            }

                        }
                        else{
                            model.loginErrors.notFound='User not found';
                        }
                    },function (err) {
                        model.loginErrors.notFound="User Not Found"
                    });


            }

            function checkPassword() {
                if(model.rvpwd === model.rpwd){
                    model.pwdMismatch='';
                }
            }


            function register(username,email,password,verifyPassword){

                if(password === null || typeof password==='undefined'||
                    verifyPassword === null || typeof verifyPassword==='undefined'
                    || username === null || typeof username==='undefined'){
                    model.error="All fields are required";
                    return;
                }
                if(password!==verifyPassword ){
                    model.pwdMismatch="Password doesnot match";
                    return;
                }

                UserService.findUserByUsername(username)
                    .then(
                        function (user) {
                            if(user)
                            {
                                model.registerErrors.usernameTaken = "sorry, username already taken.";
                            }
                            else{
                                var newUser={
                                    username:username,
                                    password: password,
                                    email:email,
                                    role:'user'
                                };
                                return UserService
                                    .register(newUser)
                                    .then(function (user) {
                                        $location.url("/home")
                                    });
                            }

                        },
                        function(){
                        })



            }
        }   
    }
)();