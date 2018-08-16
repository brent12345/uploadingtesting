import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCTn5sHXhsegbys_KBmj4L8gn4Lc0YGOBU",
  authDomain: "uploadimages-4132e.firebaseapp.com",
  databaseURL: "https://uploadimages-4132e.firebaseio.com",
  projectId: "uploadimages-4132e",
  storageBucket: "uploadimages-4132e.appspot.com",
  messagingSenderId: "1034416164692"
};
  const firebaseApp = firebase.initializeApp(config)
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })
  export default firebaseApp.firestore()
