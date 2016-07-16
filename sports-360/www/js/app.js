var serverUrl = 'http://ef16a42e.ngrok.io';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    ionic.Platform.fullScreen();
    if (window.StatusBar) {
      return StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('video', {
        url: '/video',
        templateUrl: 'templates/video.html',
        controller: 'VideoCtrl'
      })
      .state('capture-video', {
        url: '/capture-video',
        templateUrl: 'templates/capture-video.html',
        controller: 'CaptureVideoCtrl'
      })
      .state('home', {
        url: "/home",
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
      });
    $urlRouterProvider.otherwise('/home');
})

.controller('HomeCtrl', ['$scope', '$state', '$http', '$ionicPopup', function($scope, $state, $http, $ionicPopup) {
  $scope.connectedToCamera = false;

  $scope.connectToCamera = function() {
    var SSID = 'LGR105_051402.OSC';
    // happy callback hell >.>
    var cameraWifi = WifiWizard.formatWPAConfig(SSID, '00051402');
    WifiWizard.setWifiEnabled(true, function() {
      WifiWizard.addNetwork(cameraWifi, function() {
        WifiWizard.connectNetwork(SSID, function() {
          $ionicPopup.alert({
            title: 'LG CAM 051402',
            template: 'Connected to Camera'
          });
          $scope.connectedToCamera = true;
        }, handleError);
      }, handleError);
    }, handleError);

    function handleError(error) {
      $scope.connectedToCamera = false;
      $ionicPopup.alert({
        title: 'LG CAM 051402',
        template: 'Oh no right? OH NO PANIC!! \n' + JSON.stringify(error)
      });
    }
  };
}])

.controller('CaptureVideoCtrl', ['$scope', '$http', '$timeout', '$interval', '$ionicPopup', '$ionicLoading', function($scope, $http, $timeout, $interval, $ionicPopup, $ionicLoading) {
  var cameraBaseUrl = 'http://192.168.43.1:6624';
  $scope.previewSrc = 'img/att-splash.jpg';

  $scope.captureVideo = function() {
    $http.post(cameraBaseUrl + '/osc/commands/execute', {
      "name": "camera.startCapture"
    }, {
      headers: {
        'X-XSRF-Protected': 1
      }
    }).then(function(resp) {
      $scope.capturing = true;
      // cant get the binary content to be displayed in browser
      $timeout(stopCapture, 5000);
    }, handleError);
  };

  function stopCapture() {
    // $interval.cancel($scope.previewInterval);
    $http.post(cameraBaseUrl + '/osc/commands/execute', {
      name: "camera.stopCapture"
    }, {
      headers: {
        'X-XSRF-Protected': 1
      }
    })
    .then(function(resp) {
      $scope.captureId = resp.data.id;
      $timeout(getCaptureState, 1000);
    }, handleError);
  }

  function getCaptureState() {
    $http.post(cameraBaseUrl + '/osc/commands/status', {
      id: $scope.captureId
    }, {
      headers: {
        'X-XSRF-Protected': 1
      }
    }).then(function(resp) {
      if (resp.data.state === 'done') {
        $scope.capturing = false;
      }
    }, handleError);
  }

  function handleError(error) {
    $ionicPopup.alert({
      title: 'LG CAM 051402',
      template: 'Oh no right? OH NO PANIC!! \n' + JSON.stringify(error)
    });
  }
}])

.controller('VideoCtrl', ['$scope', '$state', function($scope, $state) {

}])

.directive('cardboardGl', [function() {

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      create($element[0]);
    }
  }

  function create(glFrame) {
    var scene,
        camera,
        renderer,
        element,
        container,
        effect,
        controls,
        clock;

    init();

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
      camera.position.set(0, 15, 0);
      scene.add(camera);

      var geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

      var video = document.createElement('video');
      // video.autoplay = true;
      video.src = "videos/360-video.mp4";
      video.loop = true;
      video.autoplay =  true;
      // video.setAttribute('crossorigin', 'anonymous');

      var texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      var material = new THREE.MeshBasicMaterial({
        map: texture
      });

      mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);

      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = glFrame;
      container.appendChild(element);

      effect = new THREE.StereoEffect(renderer);

      // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
      controls = new THREE.OrbitControls(camera, element);
      controls.target.set(
        camera.position.x + 0.15,
        camera.position.y,
        camera.position.z
      );
      controls.noPan = true;
      controls.noZoom = true;

      // Our preferred controls via DeviceOrientation
      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
      }
      window.addEventListener('deviceorientation', setOrientationControls, true);

      clock = new THREE.Clock();

      animate();
    }

    function animate() {
      var elapsedSeconds = clock.getElapsedTime();

      requestAnimationFrame(animate);

      update(clock.getDelta());
      render(clock.getDelta());
    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();

      camera.updateProjectionMatrix();

      controls.update(dt);
    }

    function render(dt) {
      effect.render(scene, camera);
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }
  }
}]);
