let noteAlreadyRendered = false;
let countries = null;
let changeSearch = false;
const $countryDeck = document.querySelector('#country-deck');
const $searchBar = document.querySelector('#search-bar');
const $search = document.querySelector('#search');
const $switchToBucket = document.querySelector('#plane');
const $switchToHome = document.querySelector('#home');
const $subheadDiv = document.querySelector('#subhead-div');
const $subhead = document.querySelector('#subhead');
const $noEntries = document.querySelector('#no-entries');
const $notesPageContainer = document.querySelector('#notes-page-container');
const $notesHeading = document.querySelector('#notes-heading');
const $notesNotesSaved = document.querySelector('#notes-saved');
const $notesFlagImage = document.querySelector('#notes-flag-image');
const $notesCapital = document.querySelector('#notes-capital');
const $notesRegion = document.querySelector('#notes-region');
const $notesPopulation = document.querySelector('#notes-population');
const $notesSubregion = document.querySelector('#notes-subregion');
const $notesCurrency = document.querySelector('#notes-currency');
const $notesLanguage = document.querySelector('#notes-language');
const $notesEditIcon = document.querySelector('#notes-edit-icon');
const $notesInput = document.querySelector('#notes-input');
const $notesForm = document.querySelector('#notes-form');

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

  /* Front Side Rendering of Card */
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

  const $airplaneF = document.createElement('i');
  $airplaneF.classList.add('fa-solid', 'fa-paper-plane', 'hidden', 'card-plane');
  $countryF.append($airplaneF);

  /* Back Side Rendering of Card */
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
  const $buttonAdd = document.createElement('button');
  $buttonAdd.setAttribute('id', 'button-add');
  $buttonAdd.textContent = 'Add to Bucket List';
  $countryB.append($buttonRow);
  $buttonRow.append($buttonAdd);
  const $buttonNotes = document.createElement('button');
  $buttonNotes.setAttribute('id', 'button-notes');
  $buttonNotes.textContent = 'Notes';
  $buttonNotes.classList.add('hidden');
  $buttonRow.append($buttonNotes);

  // Switches button and adds plane icon if country is already saved
  if (findSavedCountry(country.cca3) !== null) {
    $buttonAdd.classList.add('hidden');
    $buttonNotes.classList.remove('hidden');
    $airplaneF.classList.remove('hidden');
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

function renderNote(savedCountry) {
  if (noteAlreadyRendered === true) {
    unrenderNote();
  }

  if (!savedCountry.notes) {
    savedCountry.notes = 'No notes saved yet!';
  }
  $notesNotesSaved.textContent = savedCountry.notes;
  $notesHeading.textContent = savedCountry.name.common;
  $notesFlagImage.src = savedCountry.flags.png;
  $notesFlagImage.alt = savedCountry.flags.alt;
  $notesCapital.append(savedCountry.capital[0]);
  $notesRegion.append(savedCountry.region);
  $notesPopulation.append(savedCountry.population.toLocaleString());
  $notesSubregion.append(savedCountry.subregion);
  $notesCurrency.append(Object.keys(savedCountry.currencies));
  $notesLanguage.append(Object.values(savedCountry.languages));
  noteAlreadyRendered = true;
  data.currentCountry = savedCountry;

  viewSwap('note');
}

function unrenderNote() {
  $notesCapital.lastChild.remove();
  $notesRegion.lastChild.remove();
  $notesPopulation.lastChild.remove();
  $notesSubregion.lastChild.remove();
  $notesCurrency.lastChild.remove();
  $notesLanguage.lastChild.remove();
}

// Function that handles all view swapping
function viewSwap(page) {
  unrenderAll();
  cancelEdit();
  $search.value = '';
  changeSearch = false;
  $switchToBucket.classList.remove('white');
  $switchToHome.classList.remove('white');
  $notesPageContainer.classList.add('hidden');
  data.page = page;

  if (page === 'bucketList') {
    $subhead.textContent = 'Bucket List';
    changeSearch = true;
    $subheadDiv.classList.remove('hidden');
    $switchToBucket.classList.add('white');

    if (data.savedCountries.length < 1) {
      $searchBar.classList.add('hidden');
      $noEntries.classList.remove('hidden');
    } else {
      $noEntries.classList.add('hidden');
      $searchBar.classList.remove('hidden');
      sortAlphabetical(data.savedCountries);
      renderArray(data.savedCountries);
    }
  }

  if (page === 'note') {
    $subhead.textContent = 'Travel Notes';
    $subheadDiv.classList.remove('hidden');
    $searchBar.classList.add('hidden');
    $notesPageContainer.classList.remove('hidden');
    data.page = 'bucketList';
  }

  if (page === 'home') {
    $subheadDiv.classList.add('hidden');
    $switchToHome.classList.add('white');
    $searchBar.classList.remove('hidden');
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
  const $countryClickedElement = event.target.closest('.card');
  if ($countryClickedElement === null) {
    return;
  }

  const countryClickedObject = getCountryFromCCA3($countryClickedElement.getAttribute('data-cca3'));
  if (event.target.getAttribute('id') === 'button-add') {
    const $frontPlanePin = $countryClickedElement.querySelector('.country-front').querySelector('i');
    const $backButtonAdd = $countryClickedElement.querySelector('#button-add');
    const $backButtonNotes = $countryClickedElement.querySelector('#button-notes');

    $backButtonAdd.classList.add('hidden');
    $backButtonNotes.classList.remove('hidden');
    $frontPlanePin.classList.remove('hidden');

    data.savedCountries.push(countryClickedObject);
  } else if (event.target.getAttribute('id') === 'button-notes') {
    renderNote(findSavedCountry(countryClickedObject.cca3));
  } else {
    $countryClickedElement.classList.toggle('is-flipped');
  }
}

function handleEdit(event) {
  if ($notesNotesSaved.textContent === 'No notes saved yet!') {
    $notesNotesSaved.textContent = '';
  }

  $notesInput.textContent = $notesNotesSaved.textContent;
  $notesForm.classList.remove('hidden');
  $notesNotesSaved.classList.add('hidden');
  $notesEditIcon.classList.add('hidden');
}

function handleSave(event) {
  event.preventDefault();

  if ($notesInput.value === '') {
    $notesNotesSaved.textContent = 'No notes saved yet!';
  } else {
    $notesNotesSaved.textContent = $notesInput.value;
  }
  $notesForm.classList.add('hidden');
  $notesNotesSaved.classList.remove('hidden');
  $notesEditIcon.classList.remove('hidden');
  data.currentCountry.notes = $notesNotesSaved.textContent;
  for (let i = 0; i < data.savedCountries.length; i++) {
    if (data.savedCountries[i].cca3 === data.currentCountry.cca3) {
      data.savedCountries[i] = data.currentCountry;
    }
  }

  $notesForm.reset();
}

function cancelEdit() {
  $notesForm.reset();
  $notesForm.classList.add('hidden');
  $notesNotesSaved.classList.remove('hidden');
  $notesEditIcon.classList.remove('hidden');
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
$searchBar.addEventListener('input', handleSearch);
$switchToBucket.addEventListener('click', function () { viewSwap('bucketList'); });
$switchToHome.addEventListener('click', function () { viewSwap('home'); });
$notesEditIcon.addEventListener('click', handleEdit);
$notesForm.addEventListener('submit', handleSave);
document.addEventListener('DOMContentLoaded', getAllCountries);

function findSavedCountry(cca3) {
  for (let i = 0; i < data.savedCountries.length; i++) {
    if (data.savedCountries[i].cca3 === cca3) {
      return data.savedCountries[i];
    }
  }
  return null;
}
