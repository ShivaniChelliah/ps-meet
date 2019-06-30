import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyC7zZUiPBnt6tK8kb28g_bsiT-bY5o7r8M",
    authDomain: "psmeet-7fce4.firebaseapp.com",
    databaseURL: "https://psmeet-7fce4.firebaseio.com",
    projectId: "psmeet-7fce4",
    storageBucket: "psmeet-7fce4.appspot.com",
    messagingSenderId: "126990712421",
    appId: "1:126990712421:web:4f2758205e0ce2be"
  };

  const fire=firebase.initializeApp(config);
  
  export const auth = firebase.auth();  //This exports the auth module of Firebase
  export default fire;