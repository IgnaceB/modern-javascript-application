import Data from "./config.js";
const searchBar = document.querySelector('#searchBar');
const container = document.querySelector(".container");

const defineDay=(iteration)=>{
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    let dayOfTheWeek = weekdays[(date.getDay() + iteration) % 7];
    return dayOfTheWeek
}

const removeChildren=(parent)=>{
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}

const GetDataGeoLoc=(cityName)=>{
    let apiUrl="https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + Data.key
    return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        return data

    })
    .catch((error) => {

        console.log('Error:', error);
        removeChildren(container)
    })
}

const GetDataWeather=(lat,lon)=>{
    let apiUrl="https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&cnt=40&units=metric&exclude=minutely,hourly,alerts&appid=" + Data.key
    return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
     return data   
 })
    .catch((error) => {

        console.log('Error:', error);
        removeChildren(container)
    })
}

const CreateHtmlElement =({id,type,data,parentID,classList,innertext,iteration})=>{
 const randomName = document.createElement(type);
 randomName.id=id
 if (classList!=""){
    randomName.classList.add(classList)
}
if (innertext!=""||data!=""){
    randomName.innerHTML = data + innertext;
}
if (type=="img"){
    randomName.src = "http://openweathermap.org/img/wn/" + data + "@2x.png";
}
document.getElementById(parentID).appendChild(randomName);
}

const fillingWithData=(dataWeather)=>{

                        // Looping through 5 days of weather data
    for(let i = 0; i < 5; i++) {
        console.log(i)
        let dayOfTheWeek = defineDay(i)
        const data = dataWeather.list[i];
                            // Create the elements with Data
            // (name, type, data, parent, classList, innerText)
        CreateHtmlElement({
            id:"card"+i,
            type:"div",
            data:"",
            parentID:"container",
            classList:"card",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"imageBox"+i,
            type:"div",
            data:"",
            parentID:"card"+i,
            classList:"imgBx",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"cardImg"+i,
            type:"img",
            data:data.weather[0].icon,
            parentID:"imageBox"+i,
            classList:"",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"contentBox"+i,
            type:"div",
            data:"",
            parentID:"card"+i,
            classList:"contentBx",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"cardHeader"+i,
            type:"h2",
            data:dayOfTheWeek,
            parentID:"contentBox"+i,
            classList:"",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"tempDescription"+i,
            type:"h4",
            data:data.weather[0].description,
            parentID:"contentBox"+i,
            classList:"",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"currentTempBox"+i,
            type:"div",
            data:"",
            parentID:"contentBox"+i,
            classList:"color",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"currentTempHeader"+i,
            type:"h3",
            data:"",
            parentID:"currentTempBox"+i,
            classList:"",
            innertext:"Temp :",
            iteration: i})
        CreateHtmlElement({
            id:"currentTemp"+i,
            type:"span",
            data:data.main.temp,
            parentID:"currentTempBox"+i,
            classList:"current-temp",
            innertext:"°C",
            iteration: i})
        CreateHtmlElement({
            id:"minMaxTemperatures"+i,
            type:"div",
            data:"",
            parentID:"contentBox"+i,
            classList:"details",
            innertext:"",
            iteration: i})
        CreateHtmlElement({
            id:"minMaxTempHeader"+i,
            type:"h3",
            data:"",
            parentID:"minMaxTemperatures"+i,
            classList:"",
            innertext:"More :",
            iteration: i})
        CreateHtmlElement({
            id:"minTemp"+i,
            type:"span",
            data:data.main.temp_min,
            parentID:"minMaxTemperatures"+i,
            classList:"min-temp",
            innertext:"°C",
            iteration: i})
        CreateHtmlElement({
            id:"maxTemp"+i,
            type:"span",
            data:data.main.temp_max,
            parentID:"minMaxTemperatures"+i,
            classList:"max-temp",
            innertext:"°C",
            iteration: i})
    };
}

searchBar.addEventListener('keyup', async (event) => {
    // checking the action for specific key (Enter)
    if(event.key === "Enter") {
        // Store target in variable
        const thisCity =  event.target.value.toLowerCase();
        event.currentTarget.value = '';

        let coords = await GetDataGeoLoc(thisCity)
        let dataWeather = await GetDataWeather(coords[0].lat,coords[0].lon)
        
        fillingWithData(dataWeather)

    }
})

