let countries = null;
let changeSearch = false;
const $countryDeck = document.querySelector('#country-deck');
const $search = document.querySelector('#search-bar');
const $switchToBucket = document.querySelector('#plane');
const $switchToHome = document.querySelector('#home');
const $subhead = document.querySelector('#subhead');
const $noEntries = document.querySelector('#no-entries');

// Sends XHR and retrieves all independent countries
function getAllCountries() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://restcountries.com/v3.1/independent?status=true&fields=capital,cca3,currencies,flags,languages,name,population,region,subregion');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    countries = xhr.response;
    viewSwap(data.page);
  });
  xhr.send();
}

// Function to render individual country
function renderCountry(country) {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('country-wrapper');

  const $card = document.createElement('div');
  $card.classList.add('card');
  $card.setAttribute('data-cca3', country.cca3);
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
  $nameF.classList.add('country-name');
  $nameF.textContent = country.name.common;
  $countryF.append($nameF);

  const $lineF = document.createElement('hr');
  $countryF.append($lineF);

  const $capitalF = document.createElement('h3');
  $capitalF.textContent = country.capital[0];
  $countryF.append($capitalF);

  const $regionF = document.createElement('h3');
  $regionF.textContent = country.region;
  $countryF.append($regionF);

  const $populationF = document.createElement('h3');
  $populationF.textContent = formatPopulation(country.population);
  $countryF.append($populationF);

  const $airplane = document.createElement('i');
  $airplane.classList.add('fa-solid', 'fa-paper-plane', 'hidden', 'card-plane');
  $countryF.append($airplane);

  // Back Side
  const $countryB = document.createElement('div');
  $countryB.classList.add('country', 'country-back');
  $card.append($countryB);

  const $nameB = document.createElement('h2');
  $nameB.classList.add('country-name');
  $nameB.textContent = country.name.common;
  $countryB.append($nameB);

  const $lineB = document.createElement('hr');
  $countryB.append($lineB);

  const $capitalB = document.createElement('h3');
  $capitalB.textContent = country.capital[0];
  const $capitalText = document.createElement('span');
  $capitalText.textContent = 'Capital: ';
  $capitalB.prepend($capitalText);
  $countryB.append($capitalB);

  const $regionB = document.createElement('h3');
  $regionB.textContent = country.region;
  const $regionText = document.createElement('span');
  $regionText.textContent = 'Region: ';
  $regionB.prepend($regionText);
  $countryB.append($regionB);

  const $populationB = document.createElement('h3');
  $populationB.textContent = country.population.toLocaleString();
  const $populationText = document.createElement('span');
  $populationText.textContent = 'Population: ';
  $populationB.prepend($populationText);
  $countryB.append($populationB);

  const $subRegion = document.createElement('h3');
  $subRegion.textContent = ' ' + country.subregion;
  const $pinIcon = document.createElement('i');
  $pinIcon.classList.add('fa-solid', 'fa-map-pin');
  $subRegion.prepend($pinIcon);
  $countryB.append($subRegion);

  const $money = document.createElement('h3');
  $money.textContent = ' ' + Object.keys(country.currencies);
  const $cashIcon = document.createElement('i');
  $cashIcon.classList.add('fa-solid', 'fa-money-bill');
  $money.prepend($cashIcon);
  $countryB.append($money);

  const arrayLanguage = Object.values(country.languages);
  const $language = document.createElement('h3');
  $language.textContent = ' ';
  // Shortens number of languages to 4 or less
  for (let i = 0; i < arrayLanguage.length && i < 4; i++) {
    $language.textContent += Object.values(arrayLanguage)[i];
    if (i !== 3 && i !== arrayLanguage.length - 1) {
      $language.textContent += ', ';
    }
  }
  if (arrayLanguage.length > 4) {
    $language.textContent += ' + more';
  }

  const $letterIcon = document.createElement('i');
  $letterIcon.classList.add('fa-solid', 'fa-language');
  $language.prepend($letterIcon);
  $countryB.append($language);

  const $buttonRow = document.createElement('div');
  $buttonRow.classList.add('row', 'justifycenter');
  const $button = document.createElement('button');
  $button.textContent = 'Add to Bucket List';
  $countryB.append($buttonRow);
  $buttonRow.append($button);

  for (let i = 0; i < data.savedCountries.length; i++) {
    if (data.savedCountries[i].cca3 === country.cca3) {
      $button.classList.add('hidden');
      $airplane.classList.remove('hidden');
    }
  }

  return $wrapper;
}

// Renders all countries from an array
function renderArray(countryArray) {
  for (let i = 0; i < countryArray.length; i++) {
    $countryDeck.append(renderCountry(countryArray[i]));
  }
}

// Function that unrenders every country
function unrenderAll() {
  const $countryWrappers = document.querySelectorAll('div.country-wrapper');

  $countryWrappers.forEach(function (element) {
    element.remove();
  });
}

function viewSwap(page) {
  unrenderAll();
  changeSearch = false;
  $switchToBucket.classList.remove('white');
  $switchToHome.classList.remove('white');
  $subhead.classList.add('hidden');
  $noEntries.classList.add('hidden');
  data.page = page;

  if (page === 'bucketList') {
    changeSearch = true;
    $subhead.classList.remove('hidden');
    $switchToBucket.classList.add('white');

    if (data.savedCountries.length < 1) {
      $search.classList.add('hidden');
      $noEntries.classList.remove('hidden');
    } else {
      $noEntries.classList.add('hidden');
      $search.classList.remove('hidden');
      sortAlphabetical(data.savedCountries);
      renderArray(data.savedCountries);
    }
  }

  if (page === 'home') {
    $switchToHome.classList.add('white');
    $search.classList.remove('hidden');
    sortAlphabetical(countries);
    renderArray(countries);
  }
}

// Sorts a country array by name(alphabetically)
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

// Function to deal with search
function handleSearch(event) {
  unrenderAll();

  if (changeSearch === true) {
    for (let i = 0; i < data.savedCountries.length; i++) {
      if (data.savedCountries[i].name.common.toLowerCase().includes(event.target.value.toLowerCase())) {
        $countryDeck.append(renderCountry(data.savedCountries[i]));
      }
    }
  } else {
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].name.common.toLowerCase().includes(event.target.value.toLowerCase())) {
        $countryDeck.append(renderCountry(countries[i]));
      }
    }
  }
}

// Function that handles clicking events on cards
function handleDeck(event) {
  const $countryClicked = event.target.closest('.card');
  const $frontPlanePin = $countryClicked.querySelector('.country').querySelector('i');
  if ($countryClicked === null) {
    return;
  }

  if (event.target.matches('button')) {
    event.target.classList.add('hidden');
    $frontPlanePin.classList.remove('hidden');
    data.savedCountries.push(getCountryFromCCA3($countryClicked.getAttribute('data-cca3')));
  } else {
    $countryClicked.classList.toggle('is-flipped');
  }
}

// Formats population for front side render
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

function getCountryFromCCA3(cca3) {
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].cca3 === cca3) {
      return countries[i];
    }
  }
}

// Event listeners
$countryDeck.addEventListener('click', handleDeck);
$search.addEventListener('input', handleSearch);
$switchToBucket.addEventListener('click', function () { viewSwap('bucketList'); });
$switchToHome.addEventListener('click', function () { viewSwap('home'); });
document.addEventListener('DOMContentLoaded', getAllCountries());
