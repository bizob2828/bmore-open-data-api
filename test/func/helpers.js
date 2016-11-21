'use strict';
const request = require('./request');
const baseUrl = '/api/restaurants';

module.exports.getRestaurants = (page, station) => {
  let url = `${baseUrl}?page=${page || 1}`;
  if (station) {
    url += `&station_id=${station}`;
  }

  return request('get', url);

};

module.exports.createRestaurant = (name) => {
  let opts = {
    name: name,
    zip: 21211,
    address: '616 w 33rd St',
    station_id: 8,
    hood: 'Wyman Park'
  };

  return request('post', baseUrl, opts);

};
