let countries = null;
const $countryDeck = document.querySelector('#country-deck');
const $search = document.querySelector('#search');

function getAllCountries() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://restcountries.com/v3.1/independent?status=true');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    countries = xhr.response;
    sortAlphabetical(countries);
    renderAll(countries);
  });
  xhr.send();
}

function renderCountry(country) {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('country-wrapper');

  const $card = document.createElement('div');
  $card.classList.add('card');
  $wrapper.append($card);

  // Front Side
  const $countryF = document.createElement('div');
  $countryF.classList.add('country', 'country-front');
  $card.append($countryF);

  const $flag = document.createElement('div');
  $flag.classList.add('flag');
  $countryF.append($flag);

  const $flagImg = document.createElement('img');
  $flagImg.src = country.flags.png;
  $flagImg.alt = country.flags.alt;
  $flag.append($flagImg);

  const $nameF = document.createElement('h2');
  $nameF.textContent = country.name.common;
  $countryF.append($nameF);

  const $lineF = document.createElement('hr');
  $countryF.append($lineF);

  const $capitalF = document.createElement('h3');
  $capitalF.textContent = country.capital;
  $countryF.append($capitalF);

  const $regionF = document.createElement('h3');
  $regionF.textContent = country.region;
  $countryF.append($regionF);

  const $populationF = document.createElement('h3');
  $populationF.textContent = formatPopulation(country.population);
  $countryF.append($populationF);

  // Back Side
  const $countryB = document.createElement('div');
  $countryB.classList.add('country', 'country-back');
  $card.append($countryB);

  const $nameB = document.createElement('h2');
  $nameB.textContent = country.name.common;
  $countryB.append($nameB);

  const $lineB = document.createElement('hr');
  $countryB.append($lineB);

  const $capitalB = document.createElement('h3');
  $capitalB.innerHTML = '<span>Capitol: </span>' + country.capital[0];
  $countryB.append($capitalB);

  const $regionB = document.createElement('h3');
  $regionB.innerHTML = '<span>Region: </span>' + country.region;
  $countryB.append($regionB);

  const $populationB = document.createElement('h3');
  $populationB.innerHTML = '<span>Population: </span>' + country.population.toLocaleString();
  $countryB.append($populationB);

  const $subRegion = document.createElement('h3');
  $subRegion.innerHTML = '<i class="fa-solid fa-map-pin"></i> ' + country.subregion;
  $countryB.append($subRegion);

  const $money = document.createElement('h3');
  $money.innerHTML = '<i class="fa-solid fa-money-bill"></i> ' + Object.keys(country.currencies);
  $countryB.append($money);

  const arrayLanguage = Object.values(country.languages);
  const $language = document.createElement('h3');
  $language.innerHTML = '<i class="fa-solid fa-language"></i> ';
  for (let i = 0; i < arrayLanguage.length && i < 4; i++) {
    $language.innerHTML += Object.values(arrayLanguage)[i];
    if (i !== 3 && i !== arrayLanguage.length - 1) {
      $language.innerHTML += ', ';
    }
  }
  if (arrayLanguage.length > 4) {
    $language.innerHTML += ' + more';
  }
  $countryB.append($language);

  return $wrapper;
}

function formatPopulation(number) {
  if (number > 1000000000) {
    return (Math.round(number / 100000000) / 10) + ' Billion People';
  } else if (number > 100000000) {
    return (Math.round(number / 1000000)) + ' Million People';
  } else if (number > 1000000) {
    return (Math.round(number / 100000) / 10) + ' Million People';
  } else {
    return '< 1 Million People';
  }
}

function renderAll(countryArray) {
  for (let i = 0; i < countryArray.length; i++) {
    $countryDeck.append(renderCountry(countryArray[i]));
  }
}

function sortAlphabetical(countryArray) {
  countryArray.sort(function (a, b) {
    if (a.name.common > b.name.common) {
      return 1;
    } else if (a.name.common < b.name.common) {
      return -1;
    }
    return 0;
  });
}

function handleSearch(event) {
  unrenderAll();

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].name.common.toLowerCase().includes(event.target.value.toLowerCase())) {
      $countryDeck.append(renderCountry(countries[i]));
    }
  }
}

function unrenderAll() {
  const $countryWrappers = document.querySelectorAll('div.country-wrapper');

  $countryWrappers.forEach(function (element) {
    element.remove();
  });
}

function handleDeck(event) {
  if (event.target.closest('.card') === null) {
    return;
  }
  const $clickedCard = event.target.closest('.card');
  $clickedCard.classList.toggle('is-flipped');
}

$countryDeck.addEventListener('click', handleDeck);
$search.addEventListener('input', handleSearch);

getAllCountries();
