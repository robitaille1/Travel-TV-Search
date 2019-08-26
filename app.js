'use strict';

const searchUrl = 'http://api.tvmaze.com/shows';
let searchInput = '';



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
              let showList = [];
              let programList = [];
              showList.push(`${responseJson[i].id}`);
              findAllEpisodes(showList);
            }
        }
    })
    .catch(err => {
      $('#js-results').append(`There was an error. Please try again`);
    });

}

function findAllEpisodes(id) {
  const episodeUrl = 'http://api.tvmaze.com/shows/'+ id + '/episodes'
  fetch(episodeUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    for(var i = 0; i < responseJson.length; i++){
      if(responseJson[i].name.includes(searchInput) === true){
        displayResults(responseJson[i].name)
      } 
    }
  })
}



function displayResults(titles) {
    $('.js-display-list').append(`
    <li>${titles}</li>
  `)
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      searchInput = $('#js-search-query').val();
      loopPages();
    });
  }

$(watchForm);