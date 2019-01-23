import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/messaging';
import { askForPermissionToReceiveNotifications } from './messaging';

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
const messaging =firebase.messaging();
messaging.usePublicVapidKey('BCjOUZ6cEDitD1YFIzClutbrVFHA3yoUs-PfTIgRGizuhw0timaF2_XyHPcyIdaJ0BxRYAqRW8i5IV0yp_Pgg08');
messaging.onMessage(payload => {
    console.log(payload);
    const img = 'share.png'
    new Notification(payload.notification.title, {body: payload.notification.body, icon: img});
});
console.log(messaging);
const storageRef = firebase
    .storage()
    .ref();
const storage = firebase.storage;
askForPermissionToReceiveNotifications();
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

export {auth, storage, storageRef, db, firebase, messaging};