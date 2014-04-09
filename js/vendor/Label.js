// Label.js from http://gamingjs.com/Label.js by Chris Strom

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
  this.object = object;
  this.content = content;
  if (duration) this.remove(duration);

  this.el = this.buildElement();
  LabelPlugin.add(this);
}

Label.prototype.buildElement = function() {
  var el = document.createElement('div');
  el.textContent = this.content;
  el.style.backgroundColor = 'white';
  el.style.position = 'absolute';
  el.style.padding = '1px 4px';
  el.style.borderRadius = '2px';
  el.style.maxWidth = (window.innerWidth * 0.25) + 'px';
  el.style.maxHeight = (window.innerHeight * 0.25) + 'px';
  el.style.overflowY = 'auto';
  document.body.appendChild(el);
  return el;
};

Label.prototype.render = function(scene, cam) {
  var p3d = this.object.position.clone();
  p3d.z = p3d.z + this.object.boundRadius * Math.sin(cam.rotation.x);
  p3d.y = p3d.y + this.object.boundRadius * Math.cos(cam.rotation.x) * Math.cos(cam.rotation.z);
  p3d.x = p3d.x - this.object.boundRadius * Math.sin(cam.rotation.z) * Math.sin(cam.rotation.y);

  var projector = new THREE.Projector(),
      pos = projector.projectVector(p3d, cam),
      width = window.innerWidth,
      height = window.innerHeight,
      w = this.el.offsetWidth,
      h = this.el.offsetHeight;
  this.el.style.top = '' + (height/2 - height/2 * pos.y - h - 10) + 'px';
  this.el.style.left = '' + (width/2 * pos.x + width/2 - w/2) + 'px';
};

Label.prototype.setContent = function(content) {
  this.content = content;
  this.el.textContent = this.content;
};

Label.prototype.remove = function(delay) {
  var that = this;
  if (delay) return setTimeout(function(){that.remove();}, delay * 1000);
  this.el.style.display = 'none';
  return LabelPlugin.remove(this);
};
