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
import formatDate from '../helpers/formatDate';

if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'English');
}

function Settings() {
  const language = useSelector((state) => state.language);
  const darkMode = useSelector((state) => state.darkMode);
  const query = useSelector((state) => state.query);
  const date = useSelector((state) => state.date);

  const dispatch = useDispatch();

  return (
    <div id='settings'>
      <Link
        to={
          query === ''
            ? '/'
            : '/?q=' + encodeURIComponent(query) + '&date=' + formatDate(date)
        }
      >
        ← {LOCALES.returnToHome[language]}
      </Link>
      <Form className='position-absolute top-50 start-50' data-aos='fade-up'>
        <FormGroup>
          <FormLabel>{LOCALES.language[language]}: </FormLabel>{' '}
          <DropdownButton title={LOCALES.languageNames[language][language]}>
            {Object.entries(LOCALES.languageNames[language]).map(
              (lang, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => dispatch(setLanguage(lang[0]))}
                >
                  {lang[1]}
                </Dropdown.Item>
              )
            )}
          </DropdownButton>
        </FormGroup>
        <br />
        <FormGroup>
          <FormCheck
            onClick={(event) => dispatch(setDarkMode(event.target.checked))}
            label={LOCALES.darkMode[language]}
            defaultChecked={darkMode}
          />
        </FormGroup>
      </Form>
    </div>
  );
}

export default Settings;
