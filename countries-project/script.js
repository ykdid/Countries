document.querySelector("#btnSearch").addEventListener("click", () => {
        let text = document.querySelector("#txtSearch").value;
        document.querySelector("#details").style.opacity = 0;
        getCountry(text);
    });
document.querySelector("#txtSearch").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    let text = document.querySelector("#txtSearch").value;
    document.querySelector("#details").style.opacity = 0;
    getCountry(text);
  }
});

async function getCountry(country) {
  try{
  const response =  await fetch('https://restcountries.com/v3.1/name/' + country);
  if(!response.ok)
    throw new Error ("Country could not find!");
  const data = await response.json();
  renderCountry(data[0]);
  const countries =  data[0].borders;
  if(!countries)
    throw new Error ("Neighbour Country could not find!");
  const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
  const neighbours = await response2.json();
  renderNeighbours(neighbours);
}
catch(err){
  renderError(err);
}
}



function renderCountry(data) {
  document.querySelector("#country-details").innerHTML = "";
  document.querySelector("#neighbours").innerHTML="";
  let html = `                   
  <div class="col-4">
      <img src="${data.flags.png}" alt="" class="img-fluid">
  </div>
  <div class="col-8">
      <h3 class="card-title">${data.name.common}</h3>
      <hr>
      <div class="row">
          <div class="col-4"><b>Population:</b> </div>
          <div class="col-8">${(data.population / 1000000).toFixed(1)} million</div>
      </div>
      <div class="row">
          <div class="col-4"><b>Language: </b></div>
          <div class="col-8">${Object.values(data.languages)}</div>
      </div>
      <div class="row">
          <div class="col-4"><b>Capital:</b> </div>
          <div class="col-8">${data.capital[0]}</div>
      </div>
      <div class="row">
          <div class="col-4"><b>Currency:</b></div>
          <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
      </div>
  </div>
`;     

  document.querySelector("#details").style.opacity = 1;
  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbours(data) {
  let html = "";
  for (let country of data) {
    html += `
                    <div class="col-2 mt-2">
                        <div id="cardCursor" class="card" onclick="searchCountry('${country.name.common}')">
                            <img src="${country.flags.png}" class="card-img-top">
                            <div class="card-body">
                                <h6 class="card-title">${country.name.common}</h6>
                            </div>
                        </div>
                    </div>
                `;
  }
  document.querySelector("#neighbours").innerHTML = html;
}

const searchCountry = (countryName) => {
  getCountry(countryName);
};

function renderError(err) {
  const html = `
  <div class = "alert alert-danger">
    ${err.message}
  </div>
  `;
  setTimeout(function () {
    document.querySelector("#errors").innerHTML = "";
  }, 2000);
  document.querySelector("#errors").innerHTML = html;
}
