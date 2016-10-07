let activeTab = 'users-menu',
// id of client in the signals framework
    myEasyrtcId,
// id of interlocutor
    withUser,
// User settings
    muteVideo = true,
    muteMicrophone = false;
// Main functoin connecting client
function my_init() {
    // Set resolution
    easyrtc.setVideoDims(640,480);
    // Conntection to EasyRTC App
    easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
    // Get roomname
    roomName = document.getElementById('roomname').getAttribute('name');
}
// Function after success connection and join to EasyRTC APP
function joinSuccess(roomName) {
    // Wait connection
    setTimeout(function() {
            // Get all peers in room
            let peers = easyrtc.getRoomOccupantsAsArray(roomName) || [],
                otherClientDiv = document.getElementById('otherClients');
            // Iterate peers array
            peers.forEach((peer) => {
                    // Create button
                    let button = document.createElement('button');
                    button.className = button.className.concat('button is-fullwidth is-margin-top is-info');
                    button.onclick = function(peer) {
                        return function() {
                            performCall(peer);
                        };
                    }(peer);
                    // Add label to button
                    let label = document.createTextNode(easyrtc.idToName(peer));
                    button.appendChild(label);
                    otherClientDiv.appendChild(button);
                });
        }, 100);
}
// Call action
function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();
    withUser = otherEasyrtcid;
    let successCB = function() {},
        failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}
// Close user chat
function hangupCall() {
    easyrtc.hangup(withUser);
}
// Mute video function
function muteMyVideo(){
    console.log(muteVideo);
    if(muteVideo === false) {
        muteVideo = true;
        document.getElementById('cameraOff').classList.remove('is-hidden');
        document.getElementById('cameraOn').classList.add('is-hidden');
    } else {
        muteVideo = false;
        document.getElementById('cameraOn').classList.remove('is-hidden');
        document.getElementById('cameraOff').classList.add('is-hidden');
    }
    console.log(muteVideo);
    easyrtc.enableCamera(muteVideo);
}
// Mute my microphone
function muteMyMicrophone(){
    if(muteMicrophone === false ){
        muteMicrophone = true;
        document.getElementById('microphoneOff').classList.remove('is-hidden');
        document.getElementById('microphoneOn').classList.add('is-hidden');
    } else {
        muteMicrophone = false;
        document.getElementById('microphoneOn').classList.remove('is-hidden');
        document.getElementById('microphoneOff').classList.add('is-hidden');
    }
    easyrtc.enableMicrophone(muteMicrophone);
}

// Function exec after success get token EasyRTC
function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById('iam').innerHTML = 'Мой ID: ' + easyrtc.cleanId(easyrtcid); 

    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}
// Message function
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}