
angular.module('cTRIVIAL')
.directive('d3Plots', function($routeParams, $location, $rootScope, clusterauth){

    function link($scope, element){

        $scope.elementId = _.uniqueId('d3Plots');
        element.attr("id", $scope.elementId);

        $scope.graph = {};

        $scope.update = function(){

        }

        $scope.$watch('data', function(){
            if($scope.data){
                $scope.update();
            }
        })

        $scope.$watch('graph.axis.x', function(){
                      var data = $scope.data;
                      
                      if($scope.svg != undefined){
                      // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                      if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                      }
                      
                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
                      }
                      }


                      });

        $scope.$watch('graph.axis.y', function(){
                      var data = $scope.data;
                      
                      if($scope.svg != undefined){
                      // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                      if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                      }

                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
                      }
                      }
        });


        $scope.$watch('graph.type', function(){

            console.log($scope.graph.type);

            var data = $scope.data;

            var allkeys = {};
            _.each(data, function(obj){ _.extend(allkeys, obj); });
            delete allkeys._id;
            delete allkeys._rev;
            delete allkeys.type;

            $scope.keys = _.keys(allkeys);

            if($scope.svg != undefined){
                // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                if($scope.graph.type == 1) if(element.children()[1] != undefined)  element.children()[1].remove();

            }

            if($scope.graph.type == 0)
            {
                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
                      }
                      }
                      
            }
                      
            else
            {
                      displayAllCaracteristics(data)
            }

        });
           
        function displayTwoCaracteristics(data, carac1, carac2) {
           
           // definition of the size of the window
           var margin = {top: 80, right: 80, bottom: 80, left: 80};
           var width = 1000 - margin.left - margin.right;
           var height = 600 - margin.top - margin.bottom;
           
           //creation of the drawing windaw
           $scope.svg = d3.select("#" + $scope.elementId).append("svg")
           .attr("class", "d3plot")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .append("g")
           .attr("class", "graph")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           var svg = $scope.svg
           
           //### X axis ###
           var x = d3.scale.linear().domain([d3.min(data, function(d) { return d[carac1]; }), d3.max(data, function(d) { return d[carac1]; })]).range([0, width]);
           
           var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");
           
           svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", 6)
           .attr("dx", width + 40)
           .attr("dy", "1.22em")
           .style("text-anchor", "end")
           .text(carac1);
           
           //### Y axis ###
           var y = d3.scale.linear().domain([d3.min(data, function(d) { return d[carac2]; }), d3.max(data, function(d) { return d[carac2]; })]).range([height, 0]);
           
           var yAxis = d3.svg.axis()
           .scale(y).
           orient("left");
           
           svg.append("g")
           .attr("class", "y axis")
           .attr("transform", "translate(0,0)")
           .call(yAxis)
           .append("text")
           .attr("y", 6)
           .attr("dy", "-2em")
           .style("text-anchor", "end")
           .text(carac2);
           
           // drow circles
           
           var circ = svg.selectAll(".bar").data(data).enter();
           
           circ.append("circle")
           .attr("class", "circl")
           .attr("cx", function(d) {return x(d[carac1]);})
           .attr("cy", function(d) {return y(d[carac2]);})
           .attr("r", 5);
           
           }
           
        function displayAllCaracteristics(data) {
           
           // definition of the size of the window
           var margin = {top: 80, right: 80, bottom: 80, left: 80};
           var width = 1000 - margin.left - margin.right;
           var height = 600 - margin.top - margin.bottom;
           
           //creation of the drawing windaw
           $scope.svg = d3.select("#" + $scope.elementId).append("svg")
           .attr("class", "d3plot")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .append("g")
           .attr("class", "graph")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           var svg = $scope.svg
           
           var keys =  Object.keys(data[0])
           var keys = {};
           _.each(data, function(obj){ _.extend(keys, obj); });
           delete keys._id;
           delete keys._rev;
           delete keys.type;
           delete keys.patientId;
           var keys =  Object.keys(keys)
           //### X axis ###
           var x = d3.scale.ordinal().domain(keys).rangeRoundBands([0, width], .1);
           
           var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");
           
           svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")
           .attr("transform", "rotate(-65)" )
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           
           x.domain(data.map(function(d) { return d.keys; }));
           

           
        }

    };

    return {
        restrict : 'E',
        link : link,
        scope: {
            data : "="
        },
        templateUrl: 'views/directives/directiveD3Plots.html'
    }

});

