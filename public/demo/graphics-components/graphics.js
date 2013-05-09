!function(exports, seine) {
  'use strict';

  var Component = seine.Component;

  var canvas, gl, className, prog, image,
      component = new Component,
      loaded = false;

  component.init = function() {
    var vertex, fragment, loc, buffer, res;

    // Why setTimeout here?
    // It helps with speeding up the onload event: setting up a WebGL context
    // is expensive, and will block onload from firing until the computation is
    // finished even though everything has finished loading.
    setTimeout(function() {
      canvas = document.createElement('canvas');

      canvas.classList.add(className);
      document.body.appendChild(canvas);

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      gl = initWebGl(canvas);

      vertex = getShader(gl, '2d-vertex-shader');
      fragment = getShader(gl, '2d-fragment-shader');

      prog = gl.createProgram();
      gl.attachShader(prog, vertex);
      gl.attachShader(prog, fragment);
      gl.linkProgram(prog);

      if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) alert('crap');
      gl.useProgram(prog);

      window.addEventListener('resize', function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      });

      image = new Image;
      image.onload = function() { loaded = true; };
      image.src = '/swordguy.png';
    }, 0);

  };

  component.preprocess = function() {
    if(loaded) clear(gl);
  };

  component.render = function() {
    if(loaded) drawScene(gl, prog, canvas.width, canvas.height);
  };

  component.destroy = function() {
    canvas = ctx = gl = prog = null;
  };

  function initWebGl(canvas) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }

  function getShader(gl, id) {
    var source, shader,
        shaderEl = document.getElementById(id);

    if(!shaderEl) return null;
    source = shaderEl.text;

    shader = gl.createShader(shaderMapping(gl, shaderEl.type));
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;

    return shader;
  }

  function shaderMapping(gl, type) {
    switch(type) {
      case 'x-shader/x-vertex': return gl.VERTEX_SHADER;
      case 'x-shader/x-fragment': return gl.FRAGMENT_SHADER;
    }
    return null;
  }

  function clear(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  function drawScene(gl, program, width, height) {
    var tex = texture(image, 0, 0, 48, 32);
    drawRect(gl, program, 10, 10, 48*2, 32*2, tex);
  }

  function drawRect(gl, program, x, y, w, h, tex) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.bufferData(gl.ARRAY_BUFFER, rectArray(x, y, w, h), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);

    // (pointer, tuple size?, type, ?, ?, ?)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST); // Only needed for 3D
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    var texCoordLocation = gl.getAttribLocation(program, 'aTexCoord');
    var texClipLocation = gl.getUniformLocation(program, 'uClip');
    gl.uniform4f(texClipLocation, tex.x, tex.y, tex.w, tex.h);
    var texSizeLocation = gl.getUniformLocation(program, 'uTexSize');
    gl.uniform2f(texSizeLocation, tex.image.width, tex.image.height);
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    // note: can reuse same float32 array every time, no need to make garbage
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);

    // (type, dunno, num tuples)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function texture(image, x, y, w, h) {
    return {
      image: image,
      x: x,
      y: y,
      w: w,
      h: h
    };
  }

  function rectArray(x, y, w, h) {
    // note: can overwrite same float32 array every time, as long as client
    // code is ok with that. maybe take in a float32 array and modify it?
    return new Float32Array([
      x, y,
      x, y + h,
      x + w, y,
      x + w, y + h
    ]);
  }


  demo.graphics = {
    init: function(canvasClassName) {
      className = canvasClassName;
      seine.engine.components.push(component);
    }
  };

}(demo, seine);