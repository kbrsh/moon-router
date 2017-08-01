describe("Route", function() {
  var el = createTestElement("route", "<router-link to='/test' class='router-link-class'></router-link><router-view></router-view>");
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

  Moon.component("Test", {
    template: "<h1>Test Route</h1>"
  });

  var router = new MoonRouter({
    default: "/",
    map: {
      "/": "Root",
      "/test": "Test"
    }
  });

  var app = new Moon({
    el: "#route",
    router: router
  });

  it("should initialize a router view", function() {
    return wait(function() {
      expect(el.firstChild.nextSibling.nodeName).to.equal("H1");
      expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Message");
    });
  });

  it("should update with data", function() {
    component.set("msg", "Changed");
    return wait(function() {
      expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Changed");
    });
  });

  it("should navigate with router link", function() {
    expect(el.firstChild.getAttribute("class")).to.equal("router-link-class");
    el.firstChild.click();
    return wait(function() {
      expect(el.firstChild.nextSibling.innerHTML).to.equal("Test Route");
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-class router-link-active");
    });
  });

  it("should navigate from code", function() {
    expect(el.firstChild.getAttribute("class")).to.equal("router-link-class router-link-active");
    router.navigate("/");
    return wait(function() {
      expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Message");
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-class");
    });
  });
});
