const NodeGeocoder = require('node-geocoder');

const options = {

  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'EhXyk8jio4EgZ7ULxfTFPoArE71uETCG',
  formatter: null

}

const geocoder = NodeGeocoder(options);

module.exports = geocoder;