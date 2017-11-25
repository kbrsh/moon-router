(function(root, factory) {
  /* ======= Global Moon Router ======= */
  if(typeof module === "undefined") {
    root.MoonRouter = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    //=require ../dist/moon-router.js
    return MoonRouter;
}));
