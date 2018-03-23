'use strict';

const log = require('./log');

const EventEmitter = require('events');
module.exports = new EventEmitter();

const leaflet = require('leaflet');
const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

const svgMarker = require('./svg-marker');

const dayNight = require('./daynight');

let map;
let currentLocationMarker;
let mode;
// TODO: I'm not sure what the ideal zoom level is.  Leaflet often uses 13
// in docs and tutorials.  14 seems to provide a bit more context
// We need something that makes sense for the scale of bridges
// and a person/car/vehicle moving between them.
const zoomLevel = 16;

const onMapUpdated = () => {
  let bounds = map.getBounds();
  log.debug('map update event', bounds);
  module.exports.emit('update', bounds);
};

/**
 * Creates the map and positions the location marker
 * @param {*} lat
 * @param {*} lng
 */
module.exports.init = (lat, lng) => {
  // http://leafletjs.com/reference-1.3.0.html#map
  map = leaflet.map('map', {
    // Disable zoom, pan, and other manual interaction methods.
    zoomControl: false,
    boxZoom: false,
    dragging: false,
    doubleClickZoom: false,
    keyboard: false,
    scrollWheelZoom: false,
    touchZoom: false
  });

  dayNight.setMode(lat,lng);

  // http://leafletjs.com/reference-1.3.0.html#map-event
  map.on('viewreset', onMapUpdated);
  map.on('moveend', onMapUpdated);
  map.on('click', e => module.exports.emit('click', e));
  map.on('dblclick', e => module.exports.emit('dblclick', e));
  
  //Set tileUrl based on time of day.
  let tileUrl = (dayNight.getMode() == 'day')
                ? 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                : 'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png';
  
  /*--
  //Get date and sunrise and sunset times. Compare current time against sunrise and sunset times. Set to night mode.
  var date = new Date('2018-03-16T23:59:59.000Z');
  var sunTimes = SunCalc.getTimes(date, lat, lng);
  log.info('Current date and time is:' + date + '\nTime for sunset is:' + sunTimes.sunset);
  if (date > sunTimes.sunriseEnd && date < sunTimes.sunset){
    log.info('The sun is up.');
    tileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  }else{
    log.info('The sun is down. Or error.');
  }
  --*/

  leaflet.tileLayer(tileUrl, { attribution }).addTo(map);

  map.setView([lat, lng], zoomLevel);

  // Show a marker at our current location. Change icon based on time of day.
  if(dayNight.getMode() == 'day'){
    currentLocationMarker = leaflet
      .marker([lat, lng], {
        title: 'Current Location',
        icon: svgMarker.location
      })
      .addTo(map);
  }else{
    currentLocationMarker = leaflet
    .marker([lat, lng], {
      title: 'Current Location',
      icon: svgMarker.locationNight
    })
    .addTo(map);
  }

  log.info('Map initialized with centre lat=' + lat + ' lng=' + lng);
};

/**
 * Adds and returns a marker to the map.
 */
module.exports.addMarker = (lat, lng, title, icon, onClick) => {
  let marker = leaflet
    .marker([lat, lng], {
      title,
      icon
    })
    .addTo(map);

  // Wire-up a click handler for this marker
  if (onClick) {
    marker.on('click', onClick);
  }

  log.debug(`Added marker title=${title} at lat=${lat}, lng=${lng}`);

  return marker;
};

/**
 * Re-centre the map and update location marker
 */
module.exports.setCurrentLocation = (lat, lng) => {
  currentLocationMarker.setLatLng({ lat, lng });
  map.setView([lat, lng], zoomLevel);
  log.debug(`Moved current location marker to lat=${lat}, lng=${lng}`);
};
