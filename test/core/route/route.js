describe("Route", function() {
  var historyDone = [false, false, false, false];

  describe("History Mode", function() {
    var el = createTestElement("history", "<router-link to='/context.html/test'></router-link><router-view></router-view>");
    var component = null;

    Moon.extend("Root", {
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

    Moon.extend("Test", {
      template: "<h1>Test Route</h1>"
    });

    var router = new MoonRouter({
      "default": "/context.html",
      "map": {
        "/context.html": "Root",
        "/context.html/test": "Test"
      },
      "mode": "history"
    });

    var app = new Moon({
      root: "#history",
      hooks: {
        mounted: function() {
          router.init(this);
        }
      }
    });

    it("should initialize a router view", function() {
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.nodeName).to.equal("H1");
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Message");
        historyDone[0] = true;
      });
    });

    it("should update with data", function() {
      component.set("msg", "Changed");
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Changed");
        historyDone[1] = true;
      });
    });

    it("should navigate with router link", function() {
      el.firstChild.click();
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Test Route");
        expect(el.firstChild.getAttribute("class")).to.equal("router-link-active");
        historyDone[2] = true;
      });
    });

    it("should navigate from code", function() {
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-active");
      router.navigate("/context.html");
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Message");
        expect(el.firstChild.getAttribute("class")).to.equal(null);
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

        Moon.extend("Root", {
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

        Moon.extend("Test", {
          props: ["route"],
          template: "<h1>Test Route {{route.query.queryParam}} {{route.params.namedParam}}</h1>"
        });

        router = new MoonRouter({
          "default": "/",
          "map": {
            "/": "Root",
            "/test/*/:namedParam": "Test"
          }
        });

        app = new Moon({
          root: "#route",
          hooks: {
            mounted: function() {
              router.init(this);
            }
          }
        });

        done();
      });
    });

    it("should initialize a router view", function() {
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.nodeName).to.equal("H1");
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Message");
      });
    });

    it("should update with data", function() {
      component.set("msg", "Changed");
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Changed");
      });
    });

    it("should navigate with router link", function() {
      expect(el.firstChild.getAttribute("class")).to.equal(null);
      el.firstChild.click();
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Test Route true named");
        expect(el.firstChild.getAttribute("class")).to.equal("router-link-active");
      });
    });

    it("should navigate from code", function() {
      expect(el.firstChild.getAttribute("class")).to.equal("router-link-active");
      router.navigate("/");
      return wait(function() {
        expect(el.firstChild.nextSibling.firstChild.innerHTML).to.equal("Root Route Message");
        expect(el.firstChild.getAttribute("class")).to.equal(null);
      });
    });
  });
});
