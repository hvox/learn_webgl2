"use strict";

const VERTEX_SHADER = `#version 300 es
	in vec4 a_position;
	void main() {
    	gl_Position = a_position;
	}
`;

const FRAGMENT_SHADER = `#version 300 es
	precision highp float;
	out vec4 outColor;
	void main() {
		outColor = vec4(1, 0, 0, 1);
	}
`;

function compileShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	console.error(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createPipeline(gl, vertexShader, fragmentShader) {
	const pipeline = gl.createProgram();
	gl.attachShader(pipeline, vertexShader);
	gl.attachShader(pipeline, fragmentShader);
	gl.linkProgram(pipeline);
	if (gl.getProgramParameter(pipeline, gl.LINK_STATUS)) return pipeline;
	console.error(gl.getProgramInfoLog(pipeline));
	gl.deleteProgram(pipeline);
}

window.onload = () => {
	const canvas = document.getElementById("canvas");
	const gl = canvas.getContext("webgl2");
	if (!gl) throw new Error("It looks like WebGL2 is not supported here");
	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
	const pipeline = createPipeline(gl, vertexShader, fragmentShader);
	const positionAttributeLocation = gl.getAttribLocation(pipeline, "a_position");
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const vertexArray = gl.createVertexArray();
	const positions = new Float32Array([
		0.0, 0.5,
		-0.4, -0.5,
		+0.4, -0.5,
	]);
	gl.bindVertexArray(vertexArray);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	// Bind positionBuffer to vertexArray
	gl.vertexAttribPointer(positionAttributeLocation,
		2, // Number of components per iteration
		gl.FLOAT, // Type of elements
		false, // Data normalization
		0, // "stride", I have no idea what it is. I failed to find it in google
		0, // Offset to start with in the buffer
	);

	console.log("default canvas size:", canvas.width, canvas.height);
	canvas.width = canvas.height = 0;
	function render() {
		if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			gl.viewport(0, 0, canvas.width, canvas.height);
		}
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(pipeline);
		gl.bindVertexArray(vertexArray);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	render();
	setInterval(render, 1000);
}
