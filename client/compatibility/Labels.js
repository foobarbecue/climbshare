var LabelPlugin = {
  labels: [],
  init: function() {},
  add: function(l) {this.labels.push(l);},
  remove: function(l) {
   this.labels = this.labels.filter(function (label) {
     return label != l;
   });
  },
  render: function() {
    for (var i=0; i<this.labels.length; i++) {
      var args = Array.prototype.slice.call(arguments);
      this.labels[i].render.apply(this.labels[i], args);
    }
  }
};

var OriginalWebGLRenderer = THREE.WebGLRenderer;
THREE.WebGLRenderer = function(parameters) {
   var orig = new OriginalWebGLRenderer(parameters);
   orig.addPostPlugin(LabelPlugin);
   return orig;
};

var OriginalCanvasRenderer = THREE.CanvasRenderer;
THREE.CanvasRenderer = function(parameters) {
   var orig = new OriginalCanvasRenderer(parameters);
   orig.addPostPlugin(LabelPlugin);
   return orig;
};

function Label(object, content, duration) {
//     probably need to add options object here
  this.object = object;
  this.content = content;
  this.showText = true;
  this.showMarker = true;
  if (duration) this.remove(duration);
  this.updatePosition(scene, camera);
  this.el = this.buildElement();
  this.marker = this.buildMarker();
  LabelPlugin.add(this);
}

Label.prototype.buildMarker = function() {
    spGeom = new THREE.SphereGeometry(0.05,6,6);
    spMat = new THREE.MeshBasicMaterial();
    marker = new THREE.Mesh(spGeom, spMat);
    marker.position = this.position;
    return marker    
}

Label.prototype.buildElement = function() {
  var el = document.createElement('div');
  el.classList.add("label3D");
  el.textContent = this.content;
  document.body.appendChild(el);
  return el;
};

Label.prototype.updatePosition = function(scene, camera) {
    if (this.object instanceof THREE.Vector3){
        this.position=this.object.clone()
    }
    else{
        this.position = this.object.position.clone();
        this.position.z = this.position.z + this.object.geometry.boundingSphere.radius * Math.sin(camera.rotation.x);
        this.position.y = this.position.y + this.object.geometry.boundingSphere.radius * Math.cos(camera.rotation.x) * Math.cos(camera.rotation.z);
        this.position.x = this.position.x - this.object.geometry.boundingSphere.radius * Math.sin(camera.rotation.z) * Math.sin(camera.rotation.y);
    }

}

Label.prototype.render = function(scene) {
  this.updatePosition();
    var projector = new THREE.Projector(),
        pos = projector.projectVector(this.position, camera),
        width = window.innerWidth,
        height = window.innerHeight,
        w = this.el.offsetWidth,
        h = this.el.offsetHeight;
    this.el.style.top = '' + (height/2 - height/2 * pos.y - h - 10) + 'px';
    this.el.style.left = '' + (width/2 * pos.x + width/2 - w/2) + 'px';      
 if (this.showMarker){    
    scene.add(this.marker)
  }
   else {
       scene.remove(this.marker)
   }
 if (this.showText){
     $(this.el).show();
 }
  else{
    $(this.el).hide();
  }
};

Label.prototype.setContent = function(content) {
  this.content = content;
  this.el.textContent = this.content;
};

Label.prototype.remove = function(delay) {
  var that = this;
  if (delay) return setTimeout(function(){that.remove();}, delay * 1000);
  this.showText = false;
  $(this.el).fadeOut();
};
