const map = (instance, routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;
    const parts = route.slice(1).split("/");
    for(var i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentMapState[part] = {};
      currentMapState = currentMapState[part];
    }

    currentMapState["@"] = routes[route];
  }

  return routesMap;
}
