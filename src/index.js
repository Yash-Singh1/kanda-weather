import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Settings from './components/Settings';
import './styles/index.css';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/settings' component={Settings} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
  () => {
    AOS.init();

    const link = document.createElement('link');
    link.rel = 'stylesheet';

    if (store.getState().darkMode) {
      link.href = 'https://bootswatch.com/5/darkly/bootstrap.min.css';
      document.body.classList.add('dark');
    } else
      link.href =
        'https://unpkg.com/bootstrap@5.0.2/dist/css/bootstrap.min.css';

    document.querySelector('link[rel="stylesheet"]').before(link);
  }
);
