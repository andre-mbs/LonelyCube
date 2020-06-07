//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//

function emptyModelFeatures() {
	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector

	this.tx = 0.0;

	this.ty = 0.0;

	this.tz = 0.0;

	// Rotation angles

	this.rotAngleXX = 0.0;

	this.rotAngleYY = 0.0;

	this.rotAngleZZ = 0.0;

	// Scaling factors

	this.sx = 0.2;

	this.sy = 0.1;

	this.sz = 0.1;

	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = false;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;

	this.rotYYSpeed = 1.0;

	this.rotZZSpeed = 1.0;

	this.rotXXDir = 1;

	this.rotYYDir = 1;

	this.rotZZDir = 1;

	// Material features

	this.kAmbi = [0.1, 0.18725, 0.1745];

	this.kDiff = [0.396, 0.74151, 0.69102];

	this.kSpec = [0.297254, 0.30829, 0.306678];

	this.nPhong = 50;
}

function singleTriangleModel() {
	var triangle = new emptyModelFeatures();

	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
	];

	return triangle;
}

function simpleCubeModel() {
	var cube = new emptyModelFeatures();

	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}

function cubeModel(subdivisionDepth = 2) {
	var cube = new simpleCubeModel();

	midPointRefinement(cube.vertices, subdivisionDepth);

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}

function simpleTetrahedronModel() {
	var tetra = new emptyModelFeatures();

	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}

function tetrahedronModel(subdivisionDepth = 0) {
	var tetra = new simpleTetrahedronModel();

	midPointRefinement(tetra.vertices, subdivisionDepth);

	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}

function sphereModel(subdivisionDepth = 2) {
	var sphere = new simpleCubeModel();

	midPointRefinement(sphere.vertices, subdivisionDepth);

	moveToSphericalSurface(sphere.vertices);

	computeVertexNormals(sphere.vertices, sphere.normals);

	return sphere;
}

function checkCollisions(model) {
	if(((sceneModels[0].tx+sceneModels[0].sx <= model.tx+model.sx && sceneModels[0].tx+sceneModels[0].sx >= model.tx-model.sx)
	|| (sceneModels[0].tx-sceneModels[0].sx <= model.tx+model.sx && sceneModels[0].tx-sceneModels[0].sx >= model.tx-model.sx))
	&&((sceneModels[0].tz+sceneModels[0].sz <= model.tz+model.sz && sceneModels[0].tz+sceneModels[0].sz >= model.tz-model.sz)
	|| (sceneModels[0].tz-sceneModels[0].sz <= model.tz+model.sz && sceneModels[0].tz-sceneModels[0].sz >= model.tz-model.sz))){
		return true;
	}else{
		return false;
	}
}

function getModelsByZDistance() {
	var models = [];
	sceneModels.slice(2).forEach(element => {
		if(Math.abs(sceneModels[0].tz - element.tz) <= 2){
			models.push(element);
		}
	});
	return models;
}

//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Model 0 --- player cube

sceneModels.push(new cubeModel(3));

// Position
sceneModels[0].tx = 0;
sceneModels[0].ty = -0.82;
sceneModels[0].tz = -0.0;

// Size
sceneModels[0].sx = 0.08;
sceneModels[0].sy = 0.08;
sceneModels[0].sz = 0.08;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.0215, 0.1745, 0.0215];
sceneModels[sceneModels.length-1].kDiff = [0.07568, 0.61424, 0.07568];
sceneModels[sceneModels.length-1].kSpec = [0.633, 0.727811, 0.633];
sceneModels.nPhong = 10.0;

// Model 1 --- Floor

sceneModels.push(new cubeModel(5));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.9;
sceneModels[sceneModels.length-1].tz = -7.0;

// Size
sceneModels[sceneModels.length-1].sx = 1;
sceneModels[sceneModels.length-1].sy = 0.01;
sceneModels[sceneModels.length-1].sz = 4;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.0, 0.0, 0.5];
sceneModels[sceneModels.length-1].kDiff = [0.0, 0.0, 1.0];
sceneModels[sceneModels.length-1].kSpec = [1.0, 1.0, 1.0];
sceneModels.nPhong = 125.0;

////////////////
// First Set  //
// First line //
////////////////

// Model 2 --- first obstacle cube

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -3.5;

// Model 3

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -3.5;

// Model 4

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -3.5;

// Model 5

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -3.5;

/////////////////
// First Set  //
// Second line //
/////////////////

// --- Model 6 ---

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -5.5;

// Model 7

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -5.5;

// Model 8

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -5.5;

// Model 9

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -5.5;

////////////////
// First Set  //
// Third line //
////////////////

// --- Model 10 ---

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -7.5;

// Model 11

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -7.5;

// Model 12

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -7.5;

// Model 13

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -7.5;

////////////////
// First Set  //
// Fouth line //
////////////////

/* // --- Model 14 ---

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -6.5;

// Model 15

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -6.5;

// Model 16

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -6.5;

// Model 17

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -6.5; */

// Model 17 -- Moving obstacle

sceneModels.push(new cubeModel(3));

// Position
sceneModels[sceneModels.length-1].tx =  0.0;
sceneModels[sceneModels.length-1].ty = -0.8;
sceneModels[sceneModels.length-1].tz = -9.5;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.05, 0.05, 0.0];
sceneModels[sceneModels.length-1].kDiff = [0.5, 0.5, 0.4];
sceneModels[sceneModels.length-1].kSpec = [0.7, 0.7, 0.04];
sceneModels.nPhong = 40.0;

////////////////
// Second Set //
////////////////

sceneModels.push(new cubeModel(5));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.9;
sceneModels[sceneModels.length-1].tz = -15;

// Size
sceneModels[sceneModels.length-1].sx = 1;
sceneModels[sceneModels.length-1].sy = 0.01;
sceneModels[sceneModels.length-1].sz = 4;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.0, 0.0, 0.5];
sceneModels[sceneModels.length-1].kDiff = [0.0, 0.0, 1.0];
sceneModels[sceneModels.length-1].kSpec = [1.0, 1.0, 1.0];
sceneModels.nPhong = 125.0;

////////////////
// Second Set //
// First line //
////////////////

// Model 19 --- first obstacle cube

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -11.5;

// Model 20

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -11.5;

// Model 21

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -11.5;

// Model 22

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -11.5;

/////////////////
// Second Set //
// Second line //
/////////////////

// --- Model 23 ---

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -13.5;

// Model 24

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -13.5;

// Model 25

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -13.5;

// Model 26

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -13.5;

////////////////
// Second Set /14
// Third line //
////////////////

// --- Model 27 ---

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -15.5;

// Model 27

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -15.5;

// Model 29

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -15.5;

// Model 30

sceneModels.push(new cubeModel());

// Position
sceneModels[sceneModels.length-1].tx = 0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -15.5;

////////////////
// Second Set //
// Fouth line //
////////////////

/* // --- Model 31 ---

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = -0.8;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -14.5;

// Model 32

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = -0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -14.5;

// Model 33

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -14.5;

// Model 34

sceneModels.push(new cubeModel(0));

// Position
sceneModels[sceneModels.length-1].tx = 0.4;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -14.5; */

// Model 34 -- Moving obstacle

sceneModels.push(new cubeModel(3));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -17.5;

// Size
sceneModels[sceneModels.length-1].sy = 0.05;
sceneModels[sceneModels.length-1].sz = 0.05;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.05, 0.05, 0.0];
sceneModels[sceneModels.length-1].kDiff = [0.5, 0.5, 0.4];
sceneModels[sceneModels.length-1].kSpec = [0.7, 0.7, 0.04];
sceneModels.nPhong = 40.0;

// Modele 1 --- Floor

sceneModels.push(new cubeModel(5));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.9;
sceneModels[sceneModels.length-1].tz = -2.0;

// Size
sceneModels[sceneModels.length-1].sx = 1;
sceneModels[sceneModels.length-1].sy = 0.01;
sceneModels[sceneModels.length-1].sz = 4;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.0, 0.0, 0.5];
sceneModels[sceneModels.length-1].kDiff = [0.0, 0.0, 1.0];
sceneModels[sceneModels.length-1].kSpec = [1.0, 1.0, 1.0];
sceneModels.nPhong = 125.0;


// Obstacle ball

sceneModels.push(new sphereModel(4));

// Position
sceneModels[sceneModels.length-1].tx = 0.0;
sceneModels[sceneModels.length-1].ty = -0.80;
sceneModels[sceneModels.length-1].tz = -17.5;

sceneModels[sceneModels.length-1].sx = sceneModels[sceneModels.length-1].sy = sceneModels[sceneModels.length-1].sz = 0.1;

// Material
sceneModels[sceneModels.length-1].kAmbi = [0.05, 0.05, 0.0];
sceneModels[sceneModels.length-1].kDiff = [0.5, 0.5, 0.4];
sceneModels[sceneModels.length-1].kSpec = [0.7, 0.7, 0.04];
sceneModels.nPhong = 40.0;


// Numbers

var numberModels = []

// 0

var modelZero = [];

modelZero.push(new cubeModel(2));

// Position
modelZero[modelZero.length-1].tx = 0.0;
modelZero[modelZero.length-1].ty = 1.15;
modelZero[modelZero.length-1].tz = -1.0;

modelZero[modelZero.length-1].sx = 0.1;
modelZero[modelZero.length-1].sy = 0.02; 
modelZero[modelZero.length-1].sz = 0.05;

modelZero.push(new cubeModel(2));

// Position
modelZero[modelZero.length-1].tx = 0.0;
modelZero[modelZero.length-1].ty = 0.87;
modelZero[modelZero.length-1].tz = -1.0;

modelZero[modelZero.length-1].sx = 0.1;
modelZero[modelZero.length-1].sy = 0.02; 
modelZero[modelZero.length-1].sz = 0.05;

modelZero.push(new cubeModel(2));

// Position
modelZero[modelZero.length-1].tx = 0.08;
modelZero[modelZero.length-1].ty = 1.01;
modelZero[modelZero.length-1].tz = -1.0;

modelZero[modelZero.length-1].sx = 0.02;
modelZero[modelZero.length-1].sy = 0.16; 
modelZero[modelZero.length-1].sz = 0.05;

modelZero.push(new cubeModel(2));

// Position
modelZero[modelZero.length-1].tx = -0.08;
modelZero[modelZero.length-1].ty = 1.01;
modelZero[modelZero.length-1].tz = -1.0;

modelZero[modelZero.length-1].sx = 0.02;
modelZero[modelZero.length-1].sy = 0.16; 
modelZero[modelZero.length-1].sz = 0.05;

numberModels.push(modelZero);

// 1

var modelOne = [];

modelOne.push(new cubeModel(2));

// Position
modelOne[modelOne.length-1].tx = 0.0;
modelOne[modelOne.length-1].ty = 1.01;
modelOne[modelOne.length-1].tz = -1.0;

modelOne[modelOne.length-1].sx = 0.02;
modelOne[modelOne.length-1].sy = 0.16; 
modelOne[modelOne.length-1].sz = 0.05;

numberModels.push(modelOne);

// 2

var modelTwo = [];

modelTwo.push(new cubeModel(2));

// Position
modelTwo[modelTwo.length-1].tx = 0.0;
modelTwo[modelTwo.length-1].ty = 1.15;
modelTwo[modelTwo.length-1].tz = -1.0;

modelTwo[modelTwo.length-1].sx = 0.1;
modelTwo[modelTwo.length-1].sy = 0.02; 
modelTwo[modelTwo.length-1].sz = 0.05;

modelTwo.push(new cubeModel(2));

// Position
modelTwo[modelTwo.length-1].tx = 0.08;
modelTwo[modelTwo.length-1].ty = 1.08;
modelTwo[modelTwo.length-1].tz = -1.0;

modelTwo[modelTwo.length-1].sx = 0.02;
modelTwo[modelTwo.length-1].sy = 0.09; 
modelTwo[modelTwo.length-1].sz = 0.05;

modelTwo.push(new cubeModel(2));

// Position
modelTwo[modelTwo.length-1].tx = 0.0;
modelTwo[modelTwo.length-1].ty = 1.01;
modelTwo[modelTwo.length-1].tz = -1.0;

modelTwo[modelTwo.length-1].sx = 0.1;
modelTwo[modelTwo.length-1].sy = 0.02; 
modelTwo[modelTwo.length-1].sz = 0.05;

modelTwo.push(new cubeModel(2));

// Position
modelTwo[modelTwo.length-1].tx = -0.08;
modelTwo[modelTwo.length-1].ty = 0.94;
modelTwo[modelTwo.length-1].tz = -1.0;

modelTwo[modelTwo.length-1].sx = 0.02;
modelTwo[modelTwo.length-1].sy = 0.09; 
modelTwo[modelTwo.length-1].sz = 0.05;

modelTwo.push(new cubeModel(2));

// Position
modelTwo[modelTwo.length-1].tx = 0.0;
modelTwo[modelTwo.length-1].ty = 0.87;
modelTwo[modelTwo.length-1].tz = -1.0;

modelTwo[modelTwo.length-1].sx = 0.1;
modelTwo[modelTwo.length-1].sy = 0.02; 
modelTwo[modelTwo.length-1].sz = 0.05;

numberModels.push(modelTwo);

// 3

var modelThree = [];

modelThree.push(new cubeModel(2));

// Position
modelThree[modelThree.length-1].tx = 0.0;
modelThree[modelThree.length-1].ty = 1.15;
modelThree[modelThree.length-1].tz = -1.0;

modelThree[modelThree.length-1].sx = 0.1;
modelThree[modelThree.length-1].sy = 0.02; 
modelThree[modelThree.length-1].sz = 0.05;

modelThree.push(new cubeModel(2));

// Position
modelThree[modelThree.length-1].tx = 0.0;
modelThree[modelThree.length-1].ty = 1.01;
modelThree[modelThree.length-1].tz = -1.0;

modelThree[modelThree.length-1].sx = 0.1;
modelThree[modelThree.length-1].sy = 0.02; 
modelThree[modelThree.length-1].sz = 0.05;

modelThree.push(new cubeModel(2));

// Position
modelThree[modelThree.length-1].tx = 0.0;
modelThree[modelThree.length-1].ty = 0.87;
modelThree[modelThree.length-1].tz = -1.0;

modelThree[modelThree.length-1].sx = 0.1;
modelThree[modelThree.length-1].sy = 0.02; 
modelThree[modelThree.length-1].sz = 0.05;

modelThree.push(new cubeModel(2));

// Position
modelThree[modelThree.length-1].tx = 0.08;
modelThree[modelThree.length-1].ty = 1.01;
modelThree[modelThree.length-1].tz = -1.0;

modelThree[modelThree.length-1].sx = 0.02;
modelThree[modelThree.length-1].sy = 0.16; 
modelThree[modelThree.length-1].sz = 0.05;

numberModels.push(modelThree);

// 4

var modelFour = [];

modelFour.push(new cubeModel(2));

// Position
modelFour[modelFour.length-1].tx = 0.0;
modelFour[modelFour.length-1].ty = 1.01;
modelFour[modelFour.length-1].tz = -1.0;

modelFour[modelFour.length-1].sx = 0.1;
modelFour[modelFour.length-1].sy = 0.02; 
modelFour[modelFour.length-1].sz = 0.05;

modelFour.push(new cubeModel(2));

// Position
modelFour[modelFour.length-1].tx = 0.08;
modelFour[modelFour.length-1].ty = 1.01;
modelFour[modelFour.length-1].tz = -1.0;

modelFour[modelFour.length-1].sx = 0.02;
modelFour[modelFour.length-1].sy = 0.16; 
modelFour[modelFour.length-1].sz = 0.05;

modelFour.push(new cubeModel(2));

// Position
modelFour[modelFour.length-1].tx = -0.08;
modelFour[modelFour.length-1].ty = 1.08;
modelFour[modelFour.length-1].tz = -1.0;

modelFour[modelFour.length-1].sx = 0.02;
modelFour[modelFour.length-1].sy = 0.09; 
modelFour[modelFour.length-1].sz = 0.05;

numberModels.push(modelFour);

// 5

var modelFive = [];

modelFive.push(new cubeModel(2));

// Position
modelFive[modelFive.length-1].tx = 0.0;
modelFive[modelFive.length-1].ty = 1.15;
modelFive[modelFive.length-1].tz = -1.0;

modelFive[modelFive.length-1].sx = 0.1;
modelFive[modelFive.length-1].sy = 0.02; 
modelFive[modelFive.length-1].sz = 0.05;

modelFive.push(new cubeModel(2));

// Position
modelFive[modelFive.length-1].tx = -0.08;
modelFive[modelFive.length-1].ty = 1.08;
modelFive[modelFive.length-1].tz = -1.0;

modelFive[modelFive.length-1].sx = 0.02;
modelFive[modelFive.length-1].sy = 0.09; 
modelFive[modelFive.length-1].sz = 0.05;

modelFive.push(new cubeModel(2));

// Position
modelFive[modelFive.length-1].tx = 0.0;
modelFive[modelFive.length-1].ty = 1.01;
modelFive[modelFive.length-1].tz = -1.0;

modelFive[modelFive.length-1].sx = 0.1;
modelFive[modelFive.length-1].sy = 0.02; 
modelFive[modelFive.length-1].sz = 0.05;

modelFive.push(new cubeModel(2));

// Position
modelFive[modelFive.length-1].tx = 0.08;
modelFive[modelFive.length-1].ty = 0.94;
modelFive[modelFive.length-1].tz = -1.0;

modelFive[modelFive.length-1].sx = 0.02;
modelFive[modelFive.length-1].sy = 0.09; 
modelFive[modelFive.length-1].sz = 0.05;

modelFive.push(new cubeModel(2));

// Position
modelFive[modelFive.length-1].tx = 0.0;
modelFive[modelFive.length-1].ty = 0.87;
modelFive[modelFive.length-1].tz = -1.0;

modelFive[modelFive.length-1].sx = 0.1;
modelFive[modelFive.length-1].sy = 0.02; 
modelFive[modelFive.length-1].sz = 0.05;

numberModels.push(modelFive);

// 6

var modelSix = [];

modelSix.push(new cubeModel(2));

// Position
modelSix[modelSix.length-1].tx = 0.0;
modelSix[modelSix.length-1].ty = 1.15;
modelSix[modelSix.length-1].tz = -1.0;

modelSix[modelSix.length-1].sx = 0.1;
modelSix[modelSix.length-1].sy = 0.02; 
modelSix[modelSix.length-1].sz = 0.05;

modelSix.push(new cubeModel(2));

// Position
modelSix[modelSix.length-1].tx = 0.0;
modelSix[modelSix.length-1].ty = 1.01;
modelSix[modelSix.length-1].tz = -1.0;

modelSix[modelSix.length-1].sx = 0.1;
modelSix[modelSix.length-1].sy = 0.02; 
modelSix[modelSix.length-1].sz = 0.05;

modelSix.push(new cubeModel(2));

// Position
modelSix[modelSix.length-1].tx = 0.0;
modelSix[modelSix.length-1].ty = 0.87;
modelSix[modelSix.length-1].tz = -1.0;

modelSix[modelSix.length-1].sx = 0.1;
modelSix[modelSix.length-1].sy = 0.02; 
modelSix[modelSix.length-1].sz = 0.05;

modelSix.push(new cubeModel(2));

// Position
modelSix[modelSix.length-1].tx = -0.08;
modelSix[modelSix.length-1].ty = 1.01;
modelSix[modelSix.length-1].tz = -1.0;

modelSix[modelSix.length-1].sx = 0.02;
modelSix[modelSix.length-1].sy = 0.16; 
modelSix[modelSix.length-1].sz = 0.05;

modelSix.push(new cubeModel(2));

// Position
modelSix[modelSix.length-1].tx = 0.08;
modelSix[modelSix.length-1].ty = 0.94;
modelSix[modelSix.length-1].tz = -1.0;

modelSix[modelSix.length-1].sx = 0.02;
modelSix[modelSix.length-1].sy = 0.09; 
modelSix[modelSix.length-1].sz = 0.05;

numberModels.push(modelSix);

// 7

var modelSeven = [];

modelSeven.push(new cubeModel(2));

// Position
modelSeven[modelSeven.length-1].tx = 0.0;
modelSeven[modelSeven.length-1].ty = 1.15;
modelSeven[modelSeven.length-1].tz = -1.0;

modelSeven[modelSeven.length-1].sx = 0.1;
modelSeven[modelSeven.length-1].sy = 0.02; 
modelSeven[modelSeven.length-1].sz = 0.05;

modelSeven.push(new cubeModel(2));

// Position
modelSeven[modelSeven.length-1].tx = 0.08;
modelSeven[modelSeven.length-1].ty = 1.01;
modelSeven[modelSeven.length-1].tz = -1.0;

modelSeven[modelSeven.length-1].sx = 0.02;
modelSeven[modelSeven.length-1].sy = 0.16; 
modelSeven[modelSeven.length-1].sz = 0.05;

numberModels.push(modelSeven);

// 8

var modelEight = [];

modelEight.push(new cubeModel(2));

// Position
modelEight[modelEight.length-1].tx = 0.0;
modelEight[modelEight.length-1].ty = 1.15;
modelEight[modelEight.length-1].tz = -1.0;

modelEight[modelEight.length-1].sx = 0.1;
modelEight[modelEight.length-1].sy = 0.02; 
modelEight[modelEight.length-1].sz = 0.05;

modelEight.push(new cubeModel(2));

// Position
modelEight[modelEight.length-1].tx = 0.0;
modelEight[modelEight.length-1].ty = 1.01;
modelEight[modelEight.length-1].tz = -1.0;

modelEight[modelEight.length-1].sx = 0.1;
modelEight[modelEight.length-1].sy = 0.02; 
modelEight[modelEight.length-1].sz = 0.05;

modelEight.push(new cubeModel(2));

// Position
modelEight[modelEight.length-1].tx = 0.0;
modelEight[modelEight.length-1].ty = 0.87;
modelEight[modelEight.length-1].tz = -1.0;

modelEight[modelEight.length-1].sx = 0.1;
modelEight[modelEight.length-1].sy = 0.02; 
modelEight[modelEight.length-1].sz = 0.05;

modelEight.push(new cubeModel(2));

// Position
modelEight[modelEight.length-1].tx = 0.08;
modelEight[modelEight.length-1].ty = 1.01;
modelEight[modelEight.length-1].tz = -1.0;

modelEight[modelEight.length-1].sx = 0.02;
modelEight[modelEight.length-1].sy = 0.16; 
modelEight[modelEight.length-1].sz = 0.05;

modelEight.push(new cubeModel(2));

// Position
modelEight[modelEight.length-1].tx = -0.08;
modelEight[modelEight.length-1].ty = 1.01;
modelEight[modelEight.length-1].tz = -1.0;

modelEight[modelEight.length-1].sx = 0.02;
modelEight[modelEight.length-1].sy = 0.16; 
modelEight[modelEight.length-1].sz = 0.05;

numberModels.push(modelEight);

// 9

var modelNine = [];

modelNine.push(new cubeModel(2));

// Position
modelNine[modelNine.length-1].tx = 0.0;
modelNine[modelNine.length-1].ty = 1.15;
modelNine[modelNine.length-1].tz = -1.0;

modelNine[modelNine.length-1].sx = 0.1;
modelNine[modelNine.length-1].sy = 0.02; 
modelNine[modelNine.length-1].sz = 0.05;

modelNine.push(new cubeModel(2));

// Position
modelNine[modelNine.length-1].tx = 0.0;
modelNine[modelNine.length-1].ty = 1.01;
modelNine[modelNine.length-1].tz = -1.0;

modelNine[modelNine.length-1].sx = 0.1;
modelNine[modelNine.length-1].sy = 0.02; 
modelNine[modelNine.length-1].sz = 0.05;

modelNine.push(new cubeModel(2));

// Position
modelNine[modelNine.length-1].tx = 0.0;
modelNine[modelNine.length-1].ty = 0.87;
modelNine[modelNine.length-1].tz = -1.0;

modelNine[modelNine.length-1].sx = 0.1;
modelNine[modelNine.length-1].sy = 0.02; 
modelNine[modelNine.length-1].sz = 0.05;

modelNine.push(new cubeModel(2));

// Position
modelNine[modelNine.length-1].tx = 0.08;
modelNine[modelNine.length-1].ty = 1.01;
modelNine[modelNine.length-1].tz = -1.0;

modelNine[modelNine.length-1].sx = 0.02;
modelNine[modelNine.length-1].sy = 0.16; 
modelNine[modelNine.length-1].sz = 0.05;

modelNine.push(new cubeModel(2));

// Position
modelNine[modelNine.length-1].tx = -0.08;
modelNine[modelNine.length-1].ty = 1.08;
modelNine[modelNine.length-1].tz = -1.0;

modelNine[modelNine.length-1].sx = 0.02;
modelNine[modelNine.length-1].sy = 0.09; 
modelNine[modelNine.length-1].sz = 0.05;

numberModels.push(modelNine);

numberModels.forEach(number => {
	number.forEach(element => {
		// Material
		element.kAmbi = [0.33, 0.22, 0.03];
		element.kDiff = [0.78, 0.57, 0.11];
		element.kSpec = [0.99, 0.94, 0.81];
		element.nPhong = 90.9;
	});
});