(function () {
    angular.module("WDP").service('NewsService',NewsService);

    function NewsService($http) {

        this.getTopNews = getTopNews;
        this.getLatestReviews=getLatestReviews;
        this.getTalkingPoints=getTalkingPoints;
        // this.getNewsApiKey= getNewsApiKey;
        this.API_KEY='';

        //
        // function init() {
        //     //api/project/getNewsApiKey
        //     var url = "/api/project/getNewsApiKey";
        //     return $http.get(url)
        //         .then(function (response) {
        //             API_KEY=this.API_KEY = response.data;
        //         })
        // }init();


        function getTopNews() {

            var API_KEY='';
            var url = "/api/project/getNewsApiKey";
             return $http.get(url)
                .then(function (response) {
                    API_KEY=this.API_KEY = response.data;
                    url ='https://content.guardianapis.com/search?&format=json&tag=film/film,tone/news&show-fields=trailText,byline,thumbnail,shortUrl&from-date=2017-06-01&&order-by=newest&api-key='+API_KEY;
                    return $http
                        .get(url)
                        .then(function (response) {
                            return response.data.response.results;
                        })
                })


        }

        function getLatestReviews() {


            var url = "/api/project/getNewsApiKey";
          return $http.get(url)
                .then(function (response) {
                    this.API_KEY =response.data;
                    url ='https://content.guardianapis.com/search?&format=json&tag=film/film,tone/reviews&show-fields=trailText,byline,thumbnail,shortUrl,starRating,publication&from-date=2017-06-01&&order-by=newest&api-key='+this.API_KEY;

                  return  $http
                        .get(url)
                        .then(function (response) {
                            return response.data.response.results;
                        })
                });


        }

        function getTalkingPoints() {
            var API_KEY='';
            var url = "/api/project/getNewsApiKey";
             return $http.get(url)
                .then(function (response) {
                    API_KEY=this.API_KEY = response.data;

                    url ='https://content.guardianapis.com/search?&format=json&tag=film/filmblog&show-fields=all&from-date=2017-06-01&&order-by=newest&api-key='+API_KEY;

                    return $http
                        .get(url)
                        .then(function (response) {
                            return response.data.response.results;
                        })

                })

        }


    }
})();