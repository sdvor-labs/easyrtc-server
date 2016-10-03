// id of client in the signals framework
let myEasyrtcId;

function my_init() {
    easyrtc.setVideoDims(640,480);
    // Conntection to EasyRTC App
    easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
    roomName = document.getElementById('roomname').getAttribute('name');
}

function joinSuccess(roomName) {
    console.log('Joining the room', roomName);
    setTimeout(function() {
            console.log('successfully joined room: ' + roomName);
            let peers = easyrtc.getRoomOccupantsAsArray(roomName) || [],
                otherClientDiv = document.getElementById('otherClients');
            console.log('Other clients '+ peers);
            peers.forEach((peer) => {
                    let button = document.createElement('button');
                    button.onclick = function(peer) {
                        return function() {
                            performCall(peer);
                        };
                    }(peer);
                    
                    let label = document.createTextNode(easyrtc.idToName(peer));
                    button.appendChild(label);
                    otherClientDiv.appendChild(button);
                });
        }, 100);
}

function performCall(otherEasyrtcid) {
    console.log('CALL OTHER!!! ' + otherEasyrtcid);
    easyrtc.hangupAll();
    let successCB = function() {},
        failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
    easyrtc.setRoomOccupantListener(convertListToButtons(roomName));
    console.log(roomName);
    console.log('Join room: ' + roomName);
    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}

function convertListToButtons (roomName, data, isPrimary) {
    console.log('Creating others');
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}