let countries = null;
const $countryDeck = document.querySelector('#country-deck');

function sendXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://restcountries.com/v3.1/all');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    countries = xhr.response;
    console.log(xhr.status);
    console.log(xhr.response);
  });
  xhr.send();
}

function renderCountry(country) {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('country-wrapper');

  const $country = document.createElement('div');
  $country.classList.add('country');

  const $flag = document.createElement('img');
  $flag.src = country.flags.png;
  $flag.alt = country.flags.alt;

  const $name = document.createElement('h2');
  $name.textContent = country.name.common;

  const $line = document.createElement('hr');

  const $capital = document.createElement('h3');
  $capital.textContent = country.capital;

  const $region = document.createElement('h3');
  $region.textContent = country.region;

  const $population = document.createElement('h3');
  $population.textContent = country.population;

  $country.append($flag);
  $country.append($name);
  $country.append($line);
  $country.append($capital);
  $country.append($region);
  $country.append($population);
  $wrapper.append($country);
  return $wrapper;
}

function formatPopulation(number) {

}
