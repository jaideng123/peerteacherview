(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      templateUrl: 'teachers.html'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));