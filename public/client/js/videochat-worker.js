let activeTab = 'users-menu';
// id of client in the signals framework
let myEasyrtcId;
let withUser;
// Main functoin connecting client
function my_init() {
    // Set resolution
    easyrtc.setVideoDims(640,480);
    // Conntection to EasyRTC App
    easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
    // Get roomname
    roomName = document.getElementById('roomname').getAttribute('name');
}
function getUserRoom(roomName) {
    let promise = new Promise((resolve, reject) => {
                        // Get all peers in room
            let peers = easyrtc.getRoomOccupantsAsArray(roomName) || [],
                otherClientDiv = document.getElementById('otherClients');
            // Iterate peers array
            peers.forEach((peer) => {
                    // Create button
                    let button = document.createElement('a');
                    button.className = button.className.concat('panel-block');
                    button.onclick = function(peer) {
                        return function() {
                            performCall(peer);
                        };
                    }(peer);
                    // Add span
                    let span = document.createElement('span');
                    span.className = span.className.concat('panel-icon');
                    button.appendChild(span);
                    // Add icon
                    let icon = document.createElement('i');
                    icon.className = icon.className.concat('fa fa-user');
                    span.appendChild(icon);
                    // Add label to button
                    let label  = document.createTextNode(easyrtc.idToName(peer));
                    button.appendChild(label);
                    
                    otherClientDiv.appendChild(button);
                });
        });
    return promise;
}

function getAllRooms() {
    let promise = new Promise((resolve, reject) => {
            easyrtc.getRoomList(
                function(roomList) {
                    let roomListDiv = document.getElementById('roomList');
                    for(let roomName in roomList) {
                        // Add hyperlink
                        let link = document.createElement('a');
                        link.className = link.className.concat('panel-block');
                        link.href = `./${roomName}`;
                        // Add span
                        let span = document.createElement('span');
                        span.className = span.className.concat('panel-icon');
                        link.appendChild(span);
                        // Add icon
                        let icon = document.createElement('i');
                        icon.className = icon.className.concat('fa fa-link');
                        span.appendChild(icon);
                        // Add label
                        let label = document.createTextNode(`Перейти в ${roomName}`);
                        link.appendChild(label);
                        
                        roomListDiv.appendChild(link);
                    }    
                },
                function(errorCode, errorText) {
                    easyrtc.showError(errorCode, errorText);
                }
            );
        });
    return promise;
}
// Function after success connection and join to EasyRTC APP
function joinSuccess(roomName) {
    // Wait connection
    setTimeout(function() {
            // Async build menu
            getUserRoom(roomName).then();
            getAllRooms().then();
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
// Function exec after success get token EasyRTC
function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(easyrtcid)}`; 

    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}
// Faild login
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}
// Close all chat
function hangupCall() {
    easyrtc.hangup(withUser);
}