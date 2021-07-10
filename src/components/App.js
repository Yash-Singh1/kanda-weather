import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, FormGroup, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import searchIcon from 'bootstrap-icons/icons/search.svg';
import gearIcon from 'bootstrap-icons/icons/gear.svg';
import forecast from '../forecast.txt';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Dashboard from './Dashboard';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setQuery } from '../actions';
import LOCALES from '../data/localization';
import QUERIES from '../data/queries';

const search = new URLSearchParams(location.search);
const queryParam = search.get('q');
const dateParam = search.get('date')
  ? new Date(decodeURIComponent(search.get('date')))
  : new Date();

function App() {
  let [searchValue, setSearchValue] = useState([
    queryParam ? decodeURIComponent(queryParam) : ''
  ]);
  let [inputValue, setInputValue] = useState(searchValue[0]);

  const dispatch = useDispatch();

  const data = useSelector((state) => state.data);
  const query = useSelector((state) => state.query);
  const language = useSelector((state) => state.language);

  useEffect(() => {
    if (query === '' && queryParam && queryParam !== '') {
      location.search = '?date=' + formatDate(dateParam);
    }
  }, [query]);

  if (!queryParam && query) {
    window.history.pushState('', '', '?q=' + query);
    setSearchValue([query]);
  }

  useEffect(() => {
    fetch(forecast)
      .then((response) => response.text())
      .then((text) => dispatch(setData(text.split('\n'.repeat(4)))));
  }, []);

  function redirectSearch() {
    if (searchValue.length === 0 && inputValue === '') {
      if (!queryParam) {
        return;
      }
      dispatch(setQuery(''));
    }
    if (searchValue[0] === queryParam) {
      return;
    }
    location.search =
      '?q=' + (searchValue[0] || inputValue) + '&date=' + formatDate(dateParam);
  }

  return (
    <>
      <Form inline>
        <FormGroup>
          <InputGroup>
            <Typeahead
              id='search bar'
              options={
                data.length > 0
                  ? [
                      ...new Set(
                        data.map((datapoint) => datapoint.split(': ')[0])
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
        data.length > 0 ? (
          Object.values(QUERIES).find((queryMatcher) => queryMatcher(query)) ? (
            <Dashboard
              query={
                Object.entries(QUERIES).find((queryMatcher) =>
                  queryMatcher[1](query)
                )[0]
              }
              givenDate={dateParam}
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
