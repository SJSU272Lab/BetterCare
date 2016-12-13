// vim: et:sts=2:sw=2

var angular = window.angular
  , console = window.console;

window.chartCtrl = ['$scope', function($scope) {
  $scope.data = new Array(9);

  $scope.sample = function() {
    if (!$scope.paused) {
      for (var i=0, l=$scope.data.length; i < l; i++) {
        $scope.data[i] = Math.random() * 95 + 5;
      }
    }
  };

  $scope.paused = false;

  $scope.sample();
  $scope.sampler = setInterval(function() {
    if (!$scope.paused) {
      $scope.$apply($scope.sample);
    }
  }, 1500);
}];

angular.module('myApp', []).

directive('peakChart', ['$window', function($win) {
  var PI   = Math.PI
    , sin  = Math.sin
    , cos  = Math.cos
    , tan  = Math.tan
    , atan = Math.atan
    , acos = Math.acos
    , sqrt = Math.sqrt
    , pow  = Math.pow
    , abs  = Math.abs
    , rSkRo = /^(?:sk|ro)/;

  return {
    link: function(scope, elm, attrs) {
      var faces  = elm[0].querySelectorAll('[face]')
        , labels = elm[0].getElementsByTagName('label')
        , r      = elm[0].offsetWidth / 2
        , charth = 1.5 * r; // max height of peaks: revisit

      scope.$watch(attrs.data, function(data) {
        var sum = 0;
        angular.forEach(data, function(d) { sum += d; });

        // iterate slices
        for (var i=0, face; (face = faces[2*i]); i++) {
          var bkFace   = faces[2*i + 1]
           //
           // split the peaks evenly around the graph
           //
            , slice    = 2 * PI / (faces.length/2)
            , npos     = i * slice - PI
           //
           // give the slice height based on data - assume data values are percentages
           // also, tone down the peaks in front (HACK)
           //
            , val      = (i >= 4 ? data[i] * 0.6 : data[i])
            , h        = val * charth / 100
           //
           // face angle - each face covers half the slice
           //
            , fang     = slice/2
           //
           // we want the faces to meet at a point "h" pixels above the
           // midpoint of the slice's arc
           //
            , chord    = 2 * r * sin(fang/2)
           //
           // chord's angle with radius
           //
            , chang    = (PI - fang) / 2
           //
           // altitude from radius to arc midpoint
           //
            , alt2mp   = chord * sin(chang)

            , slope    = atan(h / alt2mp)
            , slopeLen = sqrt(pow(h,2) + pow(alt2mp,2))
           //
           // the radial triangles are half squares so h = r
           //
            , scaleY   = slopeLen / r
            , skew     = atan(chord * cos(chang) / slopeLen)
            ;

          setTransform(face,
            'translateZ', 2,
            'rotateZ',    npos,
            'rotateX',    slope - Math.PI,
            'skewX',      skew,
            'scaleY',     scaleY
          );

          setTransform(bkFace,
            'translateZ', 2,
            'rotateZ',    npos + slice,
            'rotateX',    -slope,
            'skewX',      skew,
            'scaleY',     scaleY
          );

          var lbl = labels[i];
          lbl.textContent = Math.round(val);

          var rlbl   = r
            , nlbl   = -npos - slice/2
            , lblx   = rlbl * cos(nlbl)
            , lbly   = rlbl * sin(nlbl)
            , lblxat = lblx > 0 ? 'left'   : 'right'
            , lblyat = lbly > 0 ? 'bottom' : 'top';

          lbl.style[lblxat] = r + abs(lblx) + 'px';
          lbl.style[lblyat] = r + abs(lbly) + 15 + 'px';
          lbl.setAttribute('point', lblyat + lblxat); // e.g., [point=topleft]

          if (i < 5) {
            setTransform(lbl,
              'rotateX',    deg(-45)
            , 'translateY', -(h / sqrt(2))
            , 'translateZ', h / sqrt(2)
            );
          }
        }

      }, /* deep */ true);
    }
  };

  function rad(x) {
    return (Math.round(x * 1000) / 1000) + 'rad';
  }


  function setTransform(node) {
    var ns = node.style, trans = '';
    for (var i=1, l=arguments.length; i < l; i += 2) {
      var nm = arguments[i], val = arguments[i+1];
      trans += nm + '(' + (
          rSkRo.test(nm) ? rad(val)
        : nm.slice(0, 2) === 'tr' ? val + 'px'
        : val) + ') ';
    }
    ns.webkitTransform =
      ns.mozTransform =
      ns.msTransform =
      ns.transform = trans;
  }

  function deg(x) {
      return { valueOf: function() { return x * PI / 180; } };
  }

}]);
