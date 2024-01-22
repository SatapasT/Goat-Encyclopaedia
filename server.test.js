'use strict';

const request = require('supertest');
const app = require('./server');
const path = require('path');
const fs = require('fs');

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
  test('POST /post/signupData succeeds', () => {
    const params = { newthing: 'TechUp' };
    return request(app)
    .post('/post/signupData')
    .send(params)
  .expect(200);
  });
  test('POST /post/loginStatus succeeds', () => {
    const params = { newthing: 'TechUp' };
    return request(app)
    .post('/post/loginStatus')
    .send(params)
  .expect(200);
  });
  for (let i = 0; i < goatList.length; i++) {
    test(`POST /post/${goatList[i]}/uploadPhoto succeeds`, async () => {
      const filePath = path.join('client/assets/images/ufo_goat_emoji.png');
      const fileData = fs.readFileSync(filePath);

      return request(app)
        .post(`/post/${goatList[i]}/uploadPhoto`)
        .attach('photo', fileData, 'ufo_goat_emoji.png')
        .expect(200);
    });
  }
  for (let i = 0; i < goatList.length; i++) {
    test(`POST /post/${goatList[i]}/photoData succeeds`, () => {
      const params = { newthing: 'TechUp' };
      return request(app)
      .post(`/post/${goatList[i]}/photoData`)
      .send(params)
    .expect(200);
    });
  }
  test('POST /post/like succeeds', () => {
    const params = {
      name: 'GoatLover21',
      date: '13/1/2024',
      time: '18:41:24',
      currentUser: 'test_user'
    };
    return request(app)
      .post('/post/like')
      .send(params)
      .expect(200);
  });
  server.close();
});
