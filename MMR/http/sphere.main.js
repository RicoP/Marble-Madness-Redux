function gamemain() {
	var config  = window.gameconfig, 
	    gl = document.getElementById(config.canvastag).getContext("experimental-webgl"); 

	init(gl, config); 

	(function animloop() {
		draw(gl, config);
		// Chrome only! 
		window.webkitRequestAnimationFrame(animloop);
	})();
}

function draw(gl, config) {
} 

function init(gl, config) {
	var program, linked, vertexShader, fragmentShader; 

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

	gl.clearColor(0.0, 0.0, 0.0, 1.0); 

	// Triangle Buffer binden 
	var vVertices = new Float32Array([0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
	triangle.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vVertices, gl.STATIC_DRAW);
}
