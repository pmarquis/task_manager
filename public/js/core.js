(function(){
  var app = angular.module("objectives-store", ["objectives_controller"]);

  app.controller("NewObjectiveController", ['$http', function($http){
    this.objective = {};
    var that = this;
    this.submit = function(objective){
      var url = 'insert/' + that.objective.title;
      url += '/' + that.objective.description;
      url += '/' + that.objective.time;
      url += '/' + that.objective.period;
      console.log(url);
      $http.get(url).success(function(data){
        console.log(data);
      })
      .error(function(data){
        console.log("pos de bal!");
      });
      that.objective = {};
      // Reload panel
      // $('#panel').load(document.URL + " #panel");
    };
  }]);

  app.controller("PanelController", function(){
    this.period = 'day'; 
    this.isSelected = function(value){
      // console.log(value + " " + this.period);
      return value == this.period;
    };
    this.selectTab = function(value){
      this.period = value;
    };
  });

})();