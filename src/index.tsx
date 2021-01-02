import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, loadTheme, registerIcons } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter} from 'react-router-dom';
import firebase from 'firebase';

loadTheme(createTheme({
  defaultFontStyle: { fontFamily: 'Noto Sans JP' }
}));

registerIcons({
  icons: {
    Filter: <FontAwesomeIcon icon={faFilter} />
  }
});

const config = {
  apiKey: 'AIzaSyA9DIRZ35ZC6p1LjwNvbdcwCNrJmH2H7t0',
  authDomain: 'sentence-challenge.firebaseapp.com',
  projectId: 'sentence-challenge'
};
firebase.initializeApp(config);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
