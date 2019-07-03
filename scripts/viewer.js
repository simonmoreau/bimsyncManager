var bimsync = bimsync || {};

!function(bimsync, $) {

  var scripts = {
      'viewer' : ['/js/viewer-api.js'],
      'viewer-ui' : ['/js/viewer-ui-api.js'],
  };

  var stylesheets = {
      'viewer' : [],
      'viewer-ui' : ['/css/viewer-ui-api.css'],
  };

  var hosts = {
      'viewer' : bimsync.viewerhost === undefined ? 'https://bimsync.com' : bimsync.viewerhost,
      'viewer-ui' : bimsync.vieweruihost === undefined ? 'https://bimsync.com' : bimsync.vieweruihost,
  };

  var loaded = false;
  var onLoadCallback = undefined;
  var defaultModules = ['viewer'];

  bimsync.load = function(modules) {
    modules = modules ? modules.concat(defaultModules) : defaultModules;

    var scripts_ = modules.reduce(function(result, module) {
        return result.concat(scripts[module].map(function(path) {
            return hosts[module] + path;
        }));
    }, []);

    var timestamp = new Date().getTime();
    var stylesheets_ = modules.reduce(function(result, module) {
        return result.concat(stylesheets[module].map(function(path) {
            return hosts[module] + path + '?_=' + timestamp;
        }));
    }, []);

    var i, il;
    for (i = 0, il = stylesheets_.length; i < il; i++) {
        $('<link/>', {
          rel : 'stylesheet',
          type: 'text/css',
          href: stylesheets_[i]
        }).appendTo('head');
    }

    var scriptsLoaded = 0;
    for (i = 0, il = scripts_.length; i < il; i++) {
      $.getScript(scripts_[i], function() {
        scriptsLoaded++;
        if (scriptsLoaded === scripts_.length) {
          loaded = true;
          if (onLoadCallback !== undefined) {
            onLoadCallback.call(null);
          }
        }
      });
    }
  };

  bimsync.setOnLoadCallback = function(callback) {
    onLoadCallback = callback;
    if (loaded) {
      onLoadCallback.call(null);
    }
  }

  function createViewer($viewer) {
    $viewer.viewer($viewer.data());
    var url = $viewer.data('url');
    $viewer.viewer('loadurl', url);
  }

  function initializeUI($viewer) {
    $viewer.viewerUI($viewer.data());
  }

  $(function (event) {
    var $viewers = $('[data-viewer="webgl"]');
    var $viewerUI = $('[data-viewer="webgl"][data-ui]');
    if ($viewers.length > 0) {
      var modules = ['viewer'];
      if ($viewerUI.length) {
        modules.push('viewer-ui');
      }
      bimsync.load(modules);
      bimsync.setOnLoadCallback(function() {
        $viewers.each(function() {
          createViewer($(this));
        });
        
        $viewerUI.each(function() {
          initializeUI($(this));
        });
      });
    }
  });

}(window.bimsync, window.jQuery);
