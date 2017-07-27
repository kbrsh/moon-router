describe("Route", function() {
  describe("Initialize", function() {
    var el = createTestElement("initialize", "<router-view></router-view>");

    Moon.component("Root", {
      template: "<h1>Root Route</h1>"
    });

    var router = new MoonRouter({
      default: "/",
      map: {
        "/": "Root"
      }
    });

    var app = new Moon({
      el: "#initialize",
      router: router
    });

    it("should initialize a router view", function() {
      return wait(function() {
        expect(el.firstChild.nodeName).to.equal("H1");
        expect(el.firstChild.innerHTML).to.equal("Root Route");
      });
    });
  });
});
