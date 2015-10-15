var app = angular.module('objectives_controller', [])
app.controller("ObjectivesController", ['$http', function($http){
  this.newObjective = {
    period: "day",
    title: "",
    time: "",
    description: ""
  };
  // this.objectives = objectiveArray;
  var that = this; 
  $http.get('/data.json').success(function(data){
    that.objectives = data;
  });

  this.delete = function(id){
    $http.get('/delete/' + id).success(function(data){
      $("objective-" + id).remove();
    });   
  };
}]);

app.directive("objectiveElement", function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/objective-element.html'
  };
});
