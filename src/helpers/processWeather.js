import React from 'react';
import parseHeaders from 'parse-headers';
import filterData from './filterData';
import patchQuestionIcon from 'bootstrap-icons/icons/patch-question.svg';

function processWeather(date, data, query, setDate) {
  return (difference, index) => {
    if (difference === null) {
      return null;
    }
    const storedDate = new Date(date.getTime());
    const filteredData = parseHeaders(
      filterData(
        data,
        query,
        new Date(storedDate.setDate(storedDate.getDate() + difference))
      )
    );
    if (Object.keys(filteredData).length === 0) {
      return (
        <div
          key={index}
          className={(difference === 0 ? 'col-sm-12' : 'col-sm-2') + ' mx-auto'}
        >
          <img
            src={patchQuestionIcon}
            alt='data unavaliable'
            className='weather-icon'
            width={difference === 0 ? '100px' : '50px'}
            onClick={
              difference === 0
                ? null
                : () =>
                    setDate(new Date(date.setDate(date.getDate() + difference)))
            }
          />
          <span className='text-nowrap'>No Data</span>
        </div>
      );
    }
    const windy =
      filteredData.wind !== 'Unknown' &&
      parseFloat(filteredData.wind.split(' at ')[1].split(' ')[0]) >= 20;
    const gusty =
      windy &&
      parseFloat(filteredData.wind.split(' at ')[1].split(' ')[0]) >= 25;
    const raining =
      parseFloat(filteredData['chance of rain'].slice(0, -1)) >= 60;
    const foggy = parseFloat(filteredData['chance of rain'].slice(0, -1)) >= 95;
    return (
      <div
        key={index}
        className={(difference === 0 ? 'col-sm-12' : 'col-sm-2') + ' mx-auto'}
      >
        <i
          onClick={
            difference === 0
              ? null
              : () =>
                  setDate(new Date(date.setDate(date.getDate() + difference)))
          }
          className={`weather-icon wi ${
            filteredData.condition === 'Sunny' && !raining
              ? windy
                ? 'wi-day-windy'
                : !windy &&
                  filteredData.wind !== 'Unknown' &&
                  parseFloat(
                    filteredData.wind.split(' at ')[1].split(' ')[0]
                  ) >= 15
                ? 'wi-day-light-wind'
                : 'wi-day-sunny'
              : filteredData.condition === 'Cloudy'
              ? raining && windy
                ? 'wi-rain-wind'
                : gusty
                ? 'wi-cloudy-gusts'
                : windy
                ? 'wi-cloudy-windy'
                : raining
                ? 'wi-rain'
                : foggy
                ? 'wi-fog'
                : 'wi-cloudy'
              : filteredData.condition === 'Partly Cloudy' ||
                (filteredData.condition === 'Sunny' && raining)
              ? raining && windy
                ? 'wi-day-rain-wind'
                : gusty
                ? 'wi-day-cloudy-gusts'
                : windy
                ? 'wi-day-cloudy-windy'
                : raining
                ? 'wi-day-rain'
                : foggy
                ? 'wi-day-fog'
                : 'wi-day-cloudy'
              : ''
          } ${difference === 0 ? 'font-size-100' : 'font-size-50'}`}
        ></i>
        <span className='text-nowrap'>
          {filteredData.condition === 'Sunny' && !raining
            ? windy
              ? 'Windy/Sunny'
              : !windy &&
                filteredData.wind !== 'Unknown' &&
                parseFloat(filteredData.wind.split(' at ')[1].split(' ')[0]) >=
                  15
              ? 'Light Wind/Sunny'
              : 'Sunny'
            : filteredData.condition === 'Cloudy'
            ? raining && windy
              ? 'Rain & Wind'
              : gusty
              ? 'Cloudy & Gusty'
              : windy
              ? 'Cloudy & Windy'
              : raining
              ? 'Raining'
              : foggy
              ? 'Foggy'
              : 'Cloudy'
            : filteredData.condition === 'Partly Cloudy' ||
              (filteredData.condition === 'Sunny' && raining)
            ? raining && windy
              ? 'Partly Cloudy & Rain & Wind'
              : gusty
              ? 'Partly Cloudy & Gusty'
              : windy
              ? 'Partly Cloudy & Windy'
              : raining
              ? 'Partly Cloudy & Rain'
              : foggy
              ? 'Partly Cloudy & Fog'
              : 'Partly Cloudy'
            : ''}
        </span>
      </div>
    );
  };
}

export default processWeather;
