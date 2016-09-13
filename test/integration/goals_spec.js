describe('goals', function() {

  describe('GET /goals', function() {
    it('returns all existing goals', function(done) {
      request
        .get('/goals')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.length(1);
          done(err);
        });
    });
  });
});
