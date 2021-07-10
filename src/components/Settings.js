import React from 'react';
import {
  Form,
  FormLabel,
  FormGroup,
  Dropdown,
  DropdownButton,
  FormCheck
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, setLanguage } from '../actions';
import { Link } from 'react-router-dom';
import LOCALES from '../data/localization';

if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'English');
}

function Settings() {
  const language = useSelector((state) => state.language);
  const darkMode = useSelector((state) => state.darkMode);

  const dispatch = useDispatch();

  return (
    <div id='settings'>
      <Link to='/'>← Return to home</Link>
      <Form className='position-absolute top-50 start-50' data-aos='fade-up'>
        <FormGroup>
          <FormLabel>Language: </FormLabel>{' '}
          <DropdownButton title={language}>
            {Object.values(LOCALES.languageNames.English).map((lang, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => dispatch(setLanguage(lang))}
              >
                {lang}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </FormGroup>
        <br />
        <FormGroup>
          <FormCheck
            onClick={(event) => dispatch(setDarkMode(event.target.checked))}
            label='Dark mode'
            defaultChecked={darkMode}
          />
        </FormGroup>
      </Form>
    </div>
  );
}

export default Settings;
