import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAqKl0fExfZ3OXt78lVseJ2r-Q7TU2Bw2E",
    authDomain: "ccodes-test.firebaseapp.com",
    projectId: "ccodes-test",
    storageBucket: "ccodes-test.appspot.com",
    messagingSenderId: "840548160972",
    appId: "1:840548160972:web:406770c2595ba8272eb969",
    measurementId: "G-GWS9RZKDSC"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

export { auth, db };