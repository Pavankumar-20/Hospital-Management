/* beehiiv Pixel */
!function (f, b, e, h, i, v) {
  if (f.bhpx) return;
  i = f.bhpx = function () {
    i.callMethod ?
      i.callMethod.apply(i, arguments) : i.queue.push(arguments)
  };
  if (!f._bhpx) f._bhpx = i;
  i.push = i; i.loaded = !0; i.version = '1.0';
  i.queue = [];

  v = b.createElement(e); v.async = !0;
  v.type = 'module';
  v.src = 'https://beehiiv-adnetwork-production.s3.amazonaws.com/pixel-v2.js';
  h = b.getElementsByTagName(e)[0];
  h.parentNode.insertBefore(v, h);
}(window, document, 'script');
