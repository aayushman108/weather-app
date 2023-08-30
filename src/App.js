import React from 'react';
import getFormattedData from './api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from './data';
import { hourResponsive } from './data';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import SunriseSunsetProgressBar from './SunriseSunsetProgressBar';

function App() {
  const [cityName, setCityName]= useState('');
  const [data, setData]= useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [btn, setBtn]= useState([]);
  const [btnIcon, setBtnIcon]= useState([]);
  const [forecast, setForecast]= useState([]);
  const [error, setError]= useState('');
  const [active, setActive]= useState(0);
   
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
      async function(position){
        const latitude= position.coords.latitude;
        const longitude= position.coords.longitude;
        const data= await getFormattedData({lat: latitude, lon: longitude, units: "metric"});
        const data1Keys= Object.keys(data[1]);
        const data1Values= Object.values(data[1]);
        setForecast(data[1][data1Keys[0]]);
        setData(data);
        setBtn(data1Keys);
        setBtnIcon(data1Values);
        console.log(data1Values);
        setIsLoading(false);
        console.log(data[0])
      },
      function (error){
        setIsLoading(false);
        setError(error.message);
      }
    )
  },[])

  const backgroundImageUrl = process.env.PUBLIC_URL + '/images/weather.jpg';
  const backgroundImageUrlCurrent = process.env.PUBLIC_URL + '/images/weather2.jpg';
  const styles = {
    position: 'relative',
    zIndex: 0,
    paddingBottom: "2em"
  };

  const pseudoStyles = {
    content: '',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: "linear-gradient(#0E86D4, #003060)",
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    opacity: 1,
    zIndex: -2,
  };
  const pseudoStylesCurrent = {
    content: '',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImageUrlCurrent})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    opacity: 0.2,
    zIndex: -1,
    borderRadius: "5px"
  };

  const pseudoStylesButton = {
    content: '',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    opacity: 0.2,
    zIndex: -1,
    borderRadius: "4px"
  };

  const pseudoStylesDetail = {
    content: '',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: "#4D2DB7",
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    opacity: 0.3,
    zIndex: -1,
    borderRadius: "4px"
  };

  const handleClick= (item, index)=>{
    const date= item;
    setForecast(data[1][date]);
    setActive(index);
  }

    const fetchData = async (e) => {
      e.preventDefault();
      try{
      const data = await getFormattedData({ q: cityName, units: "metric" });
      if (!Array.isArray(data)) {
        throw new Error(data);
      }
      const data1Keys= Object.keys(data[1]);
      const data1Values= Object.values(data[1]);
      setForecast(data[1][data1Keys[0]]);
      setData(data);
      setBtn(data1Keys);
      setBtnIcon(data1Values);
    } 
    catch(error){
      console.log(error)
      setError(error.message);
    }
    };

    if(error){
      return (
      <>
      {cityName && <div className='d-flex flex-wrap justify-content-center align-items-center vw-100 vh-100'>
        <h3 className='text-center' style={{color: "red"}} >{error} <i>{cityName}</i> not found</h3>
        
      </div>}
      {!cityName && alert(error) }
      </>
      )
    }

    if(isLoading){
      return (
        <div className='d-flex flex-wrap justify-content-center align-items-center vw-100 vh-100'>
          <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        )
    }

  return (
    <>
    {data.length > 1 && <div style={styles}>
    <div style={pseudoStyles}></div>
    <div className="container-fluid" style={{"backgroundColor": "#e5e5ff"}}>
      <div className='row justify-content-around py-2' >
        <div className='col-4 d-flex flex-wrap align-items-center'>
          <h3 className='mb-0'>Weather</h3>
        </div>
        <form className='col-md-6 col-8 text-end py-2' >
          <input type="search" className='searchBar' value={cityName} onChange={e=> setCityName(e.target.value)} placeholder='search...' />
          <button className="search-btn" onClick={(e)=> fetchData(e)} disabled={!cityName}><i className="bi bi-search"></i></button>
        </form>
      </div>
    </div>
    <div className="container-lg container-fluid px-lg-0 px-4 mt-4 mb-2 pt-4 pb-1" style={{"color":"white"}}>
      <div className='row row-cols-2 justify-content-between' >
        <div className='col-lg-3 col-4-md col-5 text-start p-0' >{data[0].place}, {data[0].country}</div>
        <div className="col-lg-3 col-4-md col-7 text-end p-0" >{data[0].formattedDate}</div>
      </div>
    </div>
    <div className="container-lg container-fluid px-4 p-lg-0" style={{"color":"white"}}>
      <div className='row d-lg-flex flex-wrap justify-content-between flex-md-row flex-column p-0' >
        <div className='col-12 text-start p-3 current-data-style' >
        <div style={pseudoStylesCurrent}></div>
          <div className=' mb-4'>
            <p className='my-0' >Current weather</p>
            <p className='my-0' >{data[0].formattedTime}</p>
          </div>
          <div className='d-flex flex-wrap mb-4' >
            <div className="" style={{"height":"100px"}}>
              <img className='' src={`http://openweathermap.org/img/wn/${data[0].icon}.png`} alt="..." style={{"boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", "height":"100%", "width":"auto"}} />
            </div>
            <h1 className='m-0 px-2 align-self-center' >{data[0].temp.toFixed()}&deg;C</h1>
            <div className='mx-4 align-self-center' >
              <h5 className='mb-0'  >{data[0].main}</h5>
              <p className='mb-2' >{data[0].description}</p>
              <p  className='mb-0' >Feels like {data[0].feels_like.toFixed()}&deg;C</p>
            </div>
          </div>
            
          <div className='d-flex flex-wrap' >
            <div className='mx-2' >
              <p className='my-0' >wind<i class="bi bi-info-circle"></i></p>
              <h6 className='my-0' >{data[0].speed}m/s</h6>
            </div>
            <div className='mx-2' >
              <p className='my-0' >Humidity<i class="bi bi-info-circle"></i></p>
              <h6 className='my-0' >{data[0].humidity}%</h6>
            </div>
            <div className='mx-2' >
              <p className='my-0' >Visibility<i class="bi bi-info-circle"></i></p>
              <h6 className='my-0' >{data[0].visibility}m</h6>
            </div>
            <div className='mx-2' >
              <p className='my-0' >Pressure<i class="bi bi-info-circle"></i></p>
              <h6 className='my-0' >{data[0].pressure}hPa</h6>
            </div>
          </div>
        </div>
        <div className="col-12 my-md-0 my-4 py-4 mt-md-0 text-end d-flex flex-wrap justify-content-around align-items-center current-sun-style" >
          <div className='text-center' >
            <p className='my-0 p-0 fs-md-6 fs-4' >Sunrise</p>
            <h6 className=''>{data[0].formattedSunriseTime}</h6>
          </div>
          
          <SunriseSunsetProgressBar sunriseTime={data[0].sunriseTime} sunsetTime={data[0].sunsetTime} currentTime={data[0].currentTime} />

          <div className='text-center py-0' >
            <p className='my-0 py-0 fs-md-6 fs-4'>Sunset</p>
            <h6 className='my-0'>{data[0].formattedSunsetTime}</h6>
          </div>

        </div>
      </div>
    </div>
    <div className='container-lg container-fluid px-4 p-lg-0 my-4 '>
      <h6 className='mt-4 mb-3' style={{color: "white"}}>6 DAYS FORECAST</h6>
      <div className='container-fluid' >
      <Carousel responsive={responsive}>
        {btn.map((item, index)=>{
          const formattedDate= DateTime.fromFormat(item, 'MMMM dd, yyyy').toFormat('ccc, MMM d');
          return(
            <div key={index} onClick={()=> handleClick(item, index)} className={`btn-class ${active===index? "active": ""}`} >
              <div style={pseudoStylesButton}></div>
              <h6 className='text-center pb-1 pt-2 mb-0' style={{color: "white"}} >{index===0? "Today": formattedDate}</h6>
              <div className='text-center w-100 p-0'><img className='' src={`http://openweathermap.org/img/wn/${btnIcon[index][0].weather[0].icon}.png`} alt="..." style={{"height":"auto", "width":"70%"}} /></div>
            </div>
          )
        })}
        
      </Carousel>
      </div>
    </div>
    <div className='container-lg container-fluid px-4 p-lg-0 my-4'>
      <h6 className='mt-4 mb-3' style={{color: "white"}} >TRI-HOURLY FORECAST</h6>
      <div className='container-fluid' >
      <Carousel responsive={hourResponsive}>
      {forecast.map((item, index)=>{
          //const formattedDate= DateTime.fromFormat(item, 'MMMM dd, yyyy').toFormat('ccc, MMM d');
          const {dt, main: {temp, feels_like, humidity, pressure}, weather, wind:{speed, deg, gust}, visibility, pop, dt_txt, clouds:{all}}= item;
          const temperature= temp.toFixed();
          const {main: condition, description, icon}= weather[0];

          const utcDateTime= DateTime.fromSeconds(dt, {zone: 'utc'});
          const localizedDateTime= utcDateTime.plus({seconds: data[0].timezone});
          const formattedTime= localizedDateTime.toFormat('hh:mm a');

          return(
            <div key={index} className='mx-2 p-0' style={{"minWidth":"340px"}} >
        <div className='text-start p-3 forecast-container'>
          <div className=' mb-4'>
          <div style={pseudoStylesDetail}></div>
          <p className='my-0' >{formattedTime}</p>
          </div>
          <div className='d-flex flex-wrap mb-4' >
            <div className="" style={{"height":"100px"}}>
              <img className='' src={`http://openweathermap.org/img/wn/${icon}.png`} alt="..." style={{"boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", "height":"100%", "width":"auto"}} />
            </div>
            <h3 className='m-0 px-2 align-self-center' >{temperature}&deg;C</h3>
            <div className='mx-sm-4 mx-2 align-self-center' >
              <h5 className='mb-2 mt-sm-0 mt-3' >{condition}</h5>
              <p  className='mb-0' >Feels like {feels_like.toFixed()}&deg;C</p>
            </div>
          </div>
            
          <div className='d-flex flex-wrap' >
            <div className='m-md-2 m-2' >
              <p className='my-0' >wind</p>
              <h6 className='my-0' >{speed}m/s</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='my-0' >Humidity</p>
              <h6 className='my-0' >{humidity}%</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='my-0' >Visibility</p>
              <h6 className='my-0' >{visibility}m</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='my-0' >Pressure</p>
              <h6 className='my-0' >{pressure}hPa</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='my-0' >Cloudiness</p>
              <h6 className='my-0' >{all}%</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='my-0' >Precipitation</p>
              <h6 className='my-0' >{pop}</h6>
            </div>
            <div className='m-md-2 m-2' >
              <p className='m-0' >Wind gust</p>
              <h6 className='my-0' >{gust}m/s</h6>
            </div>
          </div>
        </div>
        </div>
          )
        })}
       
      </Carousel>
      </div>
    </div>
    </div>}
    </>
  );
}

export default App;
