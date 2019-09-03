'use strict';

let searchInput = '';
const mapMarkers = [];

//Create Google Map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 37.0902, lng: 95.7129},
    disableDefaultUI: true
  });
  var geocoder = new google.maps.Geocoder();

  $('#js-btn').on('click', (event => {
    event.preventDefault();
    geocodeAddress(geocoder, map);
  }))
}

function geocodeAddress(geocoder, resultsMap) {
  var address = searchInput;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      $('#map').removeClass('hidden');
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      mapMarkers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function removeMarkers(){
  for(var i = 0; i < mapMarkers.length; i++){
      mapMarkers[i].setMap(null);
  }
}

function loopStore() {
  STORE.sort(dynamicSort("title"));
  for(let i = 0; i < STORE.length; i++){
    findAllEpisodes(STORE[i]);
  }
}

//Take the travel show ids and use them to find all the episodes for that show
//If the episode name contains the user search input, then display that episode
function findAllEpisodes(shows) {
  const episodeUrl = 'https://api.tvmaze.com/shows/'+ shows.id + '/episodes'
  fetch(episodeUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.error);

  })
  .then(responseJson => {
    for(var i = 0; i < responseJson.length; i++){
      var episodeTitle = responseJson[i].name.toUpperCase();
      var userSearch = searchInput.toUpperCase();
      if(episodeTitle.includes(userSearch) === true){
        let fullOutput = [];
        fullOutput.push(`${shows.title}`)
        fullOutput.push(`${responseJson[i].name}`)
        fullOutput.push(`${responseJson[i].url}`)
        displayResults(fullOutput);
      }  else {
        displayError();
      }
    }
  })
  .catch(err => {
    $('#js-results').append(`There was an error. Please try again`);
  });
}

function displayResults(titles) {
  $('.js-display-list').append(`
    <li class='search-results'><span class='bold'>${titles[0]}</span> - ${titles[1]} <a target="_blank" rel="noopener noreferrer" href='${titles[2]}'>More Info</a></li>
  `)
  $('#results-div').removeClass('hidden');
  $('#results-div').addClass('show-results-padding');
  $('#js-error').addClass('hidden');
}

function displayError() {
  if($('.js-display-list li').length === 0) {
    $('#results-div').addClass('hidden');
    $('#js-error').removeClass('hidden');
  } else {
    $('#js-error').addClass('hidden');
    $('#results-div').removeClass('hidden');
  }
}

function watchForm() {
  $('#js-btn').on('click', (event => {
    event.preventDefault();
    searchInput = $('#js-search-query').val();
    $('.js-display-list').empty();
    loopStore();
    scrollResults();
    removeMarkers();
  }));
}

function scrollResults () {
  $('html, body').animate({
      scrollTop: $("#js-search-results").offset().top
  }, 1000);
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      if(sortOrder == -1){
          return b[property].localeCompare(a[property]);
      }else{
          return a[property].localeCompare(b[property]);
      }        
  }
}

$(watchForm);