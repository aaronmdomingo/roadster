$(document).ready(init)

const state = {};

function init(){
  $('#searchBoxGo').on('click', startTrip);
}
let trip;
function startTrip(event){
  event.preventDefault();
  trip = new Trip(state);
  trip.renderRoute();
}

function initAutocomplete(element){
  let autocomplete = new google.maps.places.Autocomplete(
   element, {types: ['geocode']}
  );

  autocomplete.addListener('place_changed', function(){
    state[$(element).attr('data-location')] = autocomplete.getPlace();
  });
}

function autocompleteLoad(){
  initAutocomplete(document.querySelector('#searchBoxStart'));
  initAutocomplete(document.querySelector('#searchBoxEnd'));
}
