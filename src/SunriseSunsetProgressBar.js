import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { differenceInSeconds } from 'date-fns';

const SunriseSunsetProgressBar = ({ sunriseTime, sunsetTime, currentTime }) => {
  const sunrise = new Date(sunriseTime);
  const sunset = new Date(sunsetTime);
  const now = new Date(currentTime);
  

  const totalDaylightSeconds = differenceInSeconds(sunset, sunrise);
  const elapsedDaylightSeconds = differenceInSeconds(now, sunrise);

  const daylightPercentage = (elapsedDaylightSeconds / totalDaylightSeconds) * 50;
  console.log(daylightPercentage)
  const pathColor = daylightPercentage > 50 ? 'white' : '#f39c12';
  return (
    <div style={{ width:"40%"}}>
      <CircularProgressbar
        value={daylightPercentage}
        styles={buildStyles({rotation: 3/4,// Start from the west
        strokeLinecap: 'butt', // Keep the stroke ending sharp
        textSize: '16px',
        pathTransitionDuration: 2,
        pathColor: pathColor,
        textColor: '#f39c12',
        trailColor: 'white',
      })}
    />
  </div>
);
};

export default SunriseSunsetProgressBar;