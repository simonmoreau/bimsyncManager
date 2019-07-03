var bimsync = bimsync || {};

!function(bimsync, $) {

  var host = bimsync.viewer2dhost === undefined ? 'https://bimsync.com' : bimsync.viewer2dhost;
  var javascripts = ['/js/viewer2d/viewer2d-api.js'];
  var stylesheets = ['/css/viewer2d.css'];

  var loaded = false;
  var onLoadCallback = undefined;

  bimsync.loadViewer2d = function() {
    for (var i in stylesheets) {
        $('<link/>', {
            rel : 'stylesheet',
            type: 'text/css',
            href: host + stylesheets[i]
        }).appendTo('head');
    }
    var javascriptsLoaded = 0;
    for (var i in javascripts) {
      $.getScript(host + javascripts[i], function() {
        javascriptsLoaded++;
        if (javascriptsLoaded === javascripts.length) {
          loaded = true;
          if (onLoadCallback !== undefined) {
            onLoadCallback.call(null);
          }
        }
      });
    }
  };

  bimsync.setOnViewer2dLoadCallback = function(callback) {
    onLoadCallback = callback;
    if (loaded) {
      onLoadCallback.call(null);
    }
  }

  function loadUrl($viewer2d) {
    $viewer2d.viewer2d($viewer2d.data());
    var url = $viewer2d.data('url');
    $viewer2d.viewer2d('loadurl', url);
  }

  $(function (event) {
    var $viewer2dList = $('[data-viewer2d="svg"]');
    if ($viewer2dList.length > 0) {
      bimsync.loadViewer2d();
      bimsync.setOnViewer2dLoadCallback(function() {
        $viewer2dList.each(function() {
          loadUrl($(this));
        });
      });
    }
  });
}(window.bimsync, window.jQuery);
