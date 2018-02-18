# File Structure
* public/config.js
  *  configures the angular application routing and used the routing provider to map the routerLink to the components.
* public/services ( Each service provides CRUD operations to manipulate the corresponding entity: create, read, update, and delete.)
  * movie.service.client.js
    * This angular service will send asynchronous HTTP requests using Angular Http service to the TMDB Web Service to fetch movies and           related information.
  * news.service.client.js
    * This angular service will send asynchronous HTTP requests using Angular Http service to the theGuardian Web Service to fetch news         related to the movies.
  * user.service.client.js
    * This angular service will send asynchronous HTTP requests to fetch users from the user model.
* server.js
  * imports libraries used for session management, JSON parsing etc and hosts the website.
* model
  * review.model.server.js/ user.model.server.js
    * contains the schema and the functions used to do CRUD operations on the data.
* public/views
  * contains each component which is treated as a mini Angular app
  * The components folder contains the actual sections for my Angular app. These will be the static views ,directives and services for         that specific section of the site (think an admin users section, gallery creation section, etc). 
  * Each page has it's own subfolder with it's own controller, services, and HTML files.
  * Each component here resembles a mini-MVC application by having a view, controller and potentially services file(s).
* index.html
  * The index.html file primarily handles loading in all the libraries and Angular elements.
