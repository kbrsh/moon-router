(function(root, factory) {
  /* ======= Global Moon Router ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.MoonRouter = factory();
}(this, function() {
    //=require ../dist/moon-router.js
    return MoonRouter;
}));
