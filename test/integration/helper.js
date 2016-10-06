import app from '../../app.js';
import request from 'supertest';
import chai from 'chai';

global.app = app;
global.request = request(app);
global.expect = chai.expect;
