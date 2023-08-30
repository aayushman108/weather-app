import { DateTime } from "luxon";

const API_KEY= "f83a1dc0d61682bf10c3fa0daf9cfe4a";
const BASE_URL= "https://api.openweathermap.org/data/2.5";

//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

function getWeatherData(info, searchParams){
    return new Promise(async (resolve, reject)=>{
        const url= new URL(BASE_URL+'/'+info);
        url.search= new URLSearchParams({...searchParams, appid: API_KEY});
        console.log(url);
        try{
            const response= await fetch(url);
            if(!response.ok){
                throw new Error(`Error fetching data: ${response.status}`)
            }
            const data= await response.json();
            if(info==='weather'){
                const {coord:{lat, lon}, weather, main:{temp, feels_like, temp_min, temp_max, pressure, humidity},visibility, wind:{speed}, dt, sys:{country, sunrise,sunset}, timezone, name: place}=data;
                const {main, description, icon}= weather[0];
                //use dt and timezone to get the formatted local date and time
                const utcDateTime= DateTime.fromSeconds(dt, {zone: 'utc'});
                const localizedDateTime= utcDateTime.plus({seconds: timezone});
                const currentTime= localizedDateTime.toISO();
                const formattedDate= localizedDateTime.toFormat('cccc, MMMM dd, yyyy');
                const formattedTime= localizedDateTime.toFormat('hh:mm a');
                //for sunrise and sunset
                const sunriseDateTime= DateTime.fromSeconds(sunrise, {zone: 'utc'}).plus({seconds: timezone});
                const sunsetDateTime= DateTime.fromSeconds(sunset, {zone: 'utc'}).plus({seconds: timezone});
                const sunriseTime= sunriseDateTime.toISO();
                const sunsetTime= sunsetDateTime.toISO();
                const formattedSunriseTime= sunriseDateTime.toFormat('hh:mm a');
                const formattedSunsetTime= sunsetDateTime.toFormat('hh:mm a')

                resolve({sunrise, sunset, dt, currentTime, sunriseTime, sunsetTime, lat, lon, main, description, icon, temp, feels_like, temp_min, temp_max, pressure, humidity, visibility, speed,formattedDate, formattedTime, country, formattedSunriseTime, formattedSunsetTime, timezone, place})
            }else if(info==='forecast'){
                const {list}= data;
                const arrangedData= {};
                list.forEach(item=> {
                    const dateTimeString= item.dt_txt;
                    const dateTime = DateTime.fromFormat(dateTimeString, 'yyyy-MM-dd HH:mm:ss');
                    const formattedDate = dateTime.toFormat("MMMM dd, yyyy");
                    if(!arrangedData[formattedDate]){
                        arrangedData[formattedDate]=[];
                    }
                    arrangedData[formattedDate].push(item)
                })
                resolve(arrangedData)
            }
        }
        catch(error){
            reject(error)
        }
    }) 
}

async function getFormattedData(searchParams){
    return getWeatherData('weather', searchParams)
    .then(async(data)=>{
        const currentData= data;
        const {lat, lon}= data;
        const forecastData= await getWeatherData('forecast', {lat, lon, units: "metric"});
        console.log([currentData, forecastData]);
        return [currentData, forecastData];

    })
    .catch(error=>{
        console.error(error.message)
        return error;
    })
}
 export default getFormattedData;