// game constants
let elapsedTime = 0;
let howManySecoundsToAddMeshes = 2;
let howManyMetersToAddMeshes = 5;
let calledTimeTemp = false; // this variable allows me to get into the "elapsedtime if" in the animate function (gameloop) only once, not on every screen refresh that matches the modulo operand
let calledDistanceTemp = false; // same as above, only we consider the traveled distance, not the elapsed time
let elapsedTimeDelta = 0;
let howManyMeshesExistOnStart = 5;
let maxMeshesAmount = 25;
let meshArray = []; // here we will store all the planes with floral textures on them
// let planeShadowArray = [];
// let islandArray = [];
let howManyMeshesAreAddedAndRemoved = 4;
