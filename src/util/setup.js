const setup = (instance, mode) => {
  let getPath;
  let navigate;
  let custom = false;

  if(mode === undefined || mode === "hash") {
    // Setup Path Getter
    getPath = function() {
      return window.location.hash.substring(1);
    }

    // Create navigation function
    navigate = function(route) {
      window.location.hash = '#' + route;
      run(instance, route);
    }

    // Add hash change listener
    window.addEventListener("hashchange", function() {
      run(instance, instance.getPath());
    });
  } else if(mode === "history") {
    // Setup Path Getter
    getPath = function() {
      return window.location.pathname;
    }

    // Create navigation function
    navigate = function(route) {
      history.pushState(null, null, route);
      run(instance, route);
    }

    // Create listener
    custom = true;
    window.addEventListener("popstate", function() {
      run(instance, instance.getPath());
    });
  }

  instance.getPath = getPath;
  instance.navigate = navigate;
  instance.custom = custom;
}
