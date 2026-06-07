# DEvTinder
-created a vite + react project and named it devTinder-web
-removed unnecessary files and code from the project

- for css we will use daisyUI and tailwind css
- installed daisyUI and tailwind css in the project
- created a simple UI for the home page using daisyUI and tailwind css
-installed dasiy ui and then added navbar
-created a navbar seprate component and imported it in the App.jsx file

-install reat router dom and created a simple routing for the home page and about page- it can be creating on thr root level 
-created a login page and added a route for it in the App.jsx file
-created a footer 
- outlet component is used to render the child components in the parent component

-create  login page 
- create axios instance and added the base url and with credentials to it
-created a login function and called the axios instance to make a post request to the backend server
- install cors 
- cors - install in the backend server and added the cors middleware to it
- added the origin and credentials to the cors middleware
- whenever making an api call from the frontend to the backend server we need to add the with credentials to it in order to send the cookies to the backend server {withCredentials: true}


-now install redux -https://redux.js.org/tutorials/quick-start
- install redux toolkit - https://redux-toolkit.js.org/tutorials/quick-start
- create a user slice in the utils folder and added the user reducer to it
- create a app store and added the user reducer to it
- wrap the app component with the provider component and pass the app store to it

- created a login function in the login component and called the addUser action to add the user to the redux store
- created a feed component and added a route for it in the App.jsx file
- created a profile component and added a route for it in the App.jsx file
redux devtools
- navbar update - added links to the navbar and added a logout button to it
- created a logout function in the navbar component and called the removeUser action to remove the user
-refactored the code and removed unnecessary code from the project
- NavBar should update as soon as user logs in
- Refactor our code to add constants file + create a components folder
- You should not be access other routes without login
- If token is not present, redirect user to login page

-login and logout is done 