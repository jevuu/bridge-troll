'use strict';

// Using Material Icons as inline SVG - https://material.io/icons/

const leaflet = require('leaflet');
const fs = require('fs');

/**
 * Given SVG content generate a data URL. If you're not familiar with
 * Data URLs, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 */
const generateSvgUrl = svg => {
  let base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
};

// Read contents of SVG files from bundle
const locationSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/location.svg'
);
const lockedSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/locked.svg'
);
const unlockedSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/unlocked.svg'
);

const locationNightSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/location_night.svg'
);
const lockedNightSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/locked_night.svg'
);
const unlockedNightSvg = fs.readFileSync(
  __dirname + '/../icons/material-icons/unlocked_night.svg'
);

// Generate Data URLs for each, so we can pass them to Leaflet below
const locationUrl = generateSvgUrl(locationSvg);
const lockedUrl = generateSvgUrl(lockedSvg);
const unlockedUrl = generateSvgUrl(unlockedSvg);
const locationNightUrl = generateSvgUrl(locationNightSvg);
const lockedNightUrl = generateSvgUrl(lockedNightSvg);
const unlockedNightUrl = generateSvgUrl(unlockedNightSvg);

// All icons share the same size, define it once
const iconSize = [25, 25];

// Expose custom Leaflet Icons to be used in our markers
module.exports.location = leaflet.icon({
  iconUrl: locationUrl,
  iconSize
});

module.exports.locked = leaflet.icon({
  iconUrl: lockedUrl,
  iconSize
});

module.exports.unlocked = leaflet.icon({
  iconUrl: unlockedUrl,
  iconSize
});

module.exports.locationNight = leaflet.icon({
  iconUrl: locationNightUrl,
  iconSize
});

module.exports.lockedNight = leaflet.icon({
  iconUrl: lockedNightUrl,
  iconSize
});

module.exports.unlockedNight = leaflet.icon({
  iconUrl: unlockedNightUrl,
  iconSize
});