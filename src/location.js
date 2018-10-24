const iplocation = require("iplocation").default;
const publicIp = require("public-ip");

async function latLong() {
  const ip = await publicIp.v4();
  const location = await iplocation(ip);
  return { lat: location.latitude, long: location.longitude };
}

async function cityState() {
  const ip = await publicIp.v4();
  const location = await iplocation(ip);
  return `${location.city}, ${location.regionCode}`;
}

module.exports = { latLong, cityState };
