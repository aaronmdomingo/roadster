class Weather {
  constructor(location) {
    console.log(location)
    this.renderWeatherData = this.renderWeatherData.bind(this);
    this.obtainWeatherData = this.obtainWeatherData.bind(this);
    this.location = {
      lat: location.geometry.location.lat(),
      lng: location.geometry.location.lng()
    }
    this.locationName = location.address_components[0].long_name;
    this.dailyWeather = {};
    this.currentWeather = {}
    this.processWeatherData();
  }
  processWeatherData() {
    const weatherData = {
      method: 'GET',
      url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c8c585560e5f64a47e3b64cd50e74e26/${this.location.lat},${this.location.lng}`,
      success: this.obtainWeatherData,
      error: function(error) {
        console.log(error)
      }
    }
    $.ajax(weatherData);
  }
  obtainWeatherData(weather) {
    this.dailyWeather = weather.daily;
    this.currentWeather = weather.currently;
    this.renderWeatherData();
  }
  renderWeatherData() {
    const weatherSummary = this.dailyWeather.summary;
    const weatherNow = this.currentWeather.apparentTemperature;
    const weatherIcon = this.currentWeather.icon;
    const endLocation = this.locationName;

    console.log('Daily Data', this.dailyWeather);
    console.log('Current Weather', this.currentWeather);
  }
}
