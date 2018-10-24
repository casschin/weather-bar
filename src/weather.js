require("es6-promise").polyfill();
require("isomorphic-fetch");

const { DARK_SKY_API_KEY } = require("./config");
const BASE_URL = "https://api.darksky.net/forecast";

async function get(lat, long) {
  const response = await fetch(
    `${BASE_URL}/${DARK_SKY_API_KEY}/${lat},${long}`
  );
  const json = await response.json();
  return json;
}

module.exports = { get };
