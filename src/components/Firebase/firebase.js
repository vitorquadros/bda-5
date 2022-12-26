import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
// import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
    this.auth = getAuth();
    this.isLogged = false;
    this.credentials = null;
  }

  // *** AUTH API ***
  async doCreateUserWithEmailAndPassword(email, password) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);

      await set(ref(this.db, 'users/' + this.auth.currentUser.uid), {
        email: email,
        admin: true
      });
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async doSignInWithEmailAndPassword(email, password) {
    try {
      this.credentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      this.credentials ? (this.isLogged = true) : (this.isLogged = false);
      return this.credentials.user ?? null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  doSignOut = async () => {
    try {
      await signOut(this.auth);
      this.isLogged = false;
      console.log('deslogado');
    } catch (e) {
      console.error(e);
    }
  };
}

export default Firebase;
