// System settings
easyrtc.dontAddCloseButtons();
// Variables
let activeTab = 'users-menu',
// id of client in the signals framework
    myEasyrtcId,
// id of interlocutor
    withUser,
// User settings
    muteVideo = true,
    muteMicrophone = false,
// Set interval for repaet function
    userQueryInterval = 6000,
// Calling interval
    callInterval = 6000,
//  List with talked user
    iTalkedTo = [],
// List width workers in room
    workerQuery = [],
// List with user query
    usersQuery = [];
// Main functoin connecting client
function my_init() {
    // Set resolution
    easyrtc.setVideoDims(640,480);
    // Conntection to EasyRTC App
    easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
    // Get roomname
    roomName = document.getElementById('roomname').getAttribute('name');
}
// Function for get users in query
function getUsersQuery(peers) {
    peers.forEach((peer) => {
            //if(peer!=myEasyrtcId) {
                if(easyrtc.idToName(peer) === 'client') {
                    if(usersQuery.indexOf(peer) === -1) {
                        if (iTalkedTo.indexOf(peer) === -1) {
                            usersQuery.push(peer);
                        }
                    }
                } else {
                    if(workerQuery.indexOf(peer) === -1) {
                        workerQuery.push(peer);
                    }
                }
            //}
        });
    buildQueryButtons();
}
// Function for get all users in this room
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
                    // Inner button                    
                    otherClientDiv.appendChild(button);
                });
            // users in query
            getUsersQuery(peers);            
        });
    // Return function in promise
    return promise;
}
// Get list with all rooms
function getAllRooms() {
    let promise = new Promise((resolve, reject) => {
            /// getRoomList function from official API
            easyrtc.getRoomList(
                // if success
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
                        // Inner button
                        roomListDiv.appendChild(link);
                    }    
                },
                // if error
                function(errorCode, errorText) {
                    easyrtc.showError(errorCode, errorText);
                }
            );
        });
    // Return function in promise
    return promise;
}
// Function after success connection and join to EasyRTC APP
function joinSuccess(roomName) {
    // Wait connection
    setTimeout(function() {
            // Async build menu
            //// Get all users in room & build users-menu-block
            getUserRoom(roomName).then();
            //// Get all rooms & build rooms-menu-block
            getAllRooms().then();
        }, 100);
}
// Call action
function performCall(otherEasyrtcid) {
    // End all call
    easyrtc.hangupAll();
    // Save callser id
    withUser = otherEasyrtcid;
    // Function/ callback for success or fail
    let successCB = function() {},
        failureCB = function() {};
    // API function call
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}
// Function exec after success get token EasyRTC
function loginSuccess(easyrtcid) {
    // This user login
    myEasyrtcId = easyrtcid;
    // Inner ID in HTML
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(easyrtcid)}`; 
    // Joind this room
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
// Mute video function
function muteMyVideo(){ 
    if(muteVideo === false) {
        muteVideo = true;
        document.getElementById('cameraOff').classList.remove('is-hidden');
        document.getElementById('cameraOn').classList.add('is-hidden');
    } else {
        muteVideo = false;
        document.getElementById('cameraOn').classList.remove('is-hidden');
        document.getElementById('cameraOff').classList.add('is-hidden');
    }
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
// function for change call interval
function changeCallInterval(value) {
    callInterval = value;
    document.getElementById('succNotif').classList.remove('is-hidden');
}
// Rebuild query users
function queryRebuid(peer) {
    if(usersQuery.indexOf(peer) === -1) {
        usersQuery.unshift(peer);
    } else {
        usersQuery.slice(usersQuery.indexOf(peer),1);
        usersQuery.unshift(peer);
    }
    console.log(usersQuery);
}
// promise for worker query button
function workerQueryButton() {
    console.log(workerQuery);
    let promise = new Promise((reject, resolve) => {
            let queryDiv = document.getElementById('queryDivWorker');
            queryDiv.innerHTML = '';
            workerQuery.forEach((peer) => {
                    // add button
                    let link = document.createElement('a');
                    link.className = link.className.concat('panel-block');
                    link.onclick = function(peer) {
                        return function() {
                            queryRebuid(peer);
                        };
                    }(peer);
                    // add span
                    let span = document.createElement('span');
                    span.className = span.className.concat('panel-icon');
                    link.appendChild(span);
                    // add icon to span
                    let icon = document.createElement('i');
                    icon.className = icon.className.concat('fa fa-plus');
                    span.appendChild(icon);
                    // add label to link/button
                    let label = document.createTextNode(`Добавить сотрудника: (${easyrtc.idToName(peer)})`);
                    link.appendChild(label);
                    // add all to page
                    queryDiv.appendChild(link);
                });
        });
    return promise;
}
// promise for button rebuild query menu
function clientQueryButton() {
    let promise = new Promise((reject, resolve) => {
            let queryDiv = document.getElementById('queryDiv');
            queryDiv.innerHTML = '';
            usersQuery.forEach((peer) => {
                // Add button/link
                let link = document.createElement('a');
                link.className = link.className.concat('panel-block');
                link.onclick = function(peer) {
                        return function() {
                            queryRebuid(peer);
                        };
                }(peer);
                // Add span for icon
                let span = document.createElement('span');
                span.className = span.className.concat('panel-icon');
                link.appendChild(span);
                // Add icon to span
                let icon = document.createElement('i');
                icon.className = icon.className.concat('fa fa-arrow-up');
                span.appendChild(icon);
                // Add label to button/link
                let label = document.createTextNode(`Клиент вверх (${peer})`);
                link.appendChild(label);
                // Add all to page
                queryDiv.appendChild(link);    
            });
        });
    return promise;
}
// build query in buttons list
function buildQueryButtons() {
    // Add client query button
    clientQueryButton().then();
    // Add worker query byutton
    workerQueryButton().then();
}
// worker call to user automatic
function queryCall() {
    if(easyrtc.getConnectionCount() === 0) {
        console.log('I am not talking', usersQuery.length);
        if(usersQuery.length !== 0) {
            if(iTalkedTo.indexOf(usersQuery[0]) === -1)
                if(easyrtc.getConnectStatus(usersQuery[0]) === 'not connected') {
                    performCall(usersQuery[0]);
                    iTalkedTo.push(usersQuery[0]);
                    usersQuery.splice(usersQuery.indexOf(usersQuery[0]), 1);
                } else {
                    iTalkedTo.push(usersQuery[0]);
                    usersQuery.splice(usersQuery.indexOf(usersQuery[0]), 1);
                }
        } else {
            console.log('You are waiting');
        }
    } else {
        console.log('You are calling');
    }
}
//repreat function...
let timerUsersUpdate = setInterval(() => {
        document.getElementById('otherClients').innerHTML = '';
        getUserRoom(roomName).then();
    }, userQueryInterval);
// repeat calls
let timerWorkerCall = setInterval(() => {
        queryCall();
    }, callInterval);