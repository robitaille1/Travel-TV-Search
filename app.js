'use strict';

const searchUrl = 'http://api.tvmaze.com/shows';
let searchInput = '';

//Loop Through all show pages from the API
function loopPages() {
  let currentPage = 0;
  while(currentPage <= 173){
    findAllShows(currentPage);
    currentPage++;
  }
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

//Loop through each show page and find the show ID for any travel shows
function findAllShows(currentPage) {
    const params = {
      page: currentPage,
    };
    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        for(var i = 0; i < responseJson.length; i++){
            if(responseJson[i].genres[0] === "Travel" || responseJson[i].genres[1] === "Travel"){
              // let showList = [];
              let programList = [];
              // showList.push(`${responseJson[i].id}`);
              programList.push(`${responseJson[i].id}`);
              programList.push(`${responseJson[i].name}`)
              // findAllEpisodes(showList);
              findAllEpisodes(programList)
            }
        }
    })
    .catch(err => {
      $('#js-results').append(`There was an error. Please try again`);
    });

}

//Take the travel show ids and use them to find all the episodes for that show
//If the episode name contains the user search input, then display that episode
function findAllEpisodes(id) {
  const episodeUrl = 'http://api.tvmaze.com/shows/'+ id[0] + '/episodes'
  fetch(episodeUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    for(var i = 0; i < responseJson.length; i++){
      var episodeTitle = responseJson[i].name.toUpperCase();
      var userSearch = searchInput.toUpperCase();
      if(episodeTitle.includes(userSearch) === true){
        let fullOutput = [];
        fullOutput.push(`${id[1]}`)
        fullOutput.push(`${responseJson[i].name}`)
        // displayResults(responseJson[i].name)
        displayResults(fullOutput);
      } 
    }
  })
}

function displayResults(titles) {
    $('.js-display-list').append(`
    <li>${titles[0]} - <span class='bold'>${titles[1]}</span></li>
  `)
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      searchInput = $('#js-search-query').val();
      $('.js-display-list').empty();
      loopPages();
    });
  }

$(watchForm);