import React from 'react';
import { makeStyles, Icon, useMediaQuery } from '@material-ui/core';
import './style.css';
import { StoreState } from '../../Reducers';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  graphContainer: {
    display: 'flex',
    height: '90%',
    fontSize: '12px',
    flexDirection: 'column'
  },
  graphTitle: {
    paddingLeft: '1em',
    boxSizing: 'border-box',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  graphTitleItem: {
    paddingRight: '4em',
    fontSize: '18px',
    color: '#c8d1de',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '2em'
    }
  },
  graphItems: {
    flexBasis: '20%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      paddingTop: '2em',
      paddingBottom: '2em'
    }
  },
  graphDayItem: {
    paddingRight: '16px',
    minWidth: '110px',
    color: '#202d5d',
    fontSize: '16px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      minWidth: 'auto'
    }
  },
  graphOtherItem: {
    minWidth: '100px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: 500,
    color: '#3b4671',
    fontSize: '16px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      minWidth: 'auto'
    }
  },
  graphOtherIcon: {
    width: '100%',
    textAlign: 'center'
  },
  graphBars: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    top: '4px'
  },
  graphLineContainer: {
    width: '4px',
    height: '100%',
    position: 'absolute',
    boxSizing: 'border-box',
    paddingTop: '3em',
    paddingBottom: '2em'
  },
  graphDottedLine: {
    width: '100%',
    height: '8px',
    position: 'absolute',
    boxSizing: 'border-box',
    borderTop: '3px dotted #d4e3f5'
  },
  graphValueContainer: {
    width: '100%',
    height: '5px',
    position: 'absolute',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  graphValueLineHigh: {
    width: '50%',
    height: '8px',
    background: '#e94b0c',
    position: 'absolute',
    left: '50%',
    borderRadius: '0px 8px 8px 0px',
    top: '-5px'
  },
  graphValueLineLow: {
    width: '50%',
    height: '8px',
    background: '#d4e3f5',
    position: 'absolute',
    right: '50%',
    borderRadius: '8px 0px 0px 8px',
    top: '-5px'
  },
  smFlex: {
    display: 'contents',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      flexBasis: '100%',
      paddingBottom: '2em',
      boxSizing: 'border-box'
    }
  }
}));

export interface ForecastProps {
  type: 'forecast';
  weeklyAvg: number;
  data: {
    day: string;
    precip: string;
    weatherId: string;
    dayTemp: number;
    highTemp: number;
    lowTemp: number;
  }[];
}

export default function WeeklyForecast(props: ForecastProps) {
  const classes = useStyles({});
  const tempScale = useSelector((state: StoreState) => state.weather.tempScale);
  const selectedCity = useSelector((state: StoreState) => state.weather.selectedCity);
  const xsQuery = useMediaQuery('(max-width:600px)');
  // Titles default to rain type
  let graphTitle = 'Weekly Forecast';

  // Gets the appropriate FA Icon depending on weather ID
  const weatherIdToFAIcon = (weatherId: string) => {
    let faClass = 'fa ';
    let tempWeatherId = weatherId.substring(0, weatherId.length - 1);
    switch (tempWeatherId) {
      case '01':
        faClass += 'fa-sun';
        break;
      case '02':
        faClass += 'fa-cloud-sun';
        break;
      case '03':
        faClass += 'fa-cloud';
        break;
      case '04':
        faClass += 'fa-cloud';
        break;
      case '09':
        faClass += 'fa-cloud-rain';
        break;
      case '10':
        faClass += 'fa-cloud-sun-rain';
        break;
      case '11':
        faClass += 'fa-bolt';
        break;
      case '13':
        faClass += 'fa-snowflake';
        break;
      case '50':
        faClass += 'fa-smog';
        break;
    }
    return faClass;
  };

  // Calculates using average how wide bars should be
  // Need to make this more meaningful kind of useless atm...
  const calcHighLowWidth = (low: number, high: number) => {
    let tempHigh = (high - props.weeklyAvg) * 5;
    if (tempHigh > 50) tempHigh = 50;
    else if (tempHigh < 0) tempHigh = 0;
    let tempLow = props.weeklyAvg - low;
    if (tempLow > 50) tempLow = 50;
    else if (tempLow < 0) tempLow = 0;

    return { low: tempLow, high: tempHigh };
  };

  // Converts from Kelvin to Celcius / Farenheit depending on current tempScale
  const convertTempScale = (temp: number) => {
    // Kelvin to Celcius
    temp = temp - 273.15;
    if (tempScale === 'farenheit') {
      temp = temp * (9 / 5) + 32;
    }
    return Math.round(temp) + (tempScale === 'celsius' ? '°C' : '°F');
  };

  return (
    <React.Fragment>
      {!xsQuery && (
        <div className={classes.graphTitle}>
          <div className={classes.graphTitleItem}>
            <div style={{ textAlign: 'center', color: '#202b5c' }}>Week</div>
            <div style={{ textAlign: 'center', color: '#202b5c', fontSize: '28px' }}>•</div>
          </div>
          <div className={classes.graphTitleItem}>Month</div>
          <div className={classes.graphTitleItem}>3 Month</div>
          <div className={classes.graphTitleItem}>6 Month</div>
        </div>
      )}
      <div className={classes.graphContainer}>
        {props.data.map(item => {
          let barTempLengths = calcHighLowWidth(item.lowTemp, item.highTemp);
          return (
            <div className={classes.graphItems} key={item.day}>
              <div className={classes.smFlex}>
                <div className={classes.graphDayItem}>{item.day}</div>
                <div className={classes.graphOtherItem}>
                  <Icon className="fa fa-tint" />
                  {item.precip} mm
                </div>
                <div className={classes.graphOtherItem}>
                  <Icon className={`${weatherIdToFAIcon(item.weatherId) + ' ' + classes.graphOtherIcon}`} />
                </div>
              </div>

              <div className={classes.smFlex}>
                <div className={classes.graphOtherItem}>{convertTempScale(item.lowTemp)}</div>
                <div className={classes.graphBars}>
                  <div className={classes.graphDottedLine}></div>
                  <div className={classes.graphValueContainer}>
                    <div style={{ height: '100%', width: '100%' }}>
                      <div className={classes.graphValueLineLow} style={{ width: `${barTempLengths.low}%` }} />
                      <div className={classes.graphValueLineHigh} style={{ width: `${barTempLengths.high}%` }} />
                    </div>
                  </div>
                </div>
                <div className={classes.graphOtherItem}>{convertTempScale(item.highTemp)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}
