import generateLocalStorageKey from '../helpers/generateLocalStorageKey';
import processSurfaceRunoff from '../helpers/processSurfaceRunoff';

export const RECIEVE_DCLIMATE_DATA = 'RECIEVE_DCLIMATE_DATA';

function recieveDClimateData(json, latlon, dataset) {
  return {
    type: RECIEVE_DCLIMATE_DATA,
    data: json.data,
    latlon,
    dataset
  };
}

export function fetchDClimateData(latlon, dataset) {
  return function (dispatch) {
    return fetch('/api/metadata/' + dataset)
      .then((response) => response.json())
      .then((json) => {
        if (
          json['time last generated'] !==
          localStorage.getItem(
            generateLocalStorageKey(dataset, latlon) + '-cache-version'
          )
        ) {
          fetch('/api/grid-history/' + dataset + '/' + latlon.join('_'))
            .then((response) => response.json())
            .then((dataJSON) => {
              if (dataset === 'era5_surface_runoff-hourly') {
                dataJSON.data = processSurfaceRunoff(dataJSON.data);
              } else if (
                dataset === 'era5_volumetric_soil_water_layer_1-hourly'
              ) {
              }
              localStorage.setItem(
                generateLocalStorageKey(dataset, latlon) + '-cache-version',
                json['time last generated']
              );
              localStorage.setItem(
                generateLocalStorageKey(dataset, latlon) + '-cache',
                JSON.stringify(dataJSON.data)
              );
              dispatch(recieveDClimateData(dataJSON, latlon, dataset));
            });
        } else {
          dispatch(
            recieveDClimateData(
              {
                data: JSON.parse(
                  localStorage.getItem(
                    generateLocalStorageKey(dataset, latlon) + '-cache'
                  )
                )
              },
              latlon,
              dataset
            )
          );
        }
      });
  };
}
