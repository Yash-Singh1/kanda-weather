import React, { useEffect, useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import 'weathericons/css/weather-icons.min.css';
import LOCALES from '../data/localization';
import filterData from '../helpers/filterData';
import parseHeaders from 'parse-headers';
import patchQuestionIcon from 'bootstrap-icons/icons/patch-question.svg';
import { setDate } from '../actions';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ProgressProvider from './ProgressProvider';
import 'react-circular-progressbar/dist/styles.css';
import Thermometer from './Thermometer';

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
  const darkMode = useSelector((state) => state.darkMode);

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
        <>
          <div className='container-fluid' data-aos='fade-up'>
            <div className='row'>
              <div className='col-3'>
                <Thermometer
                  theme={darkMode ? 'dark' : 'light'}
                  minTemp={10}
                  value={data.temperature.slice(0, -1)}
                  maxTemp={30}
                  max='50'
                  steps='3'
                  format='°C'
                  size='large'
                  height='300'
                  minTempLabel={LOCALES.low[language]}
                  currentTempLabel={LOCALES.current[language]}
                  maxTempLabel={LOCALES.high[language]}
                />
              </div>
              <div className='col-9'>
                <div id='preview-icons' className='row'>
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map(
                    (stage, index) => {
                      const windy =
                        data.wind !== 'Unknown' &&
                        parseFloat(data.wind.split(' at ')[1].split(' ')[0]) >=
                          20;
                      const raining =
                        parseFloat(data['chance of rain'].slice(0, -1)) >= 60;
                      const foggy =
                        parseFloat(data.humidity.slice(0, -1)) >= 95;
                      return (
                        <div key={index} className='col-3 mx-auto'>
                          <span className='text-nowrap'>
                            {LOCALES[stage][language]}
                          </span>
                          <br />
                          <i
                            className={`weather-icon wi ${
                              data.condition === 'Sunny'
                                ? 'wi-' +
                                  (stage === 'Morning' || stage === 'Afternoon'
                                    ? 'day-sunny'
                                    : 'night-clear')
                                : data.condition === 'Cloudy'
                                ? raining
                                  ? 'wi-' +
                                    (stage === 'Morning' ||
                                    stage === 'Afternoon'
                                      ? ''
                                      : 'night-alt-') +
                                    'rain' +
                                    (windy ? '-wind' : '')
                                  : 'wi-' + (foggy ? 'fog' : 'cloudy')
                                : data.condition === 'Partly Cloudy'
                                ? raining && windy
                                  ? 'wi-' +
                                    (stage === 'Morning' ||
                                    stage === 'Afternoon'
                                      ? 'day'
                                      : 'night-alt') +
                                    '-rain-wind'
                                  : raining
                                  ? 'wi-' +
                                    (stage === 'Morning' ||
                                    stage === 'Afternoon'
                                      ? 'day'
                                      : 'night-alt') +
                                    '-rain'
                                  : 'wi-' +
                                    (stage === 'Morning' ||
                                    stage === 'Afternoon'
                                      ? 'day'
                                      : 'night' + (foggy ? '' : '-alt')) +
                                    (foggy ? '-fog' : '-partly-cloudy')
                                : ''
                            } font-size-50`}
                          ></i>
                          <br />
                          <span className='text-nowrap'>
                            {data.condition === 'Sunny'
                              ? stage === 'Morning' || stage === 'Afternoon'
                                ? LOCALES.sunny[language]
                                : LOCALES.clear[language]
                              : foggy
                              ? LOCALES.foggy[language]
                              : raining
                              ? LOCALES.rain[language]
                              : windy
                              ? LOCALES.windy[language]
                              : data.condition === 'Cloudy'
                              ? LOCALES.cloudy[language]
                              : data.condition === 'Partly Cloudy'
                              ? LOCALES.partlyCloudy[language]
                              : ''}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className='row'>
                  <div className='col-6'>
                    <div
                      style={{ width: 200, maxWidth: 'inherit' }}
                      className='mx-auto'
                    >
                      <ProgressProvider
                        valueStart={10}
                        valueEnd={parseFloat(
                          data['chance of rain'].slice(0, -1)
                        )}
                      >
                        {(value) => (
                          <CircularProgressbarWithChildren
                            value={value}
                          >{`${LOCALES.chanceOfRain[language]}: ${value}%`}</CircularProgressbarWithChildren>
                        )}
                      </ProgressProvider>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div
                      style={{ width: 200, maxWidth: 'inherit' }}
                      className='mx-auto'
                    >
                      <ProgressProvider
                        valueStart={10}
                        valueEnd={parseFloat(data.humidity.slice(0, -1))}
                      >
                        {(value) => (
                          <CircularProgressbarWithChildren
                            value={value}
                          >{`${LOCALES.humidity[language]}: ${value}%`}</CircularProgressbarWithChildren>
                        )}
                      </ProgressProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
