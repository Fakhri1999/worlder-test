# Brief explanation of the project

## Function/Feature list

1. On the first page, users can register using social logins (please choose Facebook, Google, or Apple). You do not need to connect to the actual social logins. You can save the credentials to local storage.
2. In addition, users can choose to use the traditional email and password login method.
3. After registration, users can log in using their newly created social login or email and password. The login session should be saved to the same local storage.
4. After login, users should be able to see popular movies, now playing, upcoming movies, and top-rated movies.
5. Users can also search for a movie using keywords.
6. Clicking on each movie should display information about the movie, such as release year, type, rating, synopsis, and cast. Be as comprehensive as possible.
7. Users can add movies to their favourite list (local storage) and view and edit (add or remove) items on their favourite list.
8. Use the TMDB API to get the necessary movie data. Please make sure you are using your own API key credentials.
9. Use your own creative style for the design and choice of interface components.
10. Optional: Users can play the trailer of the selected movie.

## Design Requirements:

1. Use ReactJS Framework & Typescript.
2. Ensure the web application achieves high performance by optimizing load times, enhancing rendering efficiency, and implementing best practices for responsive and smooth user experiences
3. Ensure responsive sizing to mobile devices.
4. The late Apple Co-founder Steve Jobs said, “A great carpenter isn’t going to use lousy wood for the back of a cabinet, even though nobody’s going to see it. " It is important that the web app not only looks beautiful to users but also runs on well-organized and efficient (looks beautiful to developers) code. For that, you must:
   a. Create reusable components.
   b. Create reusable hook components for the form input without using a library.
   c. Organise the component codes so that they are easy and intuitive to read.
5. Write clean, maintainable, and well-documented code.
6. Since there is no backend, keep all data in memory until the app closes. Note that registration information should be stored persistently across multiple sign-ins.
7. Create documentation using the Markup language.
8. Host the application on free hosting platforms (Netlify, Heroku, Firebase, or any other
   hosting platform)
9. If you can, please:
   a. Integrate with Firebase Firestore for signup and login with Firebase Social Login.
   b. Collect user event activity with Firebase Analytics.
   c. Host documentation, e.g., Doscify.
   d. Create unit tests for components (Jest, Enzyme, or others).
   e. Use internationalisation (i18n) (English or Bahasa Indonesia).
   f. Create dark and light modes.
   g. Convert a web app to a desktop application with Electron.js.

TODO:

- [x] Set up ReactJS with TypeScript project
- [x] Fetch and display popular, now playing, upcoming, and top-rated movies from TMDB API
- [x] Create movie detail page
- [ ] Implement movie search functionality
- [x] Implement firebase login and registration
- [x] Implement favourite movies list functionality and save to firebase
- [ ] Write documentation in Markup language
- [ ] Host the application on a free hosting platform
- [ ] (Optional) Create unit tests for components
- [ ] (Optional) Implement dark and light modes
- [ ] (Optional) Convert web app to desktop application with Electron.js
