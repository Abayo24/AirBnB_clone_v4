/* global $ */

$(document).ready(function () {
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  /* Function to update the UI with selected amenities */
  function updateAmenities () {
    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  }

  /* Listen to changes on input checkbox tags for amenities */
  $('.amenities input[type="checkbox"]').change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');

    if ($(this).prop('checked')) {
      selectedAmenities[id] = name;
    } else {
      delete selectedAmenities[id];
    }

    updateAmenities();
  });

  /* Update API status on page load */
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  /* Handle search button click */
  $('button').click(function () {
    const requestData = {
      amenities: Object.keys(selectedAmenities),
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities)
    };

    /*  Make POST request to places_search endpoint */
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify(requestData),
      success: function (data) {
        $('.places').empty();
        data.forEach(function (place) {
          const placeHTML = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guests</div>
                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>
          `;
          $('.places').append(placeHTML);
        });
      },
      error: function (error) {
        console.error('Error fetching places:', error);
      }
    });
  });
});
