/*
 * IFrameTransport - Storage Client Extension
 *
 * Use a cookie to capture which key changed for IE8
 * Use a cookie to ignore "storage" events that I triggered
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) define('ift-client-storage-compat', ['localstorage-events', 'ift-client-storage'], factory);
  else if (typeof exports === 'object') module.exports = factory(require('localstorage-events'), require('./storage'));
  else root.ift = factory(root.LSEvents, root.ift);
}(this, function(LSEvents, ift) {

  var support = ift.support,
      mixin = ift.util.mixin;

  mixin(support, {
    myWritesTrigger: ('onstoragecommit' in document)
  });

  // Only override the Storage child if necessary.
  if (!support.myWritesTrigger) return ift;

  ift.childClient('storage', function(__super__) {

    return {

      constructor: function(transport, storage) {
        __super__.apply(this, arguments);
        var child = this;
        this.storage = new LSEvents(this.storage, function() {
          child.onStorage.apply(child, arguments);
        });
      },

      // `LSEvents` will handle "storage" events for us.
      listen: function() {}

    };

  });

  return ift;

}));
