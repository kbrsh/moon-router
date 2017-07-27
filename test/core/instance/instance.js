describe("Instance", function() {
  describe('Initializing', function() {
    it('with new', function() {
      expect(new MoonRouter({default: "/", map: {"/": "Root"}}) instanceof MoonRouter).to.equal(true);
    });
  });
});
