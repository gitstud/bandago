import firebase from 'firebase'

const dev = {
  apiKey: "AIzaSyBGe7Rh2uSSprfH4gpxatnxJ506uUoZE7A",
  authDomain: "bandago-feb68.firebaseapp.com",
  databaseURL: "https://bandago-feb68.firebaseio.com",
  projectId: "bandago-feb68",
  storageBucket: "gs://bandago-feb68.appspot.com/",
  messagingSenderId: "282622185358",
}

const prod = {
  apiKey: "AIzaSyBGe7Rh2uSSprfH4gpxatnxJ506uUoZE7A",
  authDomain: "bandago-feb68.firebaseapp.com",
  databaseURL: "https://bandago-feb68.firebaseio.com",
  projectId: "bandago-feb68",
  storageBucket: "gs://bandago-feb68.appspot.com/",
  messagingSenderId: "282622185358",
}

// firebase.initializeApp(process.env.NODE_ENV === 'production' ? prod : dev);
firebase.initializeApp(dev);

// prototype function for uploading multiple file at once.
// firebase.storage().ref().constructor.prototype.putFiles = function(files) {
//   var ref = this;
//   return Promise.all(files.map(function(file) {
//     return ref.child(file.name).put(file);
//   }));
// }

export default firebase;
