import { SET_DARK_MODE } from '../actions';

function darkMode(state = localStorage.getItem('darkMode') || false, action) {
  switch (action.type) {
    case SET_DARK_MODE:
      if (action.darkMode === true) {
        localStorage.setItem('darkMode', 'true');
        document.querySelector('link').href =
          'https://bootswatch.com/5/darkly/bootstrap.min.css';
        if (!document.body.classList.contains('dark')) {
          document.body.classList.add('dark');
        }
      } else {
        localStorage.removeItem('darkMode');
        document.querySelector('link').href =
          'https://unpkg.com/bootstrap@5.0.2/dist/css/bootstrap.min.css';
        if (document.body.classList.contains('dark')) {
          document.body.classList.remove('dark');
        }
      }
      return action.darkMode;
    default:
      return state;
  }
}

export default darkMode;
