/** Class representing places in a given area */
class Place {
  /** Constructor stores arguments and creates Google Places object
      @param {object} mapObject - The Google Maps Map object
      @param {object} location - An object containing location information on a place
      @param {callbackFunction} tripCallback - Used to pass array of places back to the Trip object
   */
  constructor(mapObject, location, tripCallback) {
    //Store data
    this.mapObject = mapObject
    this.locationData = {
      name: location.name,
      lat: location.geometry.location.lat(),
      lng: location.geometry.location.lng(),
    };
    this.tripCallback = tripCallback;
    this.selectedPlaces = [];

    //Create Google Places Service object
    this.placesServiceObj = new google.maps.places.PlacesService(this.mapObject);

    //Bind methods
    this.addResultsToList = this.addResultsToList.bind(this);
    // this.fetchInfoForSearchResult = this.fetchInfoForSearchResult.bind(this);

    //Delete this section
    console.log('New Place obj created:', location);
  }

  /** @method onConfirm
      @param none
      Passes selected places back to Trip object
   */
  onConfirm() {
    //Pass selectedPlaces array back to Trip class
    this.tripCallback(this.selectedPlaces);
  }

  /** @method fetchNearbyPlaces
      @param none
      Finds neary places to the given location
   */
  fetchNearbyPlaces() {
    const radius = '15000';
    const placeTypes = ['restaurant', 'lodging', 'natural_feature', 'point_of_interest'];

    //Create Google Places Location & Request objects
    let locationObjToSearch = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
    let request = {
      location: locationObjToSearch,
      radius: radius,
      type: [placeTypes[0]]
    };

    console.log('fetchNearbyPlaces:', locationObjToSearch, request);

    //Searches for places within 15km of location, passes array of search results to callback function
    this.placesServiceObj.nearbySearch(request, this.addResultsToList);
  }

  /** @method addResultsToList
      @param {array} searchResults - Array of place objects
      @param {string} searchStatus - Contains the status of the previous search
      @returns {boolean} false - If searchStatus !== 'OK'
   */
  addResultsToList(searchResults, searchStatus) {
    if (searchStatus !== 'OK') {
      return false;
    }
    for (let resultIndex = 0; resultIndex < 9; resultIndex++) {
      let currentPlaceData = this.fetchInfoForSearchResult(searchResults[resultIndex]);
    }
  }

  /** @method fetchInfoForSearchResult
      @param {object} searchResult - Contains Google Place object
      Fetches additional data about the Google Place object and appends it to the DOM
   */
  fetchInfoForSearchResult(searchResult) {
    let placeListItem = $('<div>').addClass('places__ListItem interstate-light'); //.attr('id', 'restraurants-tab').text('Restaurants found near ' + this.locationData.name + ': ')
    let searchResultData = {};
    let request = {
      placeId: searchResult.place_id,
      fields: ['name', 'place_id', 'formatted_address', 'geometry',
        'url', 'type', 'photos', 'rating', 'user_ratings_total', 'price_level']
    };
    this.placesServiceObj.getDetails(request, function(place, status) {
      if (status === 'OK') {
        for (let i = 0; i < request.fields.length; i++) {
          searchResultData[request.fields[i]] = place[request.fields[i]];
        }
      }
      placeListItem.append($('<div>').addClass('places__ListItem-Name').text(searchResultData.name)); //.text('Result ' + (resultIndex + 1) + ':')
      placeListItem.append($('<div>').addClass('places__ListItem-Address').text(searchResultData.formatted_address));
      placeListItem.append($('<div>').addClass('places__ListItem-Rating').text(`${searchResultData.rating} out of 5 stars ( ${searchResultData.user_ratings_total} reviews)`));
    });

    $('.places__ListContainer').append(placeListItem);
    console.log('fetchingInfoForSearchResult:', searchResultData);
  }

  /** @method renderPlacesPage
      @param none
      Appends the Places HTML structure to the DOM
   */
  renderPlacesPage() {
    const placesDOM =
    $(`
    <div class="places__Container">
        <div class="places__LogoContainer">
          <h2 class="interstate-bold">ROADSTER</h2>
        </div>
        <div class="places__FilterContainer">
          <div class="places__FilterButtons">
            <div class="places__filterButtons-Restaurant">
              <button class="btn btn--white" id="placesRestaurant">Restaurant</button>
            </div>
            <div class="places__FilterButtons-Hotels">
              <button class="btn btn--white" id="placesHotel">Hotels</button>
            </div>
            <div class="places__FilterButtons-Other">
              <button class="btn btn--white" id="placesOther">Other</button>
            </div>
          </div>
          <div class="places__FilterWeather">
          </div>
        </div>
        <div class="places__ListContainer">
        </div>
        <div class="places__Confirm">
          <button class="btn btn--green" >Confirm</button>
        </div>
      </div>
    `);
    $('.main').empty().append(placesDOM);
  }

  selectPlaceResult() {

  }
}
