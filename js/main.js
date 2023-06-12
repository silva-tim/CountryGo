let countries = null;
const $countryDeck = document.querySelector('#country-deck');

function sendXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://restcountries.com/v3.1/all');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    countries = xhr.response;
  });
  xhr.send();
}

function renderCountry(country) {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('country-wrapper');

  const $country = document.createElement('div');
  $country.classList.add('country');

  const $flag = document.createElement('div');
  $flag.classList.add('flag');
  $country.append($flag);

  const $flagImg = document.createElement('img');
  $flagImg.src = country.flags.png;
  $flagImg.alt = country.flags.alt;

  const $name = document.createElement('h2');
  $name.textContent = country.name.common;

  const $line = document.createElement('hr');

  const $capital = document.createElement('h3');
  $capital.textContent = country.capital;

  const $region = document.createElement('h3');
  $region.textContent = country.region;

  const $population = document.createElement('h3');
  $population.textContent = country.population;

  $flag.append($flagImg);
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

function renderAll(countryArray) {
  for (let i = 0; i < countryArray.length; i++) {
    $countryDeck.append(renderCountry(countryArray[i]));
  }
}

function sortAlphabetical(countryArray) {
  const sortedCountries = [];

  countryArray.sort(function (a, b) {
    if (a.name.common > b.name.common) {
      return 1;
    } else if (a.name.common < b.name.common) {
      return -1;
    }
    return 0;
  });
  return countryArray;
}
