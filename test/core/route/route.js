describe("Route", function() {
  describe("Initialize", function() {
    var el = createTestElement("initialize", "<router-view></router-view>");
    var component = null;

    Moon.component("Root", {
      template: "<h1>Root Route {{msg}}</h1>",
      data: function() {
        return {
          msg: "Message"
        }
      },
      hooks: {
        mounted: function() {
          component = this;
        }
      }
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
        expect(el.firstChild.innerHTML).to.equal("Root Route Message");
      });
    });

    it("should update with data", function() {
      component.set("msg", "Changed");
      return wait(function() {
        expect(el.firstChild.innerHTML).to.equal("Root Route Changed");
      });
    });
  });
});
