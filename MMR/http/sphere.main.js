function gamemain() {
	var config = window.gameconfig, 
	    gl = document.getElementById(config.canvastag).getContext("experimental-webgl"), 
	    raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {window.setTimeout(callback, 1000 / 60); }; 

	var data = init(gl, config); 

	(function animloop() {
		draw(gl, data);
		raf(animloop);
	}());
}

function draw(gl, data) {
	gl.viewport(0, 0, 640, 480); 

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(data.program); 

	
	gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer); 
	gl.vertexAttribPointer(data.vertexAttribute, 3, gl.FLOAT, false, 0, 0); 
	gl.enableVertexAttribArray(data.vertexAttribute);
    gl.drawArrays(gl.TRIANGLES, 0, 3); 
} 

function init(gl, config) {
	var program, vertexAttribute, linked, vertexShader, fragmentShader; 

	program = gl.createProgram(); 

	//compiliere und attache Vertex Shader 
	vertexShader = gl.createShader(gl.VERTEX_SHADER); 
	gl.shaderSource(vertexShader, config.vs); 
	gl.compileShader(vertexShader); 
	gl.attachShader(program, vertexShader); 

	//compiliere und attache Fragment Shader 
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); 
	gl.shaderSource(fragmentShader, config.fs); 
	gl.compileShader(fragmentShader); 
	gl.attachShader(program, fragmentShader); 

	//Linke 
	gl.linkProgram(program); 
	linked = gl.getProgramParameter(program, gl.LINK_STATUS); 

	vertexAttribute = gl.getAttribLocation(program, "vPosition"); 

	gl.clearColor(0.0, 0.0, 0.0, 1.0); 

	// Triangle Buffer binden 
	var vertices = new Float32Array([0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	return {
		"buffer" : buffer, 
		"program" : program, 
		"vertexAttribute" : vertexAttribute
	}; 
}
