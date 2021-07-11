import React, { useEffect, useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import 'weathericons/css/weather-icons.min.css';
import processWeather from '../helpers/processWeather';
import LOCALES from '../data/localization';
import filterData from '../helpers/filterData';
import parseHeaders from 'parse-headers';
import patchQuestionIcon from 'bootstrap-icons/icons/patch-question.svg';
import { setDate } from '../actions';

function Dashboard({ query }) {
  let [tempDestroy, setTempDestroy] = useState(false);
  let [firstTime, setFirstTime] = useState(true);

  const date = useSelector((state) => state.date);
  const data = parseHeaders(
    filterData(
      useSelector((state) => state.data),
      query,
      date
    )
  );
  const language = useSelector((state) => state.language);

  const dispatch = useDispatch();

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
    } else {
      window.history.pushState(
        '',
        '',
        '?q=' + encodeURIComponent(query) + '&date=' + formatDate(date)
      );
      setTempDestroy(true);
    }
  }, [date]);

  useEffect(() => {
    if (tempDestroy === true) {
      setTempDestroy(false);
    }
  }, [tempDestroy]);

  return (
    <div id='dashboard'>
      <InputGroup>
        <Button
          onClick={() =>
            dispatch(setDate(new Date(date.setDate(date.getDate() - 1))))
          }
        >
          ◂
        </Button>
        <FormControl
          type='date'
          value={`${date.getFullYear()}-${date.getMonth() < 10 ? 0 : ''}${
            date.getMonth() + 1
          }-${date.getDate() < 10 ? 0 : ''}${date.getDate()}`}
          onChange={(event) =>
            dispatch(setDate(new Date(event.target.value.replace('-', ', '))))
          }
        />
        <Button
          onClick={() =>
            dispatch(setDate(new Date(date.setDate(date.getDate() + 1))))
          }
        >
          ▸
        </Button>
      </InputGroup>

      {tempDestroy ? null : Object.keys(data).length === 0 ? (
        <div
          data-aos='fade-up'
          className='position-absolute top-50 start-50 text-nowrap'
          id='no-data-question-container'
        >
          <img
            src={patchQuestionIcon}
            alt={LOCALES.dataUnavaliable[language]}
            id='no-data-question'
          />
          <br />
          <span>{LOCALES.noData[language]}</span>
        </div>
      ) : (
        <div id='preview-icons' className='row' data-aos='fade-up'>
          {['Morning', 'Afternoon', 'Evening', 'Night'].map(
            processWeather(data, language)
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
