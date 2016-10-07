let activeTab = 'users-menu';
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
            getUserRoom(roomName).then();
            getAllRooms().then();
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
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(easyrtcid)}`; 

    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


/////// UI logic
function unhideTab(item) {
    document.getElementById(item).classList.remove('is-hidden');
}
function hideTab(item) {
    document.getElementById(item).classList.add('is-hidden');
}
function activeThisTab(item) {
    document.getElementById(activeTab).classList.remove('is-active');
    activeTab = item;
    document.getElementById(activeTab).classList.add('is-active');
}
function clickTab(name) {
    switch(name) {
        case 'all-menu':
            activeThisTab(name);
            ['users', 'rooms', 'call'].forEach((item) => {
                    unhideTab(`${item}-menu-block`);
                });
            break;
        case 'users-menu':
            if(activeTab !== 'all-menu')
                unhideTab('users-menu-block');
            activeThisTab(name);
            ['rooms', 'call'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'rooms-menu':
            if(activeTab !== 'all-menu')
                unhideTab('rooms-menu-block');
            activeThisTab(name);
            ['users', 'call'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'call-menu':
            if(activeTab !== 'all-menu')
                unhideTab('call-menu-block');
            activeThisTab(name);
            ['users', 'rooms'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                })
            break;
        default:
            alert('Произошла ошибка');
    }
    
}