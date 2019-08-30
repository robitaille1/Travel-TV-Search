'use strict';

let searchInput = '';

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 37.0902, lng: 95.7129}
  });
  var geocoder = new google.maps.Geocoder();

  $('form').submit(event => {
    event.preventDefault();
    geocodeAddress(geocoder, map);
  });
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
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function loopStore() {
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
      } 
    }
  })
  .catch(err => {
    $('#js-results').append(`There was an error. Please try again`);
  });
}

function displayResults(titles) {
    $('.js-display-list').append(`
    <li><span class='bold'>${titles[0]}</span> - ${titles[1]} <a target="_blank" rel="noopener noreferrer" href='${titles[2]}'>More Info</a></li>
  `)
  $('#js-search-results').removeClass('hidden');
}

function displayError() {
  $('#js-search-results').removeClass('hidden');
  $('.js-results').append(`<h2>Could not find a matching show - Please try again!</h2>`);
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      searchInput = $('#js-search-query').val();
      $('.js-display-list').empty();
      loopStore();
    });
  }

$(watchForm);