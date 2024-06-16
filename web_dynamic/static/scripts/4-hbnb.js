/* global $ */

$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').change(() => {
    if (this.checked) {
      selectedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete selectedAmenities[$(this).attr('data-id')];
    }

    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(selectedAmenities) }),
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
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
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
