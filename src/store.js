import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
//reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';


const firebaseConfig = {
    apiKey: "AIzaSyD4Dk3SQOz-9M9UcNuRdOnYo8gzkZ82gYs",
    authDomain: "reactclientpanel-71e6b.firebaseapp.com",
    databaseURL: "https://reactclientpanel-71e6b.firebaseio.com",
    projectId: "reactclientpanel-71e6b",
    storageBucket: "reactclientpanel-71e6b.appspot.com",
    messagingSenderId: "98485144800"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

//init firebase instance
firebase.initializeApp(firebaseConfig);
//init firestore
const firestore  = firebase.firestore();
const settings = {timestampsInSnapshots: true};
  firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore)

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,// <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
});

//check for settings in Local Storage
if(localStorage.getItem('settings') == null) {
  //default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  }

  //set to LS
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

// Create store with reducers and initial state
const initialState = {settings: JSON.parse(localStorage.getItem('settings'))};
const store = createStoreWithFirebase(rootReducer, initialState, compose(
  reactReduxFirebase(firebase),
  window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;
