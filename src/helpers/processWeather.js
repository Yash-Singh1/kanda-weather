import React from 'react';
import LOCALES from '../data/localization';

function processWeather(data, language) {
  return (stage, index) => {
    const windy =
      data.wind !== 'Unknown' &&
      parseFloat(data.wind.split(' at ')[1].split(' ')[0]) >= 20;
    const raining = parseFloat(data['chance of rain'].slice(0, -1)) >= 60;
    const foggy = parseFloat(data['humidity'].slice(0, -1)) >= 95;
    return (
      <div key={index} className='col-sm-3 mx-auto'>
        <span className='text-nowrap'>{LOCALES[stage][language]}</span>
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
                  (stage === 'Morning' || stage === 'Afternoon'
                    ? ''
                    : 'night-alt-') +
                  'rain' +
                  (windy ? '-wind' : '')
                : 'wi-' + (foggy ? 'fog' : 'cloudy')
              : data.condition === 'Partly Cloudy'
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
                  (foggy ? '-fog' : '-cloudy')
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
            ? 'Raining'
            : windy
            ? 'windy'
            : data.condition === 'Cloudy'
            ? 'Cloudy'
            : data.condition === 'Partly Cloudy'
            ? 'Partly Cloudy'
            : ''}
        </span>
      </div>
    );
  };
}

export default processWeather;
