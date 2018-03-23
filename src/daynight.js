'use strict';

const log = require('./log');

const SunCalc = require('suncalc');

var mode = 'day';

module.exports.setMode = (lat, lng) => {
    var date = new Date();//'2018-03-16T23:59:59.000Z');
    var sunTimes = SunCalc.getTimes(date, lat, lng);
    log.info('Current date and time is:' + date + '\nTime for sunset is:' + sunTimes.sunset);
  
    if (date > sunTimes.sunriseEnd && date < sunTimes.sunset){
      mode = "day";
      log.info('The sun is up.');
      //tileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    }else{
      mode = "night";
      log.info('The sun is down. Or error.');
    }

    return mode;
}

module.exports.getMode = () => {
    return mode;
}