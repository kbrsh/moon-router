describe("Route", function() {
  var historyDone = [false, false, false, false];

  describe("History Mode", function() {
    var el = createTestElement("history", "<router-link to='/test' class='router-link-class'></router-link><router-view></router-view>");
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

    var base = window.location.pathname;

    if(base[base.length - 1] === "/") {
      base = base.slice(0, -1);
    }

    var router = new MoonRouter({
      default: "/",
      map: {
        "/": "Root",
        "/test": "Test"
      },
      mode: "history",
      base: base
    });

    var app = new Moon({
      el: "#history",
      router: router
    });

    it("should initialize a router view", function() {
      return wait(function() {
        expect(el.firstChild.nextSibling.nodeName).to.equal("H1");
        expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Message");
        historyDone[0] = true;
      });
    });

    it("should update with data", function() {
      component.set("msg", "Changed");
      return wait(function() {
        expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Changed");
        historyDone[1] = true;
      });
    });

    it("should navigate with router link", function() {
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-class");
      el.firstChild.click();
      return wait(function() {
        expect(el.firstChild.nextSibling.innerHTML).to.equal("Test Route");
        expect(el.firstChild.getAttribute("class")).to.equal("router-link-class router-link-active");
        historyDone[2] = true;
      });
    });

    it("should navigate from code", function() {
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-class router-link-active");
      router.navigate("/");
      return wait(function() {
        expect(el.firstChild.nextSibling.innerHTML).to.equal("Root Route Message");
        expect(el.firstChild.getAttribute("class")).to.equal("router-link-class");
        historyDone[3] = true;
      });
    });
  });

  describe("Hash Mode", function() {
    var el = null;
    var component = null;
    var router = null
    var app = null;

    // Poll to ensure history tests are done
    var checkHistory = function(done) {
      if(historyDone[0] === true && historyDone[1] === true && historyDone[2] === true && historyDone[3] === true) {
        window.removeEventListener("popstate");
        done();
      } else {
        setInterval(function() {
          checkHistory(done);
        }, 500);
      }
    }

    before(function(done) {
      checkHistory(function() {
        el = createTestElement("route", "<router-link to='/test/wildcard/named?queryParam=true' class='router-link-class'></router-link><router-view></router-view>");
        component = null;

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
          props: ["route"],
          template: "<h1>Test Route {{route.query.queryParam}} {{route.params.namedParam}}</h1>"
        });

        router = new MoonRouter({
          default: "/",
          map: {
            "/": "Root",
            "/test/*/:namedParam": "Test"
          }
        });

        app = new Moon({
          el: "#route",
          router: router
        });

        done();
      });
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
        expect(el.firstChild.nextSibling.innerHTML).to.equal("Test Route true named");
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
});
