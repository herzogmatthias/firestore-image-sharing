import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyA9oGOi_p2_fdIsxGZHCCI71PICZLujdpI",
    authDomain: "firestore-image-sharing.firebaseapp.com",
    databaseURL: "https://firestore-image-sharing.firebaseio.com",
    projectId: "firestore-image-sharing",
    storageBucket: "firestore-image-sharing.appspot.com",
    messagingSenderId: "700020809428"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const storageRef = firebase
    .storage()
    .ref();
const storage = firebase.storage;
const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
})

export function uploadImg(img) {
    var uploadTask = storageRef
        .child('images/' + img.name)
        .put(img);
    return uploadTask;
}

export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can
    // provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/home',
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
};

export {auth, storage, storageRef, db, firebase};