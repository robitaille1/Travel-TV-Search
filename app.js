'use strict';

const searchUrl = 'http://api.tvmaze.com/shows';
const episodeUrl = 'http://api.tvmaze.com/episodes/';
let currentPage = 0;


while(currentPage <= 173){
    findAllShows();
    currentPage++;
}



function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function findAllShows() {
    const params = {
      page: currentPage,
    };
    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;
  
    // console.log(url);

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        for(var i = 0; i < responseJson.length; i++){
            if(responseJson[i].genres[0] === "Food" && responseJson[i].genres[1] === "Travel"){
                console.log(`${responseJson[i].name} - ${responseJson[i].id}`);
            }
        }
    })
    .catch(err => {
      $('#js-results').append(`There was an error. Please try again`);
    });
}


function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const querySearch = $('#js-search-query').val();
      findAllShows();
    });
  }

$(watchForm);