'use strict';
























function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const querySearch = $('#js-search-query').val();
    });
  }

$(watchForm);