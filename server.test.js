'use strict';

const request = require('supertest');
const app = require('./server');
const fs = require('fs');

const server = app.listen(8080, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

describe('Test the custom server endpoints', () => {
  const goatList = ['default_goat', 'kiko_goat', 'pygora_goat', 'angora_goat', 'pygmy_goat'];
  const orderingList = ['time_old', 'time_new', 'descending', 'ascending'];

  test(`GET /goatData succeeds`, () => {
    return request(app)
      .get(`/goatData`)
      .expect(200);
  });

  for (let i = 0; i < goatList.length; i++) {
    test(`GET /goatData?species=${goatList[i]} succeeds`, () => {
      return request(app)
        .get(`/goatData?species=${goatList[i]}`)
        .expect('Content-type', /json/);
    });
  }

  test(`GET /imageData succeeds`, () => {
    return request(app)
      .get(`/imageData`)
      .expect(200);
  });

  for (let i = 0; i < goatList.length; i++) {
    test(`GET /imageData?species=${goatList[i]} succeeds`, () => {
      return request(app)
        .get(`/imageData?species=${goatList[i]}`)
        .expect('Content-type', /json/);
    });
  }

  test(`GET /commentData succeeds`, () => {
    return request(app)
      .get(`/commentData`)
      .expect(200);
  });
  for (let i = 0; i < goatList.length; i++) {
    for (let j = 0; j < orderingList.length; j++) {
      test(`GET /commentData?species=${goatList[i]}&ordering=${orderingList[j]} succeeds`, () => {
        return request(app)
          .get(`/commentData?species=${goatList[i]}&ordering=${orderingList[j]}`)
          .expect('Content-type', /json/);
      });
    }
  }

  test('POST /post/signupData succeeds', () => {
    const newUser = { username: 'newUser', password: 'password123' };
    return request(app)
    .post('/post/signupData')
    .send(newUser)
  .expect(200);
  });

  test('POST /post/loginStatus succeeds', () => {
    const data = { username: 'test', password: 'test' };
    return request(app)
    .post('/post/loginStatus')
    .send(data)
  .expect(200);
  });

  for (let i = 0; i < goatList.length; i++) {
    test(`POST /post/uploadImage?species=${goatList[i]} succeeds`, async () => {
      const filePath = 'client/assets/images/ufo_goat_emoji.png';
      const fileData = fs.readFileSync(filePath);

      return request(app)
        .post(`/post/uploadImage?species=${goatList[i]}`)
        .attach('photo', fileData, 'ufo_goat_emoji.png')
        .expect(200);
    });
  }

  for (let i = 0; i < goatList.length; i++) {
    test(`POST /post/imageData?species=${goatList[i]} succeeds`, () => {
      const imgInfo = { image: null, uploader: null };
      return request(app)
      .post(`/post/imageData?species=${goatList[i]}`)
      .send(imgInfo)
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
