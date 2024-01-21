'use strict';

const request = require('supertest');
const app = require('./server');
let server = app.listen(8080, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

describe('Test the custom server endpoints', () => {
  const goatList = ['default_goat', 'kiko_goat', 'pygora_goat', 'angora_goat', 'pygmy_goat'];
  const orderingList = ['time_old', 'time_new', 'descending', 'ascending'];
  for (let i = 0; i < goatList.length; i++) {
    test(`GET /goatData/${goatList[i]} succeeds`, () => {
      return request(app)
        .get(`/goatData/${goatList[i]}`)
        .expect('Content-type', /json/);
    });
  }
  for (let i = 0; i < goatList.length; i++) {
    test(`GET /imageData/${goatList[i]} succeeds`, () => {
      return request(app)
        .get(`/imageData/${goatList[i]}`)
        .expect('Content-type', /json/);
    });
  }
  for (let i = 0; i < goatList.length; i++) {
    for (let j = 0; j < orderingList.length; j++) {
      test(`GET /commentData/${goatList[i]}/${orderingList[j]} succeeds`, () => {
        return request(app)
          .get(`/commentData/${goatList[i]}/${orderingList[j]}`)
          .expect('Content-type', /json/);
      });
    }
  }
server.close();
});
