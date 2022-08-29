import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'

//redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// import { myReducer } from './reducers/red'

const root = ReactDOM.createRoot(document.getElementById('root'));
// let myStore = createStore(myReducer)

root.render(
  // <React.StrictMode>
    // <Provider store={myStore}>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
