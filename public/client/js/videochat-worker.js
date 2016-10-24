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
function clientInit() {
    document.getElementById('if-possible').classList.remove('is-hidden');
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
            if(peer!=myEasyrtcId) {
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
            }
        });
    buildQueryButtons();
}
// type ui button
function uiLinkTypeBuilder(type, funcName, item) {
    let link = document.createElement('a');
    link.className = link.className.concat('panel-block');
    if(type === 'button') {
        if(funcName) {
            link.onclick = function(item) {
                return function() {
                    if(funcName === 'call'){
                        performCall(item);
                    } else {
                        queryRebuid(item);
                    } 
                };
            }(item);
        }
    } else {
        link.href = `./${item}`;
    }
    return link;
}
// tag inner constructor
function uiButtonBuilder(funcName, item, iconName, buttonText, targetDiv) {
    let promise = new Promise((resolve, reject) => {
        let link = uiLinkTypeBuilder('button', funcName, item),
            span = document.createElement('span'),
            icon = document.createElement('i'),
            label = document.createTextNode(buttonText);
            
        span.className = span.className.concat('panel-icon');
        link.appendChild(span);
        
        icon.className = icon.className.concat(`fa fa-${iconName}`);
        span.appendChild(icon);
        
        link.appendChild(label);
        targetDiv.appendChild(link);
    });
    return promise;
}
function uiLinkBuilder(item, iconName, linkText, targetDiv) {
    let promise = new Promise((resolve, reject)=>{
            let link = uiLinkTypeBuilder('link', null, item),
                span = document.createElement('span'),
                icon = document.createElement('i'),
                label = document.createTextNode(`${linkText} ${item}`);
                
            span.className = span.className.concat('panel-icon');
            link.appendChild(span);
            
            icon.className = icon.className.concat(`fa fa-${iconName}`);
            span.appendChild(icon);
            
            link.appendChild(label);
            targetDiv.appendChild(link);
            
        });
    return promise;
}
// Function for get all users in this room
function getUserRoom(roomName) {
    let promise = new Promise((resolve, reject) => {
                        // Get all peers in room
            let peers = easyrtc.getRoomOccupantsAsArray(roomName) || [],
                otherClientDiv = document.getElementById('otherClients');
            // Iterate peers array
            peers.forEach((peer) => {
                    // Create buttons
                    uiButtonBuilder('call', peer, 'user', easyrtc.idToName(peer), otherClientDiv).then();
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
                        uiLinkBuilder(roomName,'link', 'Перейти в', roomListDiv).then();
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
    console.log('Perform call: ', otherEasyrtcid);
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
}
// promise for worker query button
function workerQueryButton() {
    let promise = new Promise((resolve, reject) => {
            let queryDiv = document.getElementById('queryDivWorker');
            queryDiv.innerHTML = '';
            workerQuery.forEach((peer) => {
                    uiButtonBuilder('rebuild', peer, 'plus', `Добавить сотрудника ${easyrtc.idToName(peer)} в очередь`, queryDiv).then();
                });
        });
    return promise;
}
// promise for button rebuild query menu
function clientQueryButton() {
    let promise = new Promise((resolve, reject) => {
            let queryDiv = document.getElementById('queryDiv');
            queryDiv.innerHTML = '';
            usersQuery.forEach((peer) => {
                uiButtonBuilder('rebuild', peer, 'arrow-up', `Передвинуть клиента ${peer} наверх`, queryDiv).then();
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
// worker call modal answer
//// do not call 
function notCall() {
    let tmp = usersQuery[0];
    usersQuery.splice(usersQuery.indexOf(tmp), 1);
    usersQuery.push(tmp);
    document.getElementById('modalCall').classList.remove('is-active');
    document.getElementById('appState').setAttribute('name', 'notNeedOpen');
}
//// call
function pleaseCall(){
    performCall(usersQuery[0]);
    iTalkedTo.push(usersQuery[0]);
    usersQuery.splice(usersQuery.indexOf(usersQuery[0]), 1);
    document.getElementById('modalCall').classList.remove('is-active');
    document.getElementById('appState').setAttribute('name', 'notNeedOpen');
}
// worker call to user automatic
function queryCall() {
    if(easyrtc.getConnectionCount() === 0) {
        console.log('I am not talking', usersQuery.length);
        if(usersQuery.length !== 0) {
            if(iTalkedTo.indexOf(usersQuery[0]) === -1)
                if(easyrtc.getConnectStatus(usersQuery[0]) === 'not connected') {
                    document.getElementById('modalCall').classList.add('is-active');
                    document.getElementById('appState').setAttribute('name', 'needOpen');
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