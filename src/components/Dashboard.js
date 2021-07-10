import React, { useEffect, useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import formatDate from '../helpers/formatDate';
import { useSelector } from 'react-redux';
import 'weathericons/css/weather-icons.min.css';
import processWeather from '../helpers/processWeather';

function Dashboard({ givenDate, query }) {
  const data = useSelector((state) => state.data);

  let [date, setDate] = useState(new Date(givenDate.getTime()));
  let [tempDestroy, setTempDestroy] = useState(false);
  let [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
    } else {
      window.history.pushState(
        '',
        '',
        '?q=' + query + '&date=' + formatDate(date)
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
          onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
        >
          ◂
        </Button>
        <FormControl
          type='date'
          value={`${date.getFullYear()}-${date.getMonth() < 10 ? 0 : ''}${
            date.getMonth() + 1
          }-${date.getDate() < 10 ? 0 : ''}${date.getDate()}`}
          onChange={(event) =>
            setDate(new Date(event.target.value.replace('-', ', ')))
          }
        />
        <Button
          onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
        >
          ▸
        </Button>
      </InputGroup>

      {tempDestroy ? null : (
        <div id='preview-icons' data-aos='fade-up'>
          <div className='row'>
            {processWeather(date, data, query, setDate)(0, 0)}
          </div>
          <div className='row'>
            <div className='col-sm-2 offset'></div>
            {[-2, -1, 1, 2].map(processWeather(date, data, query, setDate))}
            <div className='col-sm-2 offset'></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
