import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import 'weathericons/css/weather-icons.min.css';
import LOCALES from '../data/localization';
import filterData from '../helpers/filterData';
import parseHeaders from 'parse-headers';
import patchQuestionIcon from 'url:bootstrap-icons/icons/patch-question.svg';
import { fetchDClimateData, setDate } from '../actions';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ProgressProvider from './ProgressProvider';
import 'react-circular-progressbar/dist/styles.css';
import Thermometer from './Thermometer';
import COORDINATES from '../data/latlon';
import dashFormatDate from '../helpers/dashFormatDate';
import extractDClimateDataTemperature from '../helpers/extractDClimateDataTemperature';
import dispatchMultiple from '../helpers/dispatchMultiple';
import generateLocalStorageKey from '../helpers/generateLocalStorageKey';
import '../styles/Loader.css';
import Badge from './Badge';

function Dashboard({ query }) {
  let [tempDestroy, setTempDestroy] = useState(false);
  let [firstTime, setFirstTime] = useState(true);
  const [, forceRender] = useState({});

  const date = useSelector((state) => state.date);
  const textData = parseHeaders(
    filterData(
      useSelector((state) => state.textData),
      query,
      date
    )
  );
  const language = useSelector((state) => state.language);
  const darkMode = useSelector((state) => state.darkMode);
  const dclimateData = useSelector((state) => state.dclimateData);

  const processWeather = useCallback(
    (stage, index) => {
      const windy =
        textData.wind !== 'Unknown' &&
        parseFloat(textData.wind.split(' at ')[1].split(' ')[0]) >= 20;
      const raining = parseFloat(textData['chance of rain'].slice(0, -1)) >= 60;
      const foggy = parseFloat(textData.humidity.slice(0, -1)) >= 95;
      return (
        <div
          key={index}
          className={`col-${
            matchMedia('(max-width: 576px)').matches ? 6 : 3
          } mx-auto`}
        >
          <span className='text-nowrap'>{LOCALES[stage][language]}</span>
          <br />
          <i
            className={`weather-icon wi ${
              textData.condition === 'Sunny'
                ? 'wi-' +
                  (stage === 'Morning' || stage === 'Afternoon'
                    ? 'day-sunny'
                    : 'night-clear')
                : textData.condition === 'Cloudy'
                ? raining
                  ? 'wi-' +
                    (stage === 'Morning' || stage === 'Afternoon'
                      ? ''
                      : 'night-alt-') +
                    'rain' +
                    (windy ? '-wind' : '')
                  : 'wi-' + (foggy ? 'fog' : 'cloudy')
                : textData.condition === 'Partly Cloudy'
                ? raining && windy
                  ? 'wi-' +
                    (stage === 'Morning' || stage === 'Afternoon'
                      ? 'day'
                      : 'night-alt') +
                    '-rain-wind'
                  : raining
                  ? 'wi-' +
                    (stage === 'Morning' || stage === 'Afternoon'
                      ? 'day'
                      : 'night-alt') +
                    '-rain'
                  : 'wi-' +
                    (stage === 'Morning' || stage === 'Afternoon'
                      ? 'day'
                      : 'night' + (foggy ? '' : '-alt')) +
                    (foggy
                      ? '-fog'
                      : (stage === 'Morning' || stage === 'Afternoon'
                          ? ''
                          : '-partly') + '-cloudy')
                : ''
            } font-size-50`}
          ></i>
          <br />
          <span className='text-nowrap'>
            {textData.condition === 'Sunny'
              ? stage === 'Morning' || stage === 'Afternoon'
                ? LOCALES.sunny[language]
                : LOCALES.clear[language]
              : foggy
              ? LOCALES.foggy[language]
              : raining
              ? LOCALES.rain[language]
              : windy
              ? LOCALES.windy[language]
              : textData.condition === 'Cloudy'
              ? LOCALES.cloudy[language]
              : textData.condition === 'Partly Cloudy'
              ? LOCALES.partlyCloudy[language]
              : ''}
          </span>
          <br />
          {dclimateData[
            generateLocalStorageKey('cpcc_temp_max-daily', COORDINATES[query])
          ] ? (
            extractDClimateDataTemperature(dclimateData, date, query, 'max') >
            40.5556 ? (
              <Badge bg='warning'>{LOCALES.heatAdvisory[language]}</Badge>
            ) : null
          ) : null}
          {dclimateData[
            generateLocalStorageKey(
              'era5_surface_runoff-hourly',
              COORDINATES[query]
            )
          ] && raining ? (
            Object.keys(
              dclimateData[
                generateLocalStorageKey(
                  'era5_surface_runoff-hourly',
                  COORDINATES[query]
                )
              ]
            ).find((surfaceRunoffDate) =>
              surfaceRunoffDate.startsWith(dashFormatDate(date))
            ) ? (
              <Badge bg='primary'>{LOCALES.floodWarning[language]}</Badge>
            ) : null
          ) : null}
        </div>
      );
    },
    [textData, dclimateData, language]
  );

  const dispatch = dispatchMultiple(useDispatch());

  useEffect(() => {
    matchMedia('(max-width: 576px)').onchange = () => forceRender({});
    matchMedia('(max-width: 768px)').onchange = () => forceRender({});
    dispatch(
      fetchDClimateData(COORDINATES[query], 'cpcc_temp_max-daily'),
      fetchDClimateData(COORDINATES[query], 'cpcc_temp_min-daily'),
      fetchDClimateData(COORDINATES[query], 'era5_surface_runoff-hourly'),
      fetchDClimateData(
        COORDINATES[query],
        'era5_volumetric_soil_water_layer_1-hourly'
      )
    );
  }, []);

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
          value={dashFormatDate(date)}
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

      {tempDestroy ? null : Object.keys(textData).length === 0 ? (
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
              <div
                id='thermometer-container'
                className='col-md-3 col-sm-4 col-12 part-border'
              >
                {dclimateData[
                  generateLocalStorageKey(
                    'cpcc_temp_min-daily',
                    COORDINATES[query]
                  )
                ] &&
                dclimateData[
                  generateLocalStorageKey(
                    'cpcc_temp_max-daily',
                    COORDINATES[query]
                  )
                ] ? (
                  <Thermometer
                    theme={darkMode ? 'dark' : 'light'}
                    minTemp={extractDClimateDataTemperature(
                      dclimateData,
                      date,
                      query,
                      'min'
                    )}
                    value={textData.temperature.slice(0, -1)}
                    maxTemp={extractDClimateDataTemperature(
                      dclimateData,
                      date,
                      query,
                      'max'
                    )}
                    max='50'
                    steps='3'
                    format='°C'
                    size={
                      matchMedia('(max-width: 576px)').matches
                        ? 'small'
                        : matchMedia('(max-width: 768px)').matches
                        ? 'normal'
                        : 'large'
                    }
                    height={
                      matchMedia('(max-width: 576px)').matches
                        ? '200'
                        : matchMedia('(max-width: 768px)').matches
                        ? '250'
                        : '300'
                    }
                    minTempLabel={LOCALES.low[language]}
                    currentTempLabel={LOCALES.current[language]}
                    maxTempLabel={LOCALES.high[language]}
                  />
                ) : (
                  <span className='loader'></span>
                )}
              </div>
              <div className='col-md-9 col-sm-8 col-12'>
                <div id='preview-icons' className='row part-border'>
                  {matchMedia('(max-width: 576px)').matches ? (
                    <>
                      <div className='col-12'>
                        <div className='row'>
                          {['Morning', 'Afternoon'].map(processWeather)}
                        </div>
                        <div className='row'>
                          {['Evening', 'Night'].map(processWeather)}
                        </div>
                      </div>
                    </>
                  ) : (
                    ['Morning', 'Afternoon', 'Evening', 'Night'].map(
                      processWeather
                    )
                  )}
                </div>
                <div id='progress-ring-row' className='row part-border'>
                  <div className='col-6'>
                    <div className='mx-auto progress-ring'>
                      <ProgressProvider
                        valueStart={10}
                        valueEnd={parseFloat(
                          textData['chance of rain'].slice(0, -1)
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
                    <div className='mx-auto progress-ring'>
                      <ProgressProvider
                        valueStart={0}
                        valueEnd={parseFloat(textData.humidity.slice(0, -1))}
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
