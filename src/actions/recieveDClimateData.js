import generateLocalStorageKey from '../helpers/generateLocalStorageKey';
import processSoilMoisture from '../helpers/processSoilMoisture';
import processSurfaceRunoff from '../helpers/processSurfaceRunoff';
import processWind from '../helpers/processWind';

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
          (json['time last generated']
            ? json['time last generated']
            : json['time generated']) !==
            localStorage.getItem(
              generateLocalStorageKey(dataset, latlon) + '-cache-version'
            ) ||
          !localStorage.getItem(
            generateLocalStorageKey(dataset, latlon) + '-cache'
          )
        ) {
          fetch('/api/grid-history/' + dataset + '/' + latlon.join('_'))
            .then((response) => response.json())
            .then((dataJSON) => {
              switch (dataset) {
                case 'era5_surface_runoff-hourly':
                  dataJSON.data = processSurfaceRunoff(dataJSON.data);
                  break;
                case 'era5_volumetric_soil_water_layer_1-hourly':
                  dataJSON.data = processSoilMoisture(dataJSON.data);
                  break;
                case 'era5_land_wind_u-hourly':
                case 'era5_land_wind_v-hourly':
                  dataJSON.data = processWind(dataJSON.data);
                  break;
              }
              if (dataset.endsWith('-hourly')) {
                dataJSON.data = dataJSON.data.split(',');
              }
              localStorage.setItem(
                generateLocalStorageKey(dataset, latlon) + '-cache-version',
                json['time last generated']
                  ? json['time last generated']
                  : json['time generated']
              );
              try {
                localStorage.setItem(
                  generateLocalStorageKey(dataset, latlon) + '-cache',
                  dataset.endsWith('-hourly')
                    ? dataJSON.data
                    : JSON.stringify(dataJSON.data)
                );
                // eslint-disable-next-line no-empty
              } catch {}
              dispatch(recieveDClimateData(dataJSON, latlon, dataset));
            });
        } else {
          dispatch(
            recieveDClimateData(
              {
                data: dataset.endsWith('-hourly')
                  ? localStorage
                      .getItem(
                        generateLocalStorageKey(dataset, latlon) + '-cache'
                      )
                      .split(',')
                  : JSON.parse(
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
