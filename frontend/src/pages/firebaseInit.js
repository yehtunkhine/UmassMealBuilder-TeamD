import { initializeApp } from 'firebase/app';

//This is so we can initialize it in one place since, it was giving errors initializing it on both Login & Signup

const firebaseConfig = {
    apiKey: "AIzaSyBIQMdCZU3XRcV0GhvD2N90bTgTZr9sxrk",
    authDomain: "umassmealbuilder-d9713.firebaseapp.com",
    projectId: "umassmealbuilder-d9713",
    storageBucket: "umassmealbuilder-d9713.appspot.com",
    messagingSenderId: "244857604224",
    appId: "1:244857604224:web:8ba3536d6ad5bb5dbf3e65",
    measurementId: "G-K58XKBTEEZ"
  };

const firebaseInit = () => {
  /*if(!firebase.app.length){*/
  const retVal = initializeApp(firebaseConfig);
  /*}else{
    const retVal = firebase.app();
    console.log("Hi");
  }*/
  return retVal;
};

export default firebaseInit;