/* Reddit Pixel */
(function (w, d) {
  if (!w.rdt) {
    const p = (w.rdt = function () {
      p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
    });
    p.callQueue = [];
    const t = d.createElement('script');
    t.src = 'https://www.redditstatic.com/ads/pixel.js';
    t.async = true;
    const s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  }
})(window, document);
rdt('init', 'a2_i2o67kkx30uo');
rdt('track', 'PageVisit');
