var R = R || (function() {
  var doc = document; 

  return {
    "GlUtil" : GlUtil, 
    "getGlContext" : getGlContext
  }; 

  function getGlContext(id, attributes) {
    var canvas = doc.getElementById(id), 
        gl = null; 
 
    try {
      try {
        gl = canvas.getContext("experimental-webgl", attributes);
      }
      catch(e) {       
      }
      gl = gl || canvas.getContext("webgl", attributes);        
    }
    catch(e) {
    }
    
    return gl;  
  }

  function GlUtil(gl) {
    var shaderTypes = {
      "x-shader/x-fragment" : gl.FRAGMENT_SHADER, 
      "x-shader/x-vertex" : gl.VERTEX_SHADER 
    }, 
    doc = document;

    this["getGlContext"] = getGlContext;  
    this["loadShader"] = loadShader;  

    function loadShader(id) {
      var e = doc.getElementById(id),
          attributes = null,  
          attribute = null, 
          type = null,  
          shaderenum = 0, 
          i = 0, 
          shader = null, 
          compiled = null;

      if(!e) {
        throw "can't find element with the id " + id + ".";
      } 

      attributes = e.attributes; 

      for(i = 0; i != attributes.length; i++) {
        attribute = attributes[i]; 
        if(attribute.name === "type") {
          type = attribute.value; 
          break; 
        }
      }
      
      if(!type) {
        throw "No type attribute specified";
      } 
      
      shaderenum = shaderTypes[type];
 
      if(!shaderenum) { 
        throw "can't compute type '" + type + "'.";   
      } 
      
      shader = gl.createShader(shaderenum); 
   
      if(!shader) {
        throw "couldn't create Shader from element " + id + "."; 
      }
      
      gl.shaderSource(shader, e.firstChild.data); 
      gl.compileShader(shader); 
      compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS); 

      if(!compiled) {
        throw "Error compiling Shader: " + gl.getShaderInfoLog(shader);   
      }

      return shader; 
    }
  }
})(); 


