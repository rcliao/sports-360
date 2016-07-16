//Initiate the WebSocket connection through socket.io
var socket = io.connect();
//Assume we're not a stb
var stb = false;

//If we are a stb, set the resolution
if (!!navigator.setResolution) {
    navigator.setResolution(1920, 1080);
    stb = true;
}

//Disable websecutiry to bypass CORS issues if any.
if (!!navigator.setWebSecurityEnabled){
    navigator.setWebSecurityEnabled(false);
}

// called when the TV loads
function init () {
}

function keyHandler(e){
    var code = e.keyCode;

    //Don't forget to put a BREAK after every case OR it will
    //Fall through like it does below.
    switch(code){
        case 13: // Select / Enter
            socket.emit('show-video', 'Change it! Darn it!');
            break;
        case 48 : // 0
            break;
        case 49 : // 1
            break;
        case 50 : // 2
            break;
        case 51 : // 3
            break;
        case 52 : // 4
            break;
        case 53 : // 5
            break;
        case 54 : // 6
            break;
        case 55 : // 7
            break;
        case 56 : // 8
            break;
        case 57 : // 9
            break;
        case 79 : // Info
            break;
        case 87 : // Rewind Trick play
            break;
        case 9 : // FF Trick play
            break;
        case 65 : //Active
            break;
        case 67 : // Next Trick play
            break;
        case 72 : // red
            break;
        case 74 : // green
            break;
        case 75 : // yellow
            break;
        case 76 : // blue
            break;
        case 80: // Play Trick play
            break;
        case 82 : // Record Trick play
            break;
        case 83 : // Stop Trick play
            break;
        case 85 : // Pause Trick play
            break;
        case 46 : // Back Trick play
            break;
        case 37: //left
            break;
        case 33: //pageup channelUp
            break;
        case 34: //pagedown channelDown
            break;
        case 38: //up
            break;
        case 39: //right
            break;
        case 40: //down
            break;
        case 47: //back
            break;
        case 189 : //dash
            break;
        default :
            break;
    }

    // return false prevents keys from bubbling to UI
    return false;
}

window.onkeydown = keyHandler;

window.onerror = function(errorMsg, url, lineNumber){
    // If Webkit throws an error on the STB - the app crashes.
    // To prevent the propagation and therefore the crash
    // return true

    // Look for this console.log message in the logs
    // To access the logs use http://{STB_IP}/itv/getLogs
    console.error(errorMsg);
    console.log(lineNumber);
    return true;
};
