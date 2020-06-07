//////////////////////////////////////////////////////////////////////////////
//
//  Computação Visual - Trabalho 1 - WebGL
//
//  André Santos (84816) - andrembs@ua.pt
//
//  CV - 2019
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexNormalBuffer = null;	

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];

var gameSpeed = 0.04;
var obsSpeed = 0.03;
var rotSpeed = 5;

var state = "running";

//----------------------------------------------------------------------------
//
// To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();


function countFrames() {
	
   var now = new Date().getTime();

   frameCount++;
   
   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {
	   
       fps = frameCount;
       
       frameCount = 0;
       
       elapsedTime -= 1000;
	   
	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}

//----------------------------------------------------------------------------
//
// Score
//

var elapsedScoreTime = 0;

var scoreCount = 0;

var lastScoreTime = new Date().getTime();


function score() {
	
   var now = new Date().getTime();
   
   elapsedScoreTime = (now - lastScoreTime);

   if(elapsedScoreTime >= 1000) {
	   
		if(state == "running"){
			scoreCount++;

			// Increase speed each 10 seconds
			if(scoreCount > 0 && scoreCount % 10 == 0){
				gameSpeed += 0.005;
				obsSpeed += 0.005;
			}
		}

		lastScoreTime = now;
   }
}

//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType,
					xOffset = 0 ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx + xOffset, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0.2, 0.3, 0.4, 0.6);
	
	// Computing the Projection Matrix
	
	if( projectionType == 1 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0;  
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;

		// The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	
	// Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           
	// Counting the frames
	countFrames();

	// Calculate and update score
	score();

	var msd = Math.floor(scoreCount/10);
	var lsd = Math.floor(scoreCount%10);

	var number = numberModels[msd];
	for(var i = 0; i < number.length; i++ )
	{ 
		drawModel( number[i],
			   mvMatrix,
			   primitiveType,
			   -0.15 );
	}
	var number = numberModels[lsd];
	for(var i = 0; i < number.length; i++ )
	{ 
		drawModel( number[i],
			   mvMatrix,
			   primitiveType,
			   0.15 );
	}

}

//----------------------------------------------------------------------------
//
//  Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}
		
		// Rotating the light sources
	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}
		}
	}

	updateMap();
	var collision = false;
	sceneModels.slice(2, 15).concat(sceneModels.slice(16, 29)).forEach(element => {
		if(checkCollisions(element) == true){
			collision = true;
			state = "over"
		}
	});

	if(collision){
		// Material
		sceneModels[0].kAmbi = [1.0, 0.0, 0.0];
		sceneModels[0].kDiff = [1.0, 0.0, 0.0];
		sceneModels[0].kSpec = [1.0, 0.6, 0.6];
		sceneModels.nPhong = 12.0;
	}else{
		// Material
		sceneModels[0].kAmbi = [0.0215, 0.1745, 0.0215];
		sceneModels[0].kDiff = [0.07568, 0.61424, 0.07568];
		sceneModels[0].kSpec = [0.633, 0.727811, 0.633];
		sceneModels.nPhong = 10.0;
	}

	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}

function updateMap(){
	if(state == "running"){
		sceneModels.slice(1).forEach(element => {
			element.tz += gameSpeed;
		});
	
		if(sceneModels[14].tx >= 0.9 || sceneModels[14].tx <= -0.9){
			obsSpeed *= -1;
		}
		sceneModels[28].tx -= obsSpeed;
		sceneModels[28].rotAngleYY += rotSpeed;
		sceneModels[30].tx -= obsSpeed;
		sceneModels[14].tx += obsSpeed;
	
		var obstNum = 15
		
		if(sceneModels[1].tz >= 5){
			for(i=1; i<obstNum; i++){
				sceneModels[i].tz = sceneModels[i+obstNum-1].tz - sceneModels[obstNum].sz*2;	
			}
		}
		if(sceneModels[obstNum].tz >= 5){
			for(i=obstNum; i<sceneModels.length - 1; i++){
				sceneModels[i].tz = sceneModels[i-obstNum+1].tz - sceneModels[1].sz*2;	
			}
			sceneModels[30].tz = sceneModels[28-obstNum+1].tz - sceneModels[1].sz*2;
		}
	}
}


//----------------------------------------------------------------------------
//
//  User Interaction

function setEventListeners(){
	
    // Dropdown list
	
	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
				
		// Getting the selection
		
		var p = projection.selectedIndex;
				
		switch(p){
			
			case 0 : projectionType = 0;
				break;
			
			case 1 : projectionType = 1;
				break;
		}  	
	});      

	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
		
		var mode = list.selectedIndex;
				
		switch(mode){
			
			case 0 : primitiveType = gl.TRIANGLES;
				break;
			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;
			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});         

	document.getElementById("restart").onclick = function(){
		
		window.location.reload(true);
	};      
	
	// Mouse position over canvas - Player's Movement
	document.getElementById("my-canvas").onmousemove = function(){
		
		var coords = getWebGLCoordinates(event, gl.canvas);

		if(state == "running") sceneModels[0].tx = coords.x;
	};

	// Mouse position over canvas - Player's Movement
	document.onkeydown = function(event){
		
		var key = event.keyCode;

		if(key == 190) sceneModels[0].tz += 0.1;
		if(key == 188) sceneModels[0].tz -= 0.1;

		if(key == 82) window.location.reload(true);
		if(key == 87) primitiveType = gl.LINE_LOOP;
		if(key == 70) primitiveType = gl.TRIANGLES;

	};	
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    
}

//----------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																											//
// Functions for getting and normalizing mouse position coordinates											//
// Source: 	https://stackoverflow.com/questions/42309715/how-to-correctly-pass-mouse-coordinates-to-webgl	//
//																											//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WebGL clip space coordinates
function getWebGLCoordinates(event, target){
	const pos = getNoPaddingNoBorderCanvasRelativeMousePosition(event, target);

	// pos is in pixel coordinates for the canvas.
	// so convert to WebGL clip space coordinates
	return {
		x: pos.x / gl.canvas.width  *  2 - 1,
		y: pos.y / gl.canvas.height * -2 + 1
	}
}

function getRelativeMousePosition(event, target) {
	target = target || event.target;
	var rect = target.getBoundingClientRect();

	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	}
}

// assumes target or event.target is canvas
function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
	target = target || event.target;
	var pos = getRelativeMousePosition(event, target);

	pos.x = pos.x * target.width  / target.clientWidth;
	pos.y = pos.y * target.height / target.clientHeight;

	return pos;  
}