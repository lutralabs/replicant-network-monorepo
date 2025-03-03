import http from 'k6/http';

export const options = {
  vus: 1000, // number of virtual users
  duration: '30s', // duration of the test
};

export default function () {
  http.get(`${__ENV.API_ENDPOINT}/v1/models`);
}
