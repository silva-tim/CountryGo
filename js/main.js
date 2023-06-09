let countries = null;

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

function renderCountries() {

}
