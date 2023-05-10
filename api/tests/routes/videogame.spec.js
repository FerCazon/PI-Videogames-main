/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Videogame, conn } = require('../../src/db.js');

const agent = session(app);
const videogame = {
  name: 'Super Mario Bros',
  description: 'This is a description',
  platforms: ['platform1', 'platform2'],
};

describe('Videogame routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  let createdGame;
  beforeEach(async () => {
    await Videogame.sync({ force: true });
    createdGame = await Videogame.create(videogame);
  });
  describe('GET /games/:id', () => {
    it('should get 200', (done) => {
      agent.get(`/games/${createdGame.id}`).expect(200).end(done);
    });
    it('should return the correct videogame', (done) => {
      agent.get(`/games/${createdGame.id}`)
        .then((res) => {
          expect(res.body.name).to.equal(videogame.name);
          expect(res.body.description).to.equal(videogame.description);
          expect(res.body.platforms).to.eql(videogame.platforms);
          done();
        })
        .catch((err) => done(err));
    });
  });
});