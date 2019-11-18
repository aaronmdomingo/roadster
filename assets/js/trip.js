/** Class representing the trip as a whole throughout the application */
class Trip {
  /** Constructor creates necessary properties and creates/renders Route object
      @param {object} locations - Contains start and end locations
   */
  constructor(locations) {
    this.routeCallback = this.routeCallback.bind(this);
    this.placesCallback = this.placesCallback.bind(this);

    this.map = null;
    this.waypoints = [];

    this.route = new Route(locations, this.routeCallback);
    this.renderRoute();
  }

  /** @method routeCallback
      @param {array} waypoints - Contains waypoint objects
      @param {object} map - Google Maps Map object
      Creates Places & Weather objects and renders places
   */
  routeCallback(waypoints, map) {
    this.waypoints = waypoints;
    this.map = map;
    this.places = new Place(this.map, this.waypoints, this.placesCallback);
    this.weather = new Weather(this.waypoints);

    // Render places page once
    this.renderEntirePlace();

    $('#accordion').accordion({
      heightStyle: 'fill',
      animate: {
        easing: 'linear',
        duration: 100
      }
    });
  }

  /** @method renderRoute
      @param none
      Calls render method on route object
   */
  renderRoute() {
    this.route.render();
  }

  /** @method placesCallback
      @param none
   */
  placesCallback(placesArray) {
    const main = $('.main');
    let container = $('<div>').addClass('final__Container');
    main.empty();
    main.append(container);
    container.append($('<div>').text('ROADSTER').addClass('final__Logo'));
    container.append($('<div>').text('Your Trip').addClass('trip'));
    container.append($('<div>').addClass('final__List'));
    container.append($('<div>').addClass('final__Button'));
    for(let i = 1; i < placesArray.length; i++){
      let placeContainer = $('<div>').addClass('place__Container');
      let name = placesArray[i].waypointName;
      let heading = $('<h1>').html(name);
      let ul = $('<ul>')
      for (var j = 0 ; j < placesArray[i].waypointSelectedPlaces.length ; j++) {
        let a = $('<a>').attr('href', placesArray[i].waypointLinks[j]).text(placesArray[i].waypointSelectedPlaces[j]).attr('target', '_BLANK');
        let li = $('<li>').html(a);
        ul.append(li);
      }
      placeContainer.append(heading, ul);
      $('.final__List').append(placeContainer);
      let button = $('<button>').addClass('btn btn--green').text('Print').click(function() { window.print() });
      $('.final__Button').append(button)
    }
  }

  /** @method renderPlaces
     @param none
    Calls fetchNearbyPlaces & renderPlacesPage methods on places object
  */
  renderEntirePlace() {
    this.places.renderPlacesPage();
    this.places.fetchNearbyPlaces();
  }
}
