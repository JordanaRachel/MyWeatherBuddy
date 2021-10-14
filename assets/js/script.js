const apiKey = "a3524ecce44e097cdbac57df6041ae72";
const apiUrl = "api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}"

//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = 'http://api.openweathermap.org/geo/1.0/direct?' +
  'q=' + inputVal +
  '&appid=a3524ecce44e097cdbac57df6041ae72';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const lat = data[0].lat
      const lon = data[0].lon
      return fetch(
        'https://api.openweathermap.org/data/2.5/onecall?' +
            '&lat=' + lat +
            '&lon=' + lon +
            '&exclude=minutely,hourly,alerts' +
            '&units=imperial' +
            '&appid=a3524ecce44e097cdbac57df6041ae72'

    )}).then(function(response) {
        return response.json();
      })
  
      .then(data => {
        console.log(data);
        console.log(data.current.weather[0].icon);
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        data.current.weather[0].icon 
        }.svg`;
  
        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
          <h2 class="city-name" data-name="${name}">
            <span>${name}</span>
            
          </h2>
          <div class="city-temp">${Math.round(data.current.temp)}<sup>°F</sup></div>
          <figure>
            <img class="city-icon" src="${icon}">
          </figure>
          <p>Wind: ${data.current.wind_speed}</p>
          <p>Humidity: ${data.current.humidity}</p>
          <p>UV Index: ${data.current.uvi}</p>
        `;
        li.innerHTML = markup;
        list.appendChild(li);
      })
    
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

