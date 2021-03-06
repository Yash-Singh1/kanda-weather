import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, FormGroup, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import searchIcon from 'url:bootstrap-icons/icons/search.svg';
import gearIcon from 'url:bootstrap-icons/icons/gear-fill.svg';
import forecast from 'url:../forecast.txt';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Dashboard from './Dashboard';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { setTextData, setQuery } from '../actions';
import LOCALES from '../data/localization';
import QUERIES from '../data/queries';
import { useIsMounted } from 'react-tidy';

function App() {
  let [searchValue, setSearchValue] = useState([
    new URLSearchParams(location.search).get('q')
      ? decodeURIComponent(new URLSearchParams(location.search).get('q'))
      : ''
  ]);
  let [inputValue, setInputValue] = useState(searchValue[0]);

  const dispatch = useDispatch();

  const textData = useSelector((state) => state.textData);
  const date = useSelector((state) => state.date);
  const query = useSelector((state) => state.query);
  const language = useSelector((state) => state.language);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (
      query === '' &&
      new URLSearchParams(location.search).get('q') &&
      new URLSearchParams(location.search).get('q') !== '' &&
      isMounted()
    ) {
      location.search = '?date=' + formatDate(date);
    }
  }, [query]);

  if (!new URLSearchParams(location.search).get('q') && query) {
    window.history.pushState('', '', '?q=' + encodeURIComponent(query));
    setSearchValue([query]);
  }

  useEffect(() => {
    fetch(forecast)
      .then((response) => response.text())
      .then((text) => {
        if (isMounted())
          dispatch(setTextData(text.split('\n'.repeat(4)), 'text'));
      });
  }, []);

  function redirectSearch() {
    if (searchValue.length === 0 && inputValue === '') {
      if (!new URLSearchParams(location.search).get('q')) return;
      dispatch(setQuery(''));
    }
    if (searchValue[0] === new URLSearchParams(location.search).get('q'))
      return;
    location.search =
      '?q=' +
      encodeURIComponent(searchValue[0] || inputValue) +
      '&date=' +
      formatDate(date);
  }

  return (
    <>
      <Form inline>
        <FormGroup id='search-bar-group' className='text-nowrap'>
          <InputGroup>
            <Typeahead
              id='search-bar'
              options={
                textData.length > 0
                  ? [
                      ...new Set(
                        textData.map((datapoint) => datapoint.split(': ')[0])
                      )
                    ]
                  : []
              }
              placeholder={LOCALES.search[language]}
              onChange={setSearchValue}
              selected={searchValue}
              inputProps={{
                onKeyPress: (event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    redirectSearch();
                  }
                }
              }}
              onInputChange={setInputValue}
            />
            <Button onClick={redirectSearch}>
              <img src={searchIcon} alt={LOCALES.searchIcon[language]} />
            </Button>
          </InputGroup>
        </FormGroup>
      </Form>

      {query ? (
        textData.length > 0 ? (
          Object.values(QUERIES).find((queryMatcher) => queryMatcher(query)) ? (
            <Dashboard
              query={
                Object.entries(QUERIES).find((queryMatcher) =>
                  queryMatcher[1](query)
                )[0]
              }
            />
          ) : (
            <h5
              className='position-absolute top-50 start-50 text-nowrap'
              data-aos='fade-up'
            >
              {LOCALES.requestedLocationNotFound[language](query)}
            </h5>
          )
        ) : null
      ) : (
        <h5
          className='position-absolute top-50 start-50 text-nowrap'
          data-aos='fade-up'
        >
          {LOCALES.searchSomething[language]}
        </h5>
      )}

      <Link to='/settings' id='settings-icon'>
        <img width='50px' src={gearIcon} alt={LOCALES.settings[language]} />
      </Link>
    </>
  );
}

export default App;
