const apiKey = "f643a36c49410897b36a917e092d05a3";

function getWeather(){
  const cityName = cityInput.value.trim();
  if(!cityName){
    alert("Please enter a city name");
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if(data.cod !== 200){
        alert(data.message);
        return;
      }

      updateUI(data);
      updateMap(data.name);
      setDayNight(data);
      setTempGlow(data.main.temp);
    });
}

function updateUI(d){
  city.innerText = d.name;
  temp.innerText = Math.round(d.main.temp) + "°C";
  condition.innerText = d.weather[0].description;
  feels.innerText = "Feels like: " + Math.round(d.main.feels_like) + "°C";

  humidity.innerText = d.main.humidity + "%";
  pressure.innerText = "Pressure: " + d.main.pressure + " hPa";

  wind.innerText = d.wind.speed + " km/h";
  windDir.innerText = "Direction: " + d.wind.deg + "°";

  analysisText.innerText =
    `Temperature ranges from ${Math.round(d.main.temp_min)}°C to ${Math.round(d.main.temp_max)}°C.
     Humidity is ${d.main.humidity}% with pressure ${d.main.pressure} hPa.`;

  predictionText.innerText =
    d.weather[0].main.includes("Rain")
      ? "Rain is possible in the coming hours."
      : "Stable weather conditions expected.";
}

function updateMap(city){
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
}

function setDayNight(d){
  const local = (Date.now()/1000) + d.timezone;
  const hour = new Date(local*1000).getUTCHours();
  document.body.classList.toggle("night", hour < 6 || hour > 18);
  document.body.classList.toggle("day", hour >= 6 && hour <= 18);
}

function setTempGlow(t){
  const card = document.querySelector(".temp-card");
  if(t < 15){
    card.style.boxShadow = "0 0 40px rgba(100,180,255,.8)";
  }else if(t <= 30){
    card.style.boxShadow = "0 0 40px rgba(180,120,255,.8)";
  }else{
    card.style.boxShadow = "0 0 40px rgba(255,120,80,.9)";
  }
}

function downloadReport(){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFillColor(54,209,220);
  pdf.rect(0,0,210,30,"F");
  pdf.setTextColor(255);
  pdf.setFontSize(20);
  pdf.text("AtmosIQ Weather Report",105,20,{align:"center"});

  pdf.setTextColor(0);
  pdf.setFontSize(12);

  let y=45;
  [
    ["City",city.innerText],
    ["Temperature",temp.innerText],
    ["Feels Like",feels.innerText],
    ["Humidity",humidity.innerText],
    ["Pressure",pressure.innerText],
    ["Wind",wind.innerText],
    ["Condition",condition.innerText]
  ].forEach(r=>{
    pdf.text(`${r[0]}: ${r[1]}`,20,y);
    y+=10;
  });

  pdf.save("AtmosIQ_Report.pdf");
  reportStatus.innerText = "✔ Weather report downloaded successfully";
}
