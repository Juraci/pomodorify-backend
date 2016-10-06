import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;
