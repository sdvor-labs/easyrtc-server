//alert('Client chat!');
// id of client in the signals framework
let myEasyrtcId;
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
    let successCB = function() {},
        failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
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