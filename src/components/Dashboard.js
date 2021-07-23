import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import formatDate from '../helpers/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import 'weathericons/css/weather-icons.min.css';
import LOCALES from '../data/localization';
import filterData from '../helpers/filterData';
import parseHeaders from 'parse-headers';
import patchQuestionIcon from 'url:bootstrap-icons/icons/patch-question.svg';
import { fetchDClimateData, setDate } from '../actions';
import 'react-circular-progressbar/dist/styles.css';
import Thermometer from 'react-thermometer-range-component';
import COORDINATES from '../data/latlon';
import dashFormatDate from '../helpers/dashFormatDate';
import extractDClimateDataTemperature from '../helpers/extractDClimateDataTemperature';
import dispatchMultiple from '../helpers/dispatchMultiple';
import generateLocalStorageKey from '../helpers/generateLocalStorageKey';
import '../styles/Loader.css';
import Badge from './Badge';
import findHour from '../helpers/findHour';
import ProgressRing from './ProgressRing';
import { useIsMounted, useRefresh } from 'react-tidy';
import {
  FOGGY_MIN_HUMIDITY,
  HEAT_ADVISORY_CELSIUS_TEMP,
  MIN_DAYS_TO_CLEAR_POLLUTION,
  RAINING_MIN_CHANCE,
  WINDY_MIN_SPEED
} from '../data/magicNumbers';
import PropTypes from 'prop-types';
import Loader from './Loader';

function Dashboard({ query }) {
  let [temporaryDestroy, setTemporaryDestroy] = useState(false);
  let [firstTime, setFirstTime] = useState(true);
  const refresh = useRefresh();

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
        Number.parseFloat(textData.wind.split(' at ')[1].split(' ')[0], 10) >=
          WINDY_MIN_SPEED;
      const raining =
        Number.parseFloat(textData['chance of rain'].slice(0, -1), 10) >=
        RAINING_MIN_CHANCE;
      const foggy =
        Number.parseFloat(textData.humidity.slice(0, -1), 10) >=
        FOGGY_MIN_HUMIDITY;

      return (
        <Col
          key={index}
          xs={matchMedia('(max-width: 576px)').matches ? 6 : 3}
          className='mx-auto'
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
            HEAT_ADVISORY_CELSIUS_TEMP ? (
              <Badge bg='warning'>{LOCALES.heatAdvisory[language]}</Badge>
            ) : null
          ) : null}
          {raining &&
          (findHour(
            dclimateData,
            'era5_volumetric_soil_water_layer_1-hourly',
            query,
            date,
            stage
          ) ||
            findHour(
              dclimateData,
              'era5_surface_runoff-hourly',
              query,
              date,
              stage
            )) ? (
            <Badge bg='primary'>{LOCALES.floodWarning[language]}</Badge>
          ) : null}
          {dclimateData[
            generateLocalStorageKey(
              'era5_land_wind_v-hourly',
              COORDINATES[query]
            )
          ].filter((windVComp) =>
            [
              dashFormatDate(
                new Date(new Date(date.getTime()).setDate(date.getDate() - 2))
              ),
              dashFormatDate(
                new Date(new Date(date.getTime()).setDate(date.getDate() - 1))
              ),
              dashFormatDate(date)
            ].includes(windVComp.split(' ')[0])
          ).length +
            dclimateData[
              generateLocalStorageKey(
                'era5_land_wind_u-hourly',
                COORDINATES[query]
              )
            ].filter((windVComp) =>
              [
                dashFormatDate(
                  new Date(new Date(date.getTime()).setDate(date.getDate() - 2))
                ),
                dashFormatDate(
                  new Date(new Date(date.getTime()).setDate(date.getDate() - 1))
                ),
                dashFormatDate(date)
              ].includes(windVComp.split(' ')[0])
            ).length <=
            MIN_DAYS_TO_CLEAR_POLLUTION && !raining ? (
            <Badge bg='secondary'>
              {foggy || textData.condition === 'Cloudy'
                ? LOCALES.extremeAirQuality[language]
                : LOCALES.poorAirQuality[language]}
            </Badge>
          ) : null}
        </Col>
      );
    },
    [textData, dclimateData, language]
  );

  const isMounted = useIsMounted();

  const dispatch = dispatchMultiple(useDispatch(), isMounted);

  const refreshMediaCallback = useCallback(() => {
    if (isMounted()) refresh();
  }, [isMounted]);

  useEffect(() => {
    matchMedia('(max-width: 576px)').addEventListener(
      'change',
      refreshMediaCallback
    );
    matchMedia('(max-width: 768px)').addEventListener(
      'change',
      refreshMediaCallback
    );
    dispatch(
      fetchDClimateData(COORDINATES[query], 'era5_surface_runoff-hourly'),
      fetchDClimateData(
        COORDINATES[query],
        'era5_volumetric_soil_water_layer_1-hourly'
      ),
      fetchDClimateData(COORDINATES[query], 'era5_land_wind_u-hourly'),
      fetchDClimateData(COORDINATES[query], 'era5_land_wind_v-hourly'),
      fetchDClimateData(COORDINATES[query], 'cpcc_temp_max-daily'),
      fetchDClimateData(COORDINATES[query], 'cpcc_temp_min-daily')
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
      setTemporaryDestroy(true);
    }
  }, [date]);

  useEffect(() => {
    if (temporaryDestroy === true) {
      setTemporaryDestroy(false);
    }
  }, [temporaryDestroy]);

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

      {Object.keys(textData).length === 0 ? (
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
      ) : temporaryDestroy ||
        !dclimateData[
          generateLocalStorageKey('era5_land_wind_u-hourly', COORDINATES[query])
        ] ||
        !dclimateData[
          generateLocalStorageKey('era5_land_wind_v-hourly', COORDINATES[query])
        ] ||
        !dclimateData[
          generateLocalStorageKey(
            'era5_surface_runoff-hourly',
            COORDINATES[query]
          )
        ] ||
        !dclimateData[
          generateLocalStorageKey(
            'era5_volumetric_soil_water_layer_1-hourly',
            COORDINATES[query]
          )
        ] ? (
        <Loader center />
      ) : (
        <Container fluid data-aos='fade-up'>
          <Row>
            <Col
              id='thermometer-container'
              md={3}
              sm={4}
              xs={12}
              className='part-border'
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
                  averageTempLabel={LOCALES.average[language]}
                  maxTempLabel={LOCALES.high[language]}
                />
              ) : (
                <Loader />
              )}
            </Col>
            <Col md={9} sm={8} xs={12}>
              <Row id='preview-icons' className='part-border'>
                {matchMedia('(max-width: 576px)').matches ? (
                  <Col xs={12}>
                    <Row>{['Morning', 'Afternoon'].map(processWeather)}</Row>
                    <Row>{['Evening', 'Night'].map(processWeather)}</Row>
                  </Col>
                ) : (
                  ['Morning', 'Afternoon', 'Evening', 'Night'].map(
                    processWeather
                  )
                )}
              </Row>
              <Row id='progress-ring-row' className='part-border'>
                <ProgressRing
                  label={LOCALES.chanceOfRain[language]}
                  valueEnd={Number.parseFloat(
                    textData['chance of rain'].slice(0, -1),
                    10
                  )}
                />
                <ProgressRing
                  label={LOCALES.humidity[language]}
                  valueEnd={Number.parseFloat(
                    textData.humidity.slice(0, -1),
                    10
                  )}
                />
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  query: PropTypes.string.isRequired
};

export default Dashboard;
