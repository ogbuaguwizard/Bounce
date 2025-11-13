

const MAX_SOUNDS = 6;
let soundPool = new Array();
let coinSound;
let failSound;
let bounceSound;
let jumpSound;


//<---------------------------------------------------------------------------->
// creating and loading the sounds
let loadCount;
let itemsToLoad;
function loadSounds() {
    loadCount=0;
    itemsToLoad = 6;
    
    coinSound = document.createElement("audio");
    document.body.appendChild(coinSound);
    audioType = supportedAudioFormat(coinSound);
    coinSound.addEventListener("canplaythrough",soundsLoaded,false);
    coinSound.setAttribute("src", "../assets/audio/coin pick up." + audioType);

    finished = document.createElement("audio");
    document.body.appendChild(finished);
    audioType = supportedAudioFormat(finished);
    finished.addEventListener("canplaythrough",soundsLoaded,false);
    finished.setAttribute("src", "../assets/audio/Finished." + audioType);
    
    failSound = document.createElement("audio");
    document.body.appendChild(failSound);
    audioType = supportedAudioFormat(failSound);
    failSound.addEventListener("canplaythrough",soundsLoaded,false);
    failSound.setAttribute("src", "assets/audio/missed." + audioType);
    
    bounceSound = document.createElement("audio");
    document.body.appendChild(bounceSound);
    audioType = supportedAudioFormat(bounceSound);
    bounceSound.addEventListener("canplaythrough",soundsLoaded,false);
    bounceSound.setAttribute("src", "assets/audio/bounce." + audioType);
    
    jumpSound = document.createElement("audio");
    document.body.appendChild(jumpSound);
    audioType = supportedAudioFormat(jumpSound);
    jumpSound.addEventListener("canplaythrough",soundsLoaded,false);
    jumpSound.setAttribute("src", "assets/audio/jump." + audioType);
    
    lvl0Sound = document.createElement("audio");
    document.body.appendChild(lvl0Sound);
    audioType = supportedAudioFormat(lvl0Sound);
    lvl0Sound.addEventListener("canplaythrough",soundsLoaded,false);
    lvl0Sound.setAttribute("src", "assets/audio/level0." + audioType);


   // gameState = STATE_LOADING;
}
loadSounds();

//<---------------------------------------------------------------------------->
// The Event Handler
function soundsLoaded(event) {
    loadCount++;
    if (loadCount >= itemsToLoad) {
        coinSound.removeEventListener("canplaythrough",soundsLoaded, false);
        failSound.removeEventListener("canplaythrough",soundsLoaded, false);
        bounceSound.removeEventListener("canplaythrough",soundsLoaded, false);
        jumpSound.removeEventListener("canplaythrough",soundsLoaded, false);
        lvl0Sound.removeEventListener("canplaythrough",soundsLoaded, false);
        finished.removeEventListener("canplaythrough",soundsLoaded, false);

        soundPool.push({name:"coin pick up", element:coinSound, played:false});
        soundPool.push({name:"missed", element:failSound, played:false});
        soundPool.push({name:"bounce", element:bounceSound, played:false});
        soundPool.push({name:"jump", element:jumpSound, played:false});
        soundPool.push({name:"level0", element:lvl0Sound, played:false});
        soundPool.push({name:"finished", element:finished, played:false});
       // appState = STATE_RESET;
    }
}

//<---------------------------------------------------------------------------->
// Take care of type support
function supportedAudioFormat(audio) {
    let returnExtension = "";
    if(audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
        returnExtension = "mp3";
    }
     else if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
        returnExtension = "ogg";
    } else if(audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
        returnExtension = "wav";
    }
    return returnExtension;
}

//<---------------------------------------------------------------------------->
// Playing the sound
function playSound(sound,volume) {
    let soundFound = false;
    let soundIndex = 0;
    let tempSound;
    if (soundPool.length> 0) {
        while (!soundFound && soundIndex < soundPool.length) {
            let tSound = soundPool[soundIndex];
            if ((tSound.element.ended || !tSound.played) && tSound.name == sound) {
                soundFound = true;
                tSound.played = true;
            } else {
                soundIndex++;
            }
        }
    }
    if (soundFound) {
        tempSound = soundPool[soundIndex].element;
        tempSound.volume = volume;
        tempSound.play();
    } else if (soundPool.length < MAX_SOUNDS){
        tempSound = document.createElement("audio");
        tempSound.setAttribute("src", "assets/audio/" + sound + "." + audioType);
        tempSound.volume = volume;
        tempSound.play();
        soundPool.push({name:sound, element:tempSound, type:audioType, played:true});
    }
}
