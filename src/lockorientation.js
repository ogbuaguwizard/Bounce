/** Got the inspiration for this from the website usefulangle.com.
		code by Ogbuagu Francis

make sure to wrap your document in a div tag with an id of container
**/

//Global variables
let orientationType;
let isFullScreen = false; 

let fullWidth = innerWidth;
let fullHeight = innerHeight;
let initialHeight = innerHeight;
let laterHeight;

//set orientation back to preferred mode upon change
screen.orientation.addEventListener("change", function(){
	renderScreen();
});

//Ensure it remains fullscreen so that orientation can be locked
document.addEventListener("fullscreenchange", function(){
	isFullScreen = false; 
	renderScreen();
});

document.addEventListener("webkitfullscreenchange",function(){
	renderScreen();
});


//how the screen is displayed
function renderScreen(){
	//laterHeight = innerHeight;

	//fullWidth = innerWidth; 
	fullHeight = innerHeight+76;
	console.log(getOrientation(),fullHeight);
	console.log(canvas.height);
	if(orientationType)
		return lockOrientation(orientationType);
}

//Fullscreen function
function fullScreen(){
	if(document.documentElement.requestFullscreen){
		document.querySelector("#container").requestFullscreen()
				.then(function() {
					isFullScreen = true; 
					console.log(" displayed full screen successfully");
				})
				.catch(function(error) {
					console.log(error);
				});
	}else if(document.documentElement.webkitRequestFullScreen){
		document.querySelector("#container").webkitRequestFullScreen()
				.then(function() {
					isFullScreen = true;
					console.log(" displayed full screen successfully");
				})
				.catch(function(error) {
					console.log(error);
				});
	}
}

//get current orientation 
function getOrientation(){
	return screen.orientation.type;
}

//lockOrientation function
function lockOrientation(type){
	orientationType = type;
	fullScreen();
	screen.orientation.lock(type)
		.then(function() {
			console.log(type + " mode locked successfully");
		})
		.catch(function(error) {
			console.log(error);
		});
}

//unlockOrientation function 
function unlockOrientation(){
	screen.orientation.unlock();
}
