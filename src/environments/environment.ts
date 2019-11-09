// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBlac9jbFtM5Q9i8ZL8lmVeuXlFdHJHaqU',
    authDomain: 'db-diary.firebaseapp.com',
    databaseURL: 'https://db-diary.firebaseio.com',
    projectId: 'db-diary',
    storageBucket: 'db-diary.appspot.com',
    messagingSenderId: '277213429743'
  },
  theMovieDB: {
    apiKey: 'fe1a1a777485b3e314f16af8e051dfb4',
    authDomain: 'api.themoviedb.org',
    databaseURL: 'https://api.themoviedb.org/3',
    imageDatabaseURL: 'https://image.tmdb.org/t/p/w500',
    username: 'n4t1',
    password: 'Tygrysek11',
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
