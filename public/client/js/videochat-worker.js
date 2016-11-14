// System settings
easyrtc.dontAddCloseButtons();
// Variables
let activeTab = 'users-menu',
// id of client in the signals framework
    myEasyrtcId,
// id of interlocutor
    withUser = null,
// User settings
    muteVideo = true,
    muteMicrophone = true,
// Set interval for repaet function
    userQueryInterval = 6000,
// Calling interval
    callInterval = 6000,
    suspendTime = null;
    suspendTimer = null;
// Call attr
    callStart = null,
    callEnd = null,
//  List with talked user
    iTalkedTo = [],
// List width workers in room
    workerQuery = [],
// Interval
    timerWorkerCall = null,
// emergency call
    emergencyCallUser = null,
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
function performCallWithQuestion(item) {
    emergencyCallUser = item;
    document.getElementById('modalEmergencyCall').classList.add('is-active');
}
function cancelEmergencyCall() {
    document.getElementById('modalEmergencyCall').classList.remove('is-active');
}
function pleaseEmergencyCall() {
    performCall(emergencyCallUser);
    document.getElementById('modalEmergencyCall').classList.remove('is-active');
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
                        performCallWithQuestion(item);
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
    let successCB = () => {
            callStart = Date.now();
        },
        failureCB = () => {};
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
    callEnd = Date.now();
    addCallEntry();
    getQuestions();
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
    clearInterval(timerWorkerCall);
    timerWorkerCall = setInterval(() => {
        queryCall();
    }, callInterval);
}
function cancelSuspend() {
    // Define temporary variable
    let tmp = null;
    // Set define variable
    if (suspendTime === 900000) {
        tmp = 'suspendFifteen';
    } else if (suspendTime === 3600000) {
        tmp = 'suspendHour';
    } else if (suspendTime === 86400000) {
        tmp = 'suspendDay';
    }
    // Set global state
    suspendTime = null;
    document.getElementById(tmp).classList.remove('is-hidden');
    [`${tmp}-notif`, 'cancelSuspend'].forEach(e => {
            document.getElementById(e).classList.add('is-hidden');
        });
}
function showNotifAndButton(id) {
    [`${id}-notif`, 'cancelSuspend'].forEach(e => {
                console.log(e);
                document.getElementById(e).classList.remove('is-hidden');
            }); 
    document.getElementById(id).classList.add('is-hidden');
}
//Suspend timer...
function suspendCalls(state) {
    if (state === 'first') {
        clearInterval(timerWorkerCall);
    } else {
        clearTimeout(suspendTimer);
    }
    suspendTimer = setTimeout(() => {
            document.getElementById('suspendEnd').classList.remove('is-hidden');
            
            let tmp = null;
            
            if (suspendTime === 900000) {
                tmp = 'suspendFifteen';
            } else if (suspendTime === 3600000) {
                tmp = 'suspendHour';
            } else if (suspendTime === 86400000) {
                tmp = 'suspendDay';
            }
            
            [`${tmp}-notif`, 'cancelSuspend'].forEach(e => {
                    document.getElementById(e).classList.add('is-hidden');
                });
            
            timerWorkerCall = setInterval(() => {
                queryCall();
            }, callInterval);
            
            suspendTime = null;
            
            clearTimeout(suspendTimer);
        
        }, suspendTime);
}
// Suspend call function
function suspendCall(id, time) {
    if (suspendTime === null) {
        suspendTime = time;
        showNotifAndButton(id);
        suspendCalls('first');
    } else {
        cancelSuspend();
        suspendTime = time;
        showNotifAndButton(id);
        suspendCalls('not-first');
    }
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
// answer button
function clickAnswerButton(elm) {
    let  groupElement = elm.getAttribute('element-group'),
        tmp = null;
    ['answerOne', 'answerTwo', 'answerThree', 'answerFore'].forEach( e => {
            tmp = `${e}-${groupElement}`;
            if(elm.id === tmp) {
                if(elm.classList.contains('is-choosen')) {
                    elm.classList.remove('is-choosen');
                    console.log(elm.getAttribute('question-text'));
                } else {
                    elm.classList.add('is-choosen');
                    console.log(elm.getAttribute('question-text'));
                }
            } else {
                if(document.getElementById(tmp).classList.contains('is-choosen')){
                    document.getElementById(tmp).classList.remove('is-choosen');
                }
            }
        });
    
}
function getQuestions() {
    callInterval = 60000;
    document.getElementById('modalAnswers').classList.add('is-active');
}
// new functional for polls
function answerPolls() {
    let tmpLst = document.getElementsByClassName('is-choosen'),
        max = tmpLst.length,
        i = 0,
        answersToPolls = [];
    while(max > i) {
        answersToPolls.push(tmpLst[i].text);
        i++;
    }
    
    let answObj = {
        pollsType: 'worker',
        date: Date.now(),
        answersToPolls: answersToPolls,
        employeeRtcToken: myEasyrtcId,
        custometRtcToken: withUser,
        comments:document.getElementById('comments').value
    };
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    document.getElementById('modalAnswers').classList.remove('is-active');
    callInterval = 6000;
}
function notAnswerPolls() {
    let answObj = {
        pollsType: 'worker',
        date: Date.now(),
        answersToPolls: [],
        employeeRtcToken: myEasyrtcId,
        custometRtcToken: withUser,
        comments: 'Отказался отвечать'
    };
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    document.getElementById('modalAnswers').classList.remove('is-active');
    callInterval = 6000;
}
function addCallEntry() {
    let tmpEntry = {
            callStart: callStart,
            callEnd: callEnd,
            employeeToken: myEasyrtcId,
            customerToken: withUser,
            description: 'Звонок завершен удачно'
        };
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/calls/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(tmpEntry));
    document.getElementById('modalAnswers').classList.remove('is-active');
}
// open user info modal
function openInfo() {
    document.getElementById('modalInfo').classList.add('is-active');
    getUserInfo();
}
function closeInfo() {
    document.getElementById('modalInfo').classList.remove('is-active');
}

function getUserInfo() {
    let tmp = withUser,
        xhr = new XMLHttpRequest();
    if(withUser !== null) {
        xhr.open('GET', `https://videochat.sdvor.com/journals/userentry/${tmp}`, true);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (this.readyState != 4) return;
    
          if (this.status != 200) {
            alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
            return;
          } else {
            showInWindow(this.responseText);
          }
        };
    } else {
        alert('Вы еще не говорили ни с одним пользователем');
    }
}
function showInWindow(string){
    let tmp = JSON.parse(string);
    ['userfio', 'city', 'username'].forEach(e => {
        document.getElementById(e).innerHTML = '';
        document.getElementById(e).innerHTML = tmp[e];
    });
    
}
//repreat function...
let timerUsersUpdate = setInterval(() => {
        document.getElementById('otherClients').innerHTML = '';
        getUserRoom(roomName).then();
    }, userQueryInterval);
// repeat calls
timerWorkerCall = setInterval(() => {
        queryCall();
    }, callInterval);

