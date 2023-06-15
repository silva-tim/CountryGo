/* exported data */
let data = {
  savedCountries: [],
  page: 'home'
};

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data', dataJSON);
});

const previousDataJSON = localStorage.getItem('data');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}
