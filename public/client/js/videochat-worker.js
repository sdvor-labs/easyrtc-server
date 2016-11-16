// System settings
easyrtc.dontAddCloseButtons();
// Variables
let activeTab = 'users-menu',


// Object to work with Worker
    dataUser = {
            myEasyrtcId: null
        },


// Object to work with widget
    dataWidget = {
        muteVideo: true,
        muteMicrophone: true,
        userQueryInterval: 2000,
        callInterval: 6000,
        suspendTime: null,
        suspendTimer: null,
        timerWorkerCall: null,
        videoWidth: 640,
        videoHeight: 480,
        roomName: null,
        timerUsersUpdate: null
    },


// Customer object
    dataCustomer = {},


// Call object
    dataCall = {
        callStart: null,
        callEnd: null,
        withUser: null,
        emergencyCallUser: null,
    },


// Data queries
    dataQueries = {
        iTalkedTo: [],
        workerQuery: [],
        usersQuery: []
    };


// Main function connecting client
function clientInit() {
    document.getElementById('if-possible').classList.remove('is-hidden');
    // Set resolution
    easyrtc.setVideoDims(dataWidget.videoWidth, dataWidget.videoHeight);
    // Conntection to EasyRTC App
    easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
    // Get roomname
    dataWidget.roomName = document.getElementById('roomname').getAttribute('name');
}


// Function for get users in query
function getUsersQuery(peers) {
    peers.forEach(peer => {
            if(peer !== dataUser.myEasyrtcId) {
                if(easyrtc.idToName(peer) === 'client') {
                    if(dataQueries.usersQuery.indexOf(peer) === -1) {
                        if (dataQueries.iTalkedTo.indexOf(peer) === -1) {
                            dataQueries.usersQuery.push(peer);
                        }
                    }
                } else {
                    if(dataQueries.workerQuery.indexOf(peer) === -1) {
                        dataQueries.workerQuery.push(peer);
                    }
                }
            }
        });
    buildQueryButtons();
}


// function for emergency call modal window
function performCallWithQuestion(item) {
    dataCall.emergencyCallUser = item;
    document.getElementById('modalEmergencyCall').classList.add('is-active');
}


// cancel emergency call
function cancelEmergencyCall() {
    document.getElementById('modalEmergencyCall').classList.remove('is-active');
}


// show modal for emergency call
function pleaseEmergencyCall() {
    performCall(dataCall.emergencyCallUser);
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


// build ui link
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
function getUserRoom() {
    
    let promise = new Promise((resolve, reject) => {
                        // Get all peers in room
            let peers = easyrtc.getRoomOccupantsAsArray(dataWidget.roomName) || [],
                otherClientDiv = document.getElementById('otherClients');
            // Iterate peers array
            peers.forEach(peer => {
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
function joinSuccess() {
    // Wait connection
    setTimeout(function() {
            // Async build menu
            //// Get all users in room & build users-menu-block
            getUserRoom(dataWidget.roomName).then();
            //// Get all rooms & build rooms-menu-block
            getAllRooms().then();
        }, 100);
}


// Call action
function performCall(otherEasyrtcid) {
    console.log('Perform call: ', otherEasyrtcid);
    // End all call
    easyrtc.hangupAll();
    // Save caller id
    dataCall.withUser = otherEasyrtcid;
    // Function/ callback for success or fail
    let successCB = () => {
            dataCall.callStart = Date.now();
            document.getElementById('hangupCall').classList.remove('is-hidden');
        },
        failureCB = () => {};
    // API function call
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


// Function exec after success get token EasyRTC
function loginSuccess(easyrtcid) {
    // This user login
    dataUser.myEasyrtcId = easyrtcid;
    // Inner ID in HTML
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(easyrtcid)}`; 
    // Joind this room
    easyrtc.joinRoom(dataWidget.roomName, null, joinSuccess(), loginFailure);
}


// Faild login
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


// Close all chat
function hangupCall() {
    easyrtc.hangup(dataCall.withUser);
    dataCall.callEnd = Date.now();
    addCallEntry();
    getQuestions();
    document.getElementById('hangupCall').classList.add('is-hidden');
}


// Mute video function
function muteMyVideo(){ 
    if(dataWidget.muteVideo === false) {
        dataWidget.muteVideo = true;
        document.getElementById('cameraOff').classList.remove('is-hidden');
        document.getElementById('cameraOn').classList.add('is-hidden');
    } else {
        dataWidget.muteVideo = false;
        document.getElementById('cameraOn').classList.remove('is-hidden');
        document.getElementById('cameraOff').classList.add('is-hidden');
    }
    // SDK API function
    easyrtc.enableCamera(dataWidget.muteVideo);
}


// Mute my microphone
function muteMyMicrophone(){
    if(dataWidget.muteMicrophone === false ){
        dataWidget.muteMicrophone = true;
        document.getElementById('microphoneOff').classList.remove('is-hidden');
        document.getElementById('microphoneOn').classList.add('is-hidden');
    } else {
        dataWidget.muteMicrophone = false;
        document.getElementById('microphoneOn').classList.remove('is-hidden');
        document.getElementById('microphoneOff').classList.add('is-hidden');
    }
    // SDK API function
    easyrtc.enableMicrophone(dataWidget.muteMicrophone);
}


// function for change call interval
function changeCallInterval(value) {
    dataWidget.callInterval = value;
    
    document.getElementById('succNotif').classList.remove('is-hidden');
    
    clearInterval(dataWidget.timerWorkerCall);
    
    dataWidget.timerWorkerCall = setInterval(() => {
        queryCall();
    }, dataWidget.callInterval);
}

// function for chanel suspend
function cancelSuspend() {
    // Define temporary variable
    let tmp = null;
    // Set define variable
    if (dataWidget.suspendTime === 900000) {
        tmp = 'suspendFifteen';
    } else if (dataWidget.suspendTime === 3600000) {
        tmp = 'suspendHour';
    } else if (dataWidget.suspendTime === 86400000) {
        tmp = 'suspendDay';
    }
    // Set global state
    dataWidget.suspendTime = null;
    
    document.getElementById(tmp).classList.remove('is-hidden');
    
    [`${tmp}-notif`, 'cancelSuspend'].forEach(e => {
            document.getElementById(e).classList.add('is-hidden');
        });
}


// finction for show or hide buttons with suspend
function showNotifAndButton(id) {
    [`${id}-notif`, 'cancelSuspend'].forEach(e => {
                document.getElementById(e).classList.remove('is-hidden');
            }); 
    document.getElementById(id).classList.add('is-hidden');
}


//Suspend timer...
function suspendCalls(state) {
    if (state === 'first') {
        clearInterval(dataWidget.timerWorkerCall);
    } else {
        clearTimeout(dataWidget.suspendTimer);
    }
    
    suspendTimer = setTimeout(() => {
            document.getElementById('suspendEnd').classList.remove('is-hidden');
            
            let tmp = null;
            
            if (dataWidget.suspendTime === 900000) {
                tmp = 'suspendFifteen';
            } else if (dataWidget.suspendTime === 3600000) {
                tmp = 'suspendHour';
            } else if (dataWidget.suspendTime === 86400000) {
                tmp = 'suspendDay';
            }
            
            [`${tmp}-notif`, 'cancelSuspend'].forEach(e => {
                    document.getElementById(e).classList.add('is-hidden');
                });
            
            dataWidget.timerWorkerCall = setInterval(() => {
                queryCall();
            }, dataWidget.callInterval);
            
            dataWidget.suspendTime = null;
            
            clearTimeout(dataWidget.suspendTimer);
        
        }, dataWidget.suspendTime);
}


// Suspend call function
function suspendCall(id, time) {
    if (dataWidget.suspendTime === null) {
        dataWidget.suspendTime = time;
        showNotifAndButton(id);
        suspendCalls('first');
    } else {
        cancelSuspend();
        dataWidget.suspendTime = time;
        showNotifAndButton(id);
        suspendCalls('not-first');
    }
}


// Rebuild query users
function queryRebuid(peer) {
    if(dataQueries.usersQuery.indexOf(peer) === -1) {
        dataQueries.usersQuery.unshift(peer);
    } else {
        dataQueries.usersQuery.slice(usersQuery.indexOf(peer), 1);
        dataQueries.usersQuery.unshift(peer);
    }
}


// promise for worker query button
function workerQueryButton() {
    let promise = new Promise((resolve, reject) => {
            let queryDiv = document.getElementById('queryDivWorker');

            queryDiv.innerHTML = '';

            dataQueries.workerQuery.forEach((peer) => {
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

            dataQueries.usersQuery.forEach((peer) => {
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
    let tmp = dataQueries.usersQuery[0];

    dataQueries.usersQuery..splice(usersQuery.indexOf(tmp), 1);

    dataQueries.usersQuery.push(tmp);

    document.getElementById('modalCall').classList.remove('is-active');
    document.getElementById('appState').setAttribute('name', 'notNeedOpen');
}


//// call
function pleaseCall(){
    performCall(dataQueries.usersQuery[0]);
    
    dataQueries.iTalkedTo.push(dataQueries.usersQuery[0]);
    
    dataQueries.usersQuery.splice(dataQueries.usersQuery.indexOf(dataQueries.usersQuery[0]), 1);
    
    document.getElementById('modalCall').classList.remove('is-active');
    document.getElementById('appState').setAttribute('name', 'notNeedOpen');
}


// worker call to user automatic
function queryCall() {
    if(easyrtc.getConnectionCount() === 0) {
        console.log('I am not talking', dataQueries.usersQuery.length);
        if(dataQueries.usersQuery.length !== 0) {
            if(dataQueries.iTalkedTo.indexOf(dataQueries.usersQuery[0]) === -1)
                if(easyrtc.getConnectStatus(dataQueries.usersQuery[0]) === 'not connected') {
                    document.getElementById('modalCall').classList.add('is-active');
                    document.getElementById('appState').setAttribute('name', 'needOpen');
                    getUserInfo('modal-call');
                } else {
                    dataQueries.iTalkedTo.push(usersQuery[0]);
                    dataQueries.usersQuery.splice(usersQuery.indexOf(dataQueries.usersQuery[0]), 1);
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


// function to show questions modal
function getQuestions() {
    dataWidget.callInterval = 60000;
    changeCallInterval(dataWidget.callInterval);
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
        employeeRtcToken: dataUser.myEasyrtcId,
        custometRtcToken: dataCall.withUser,
        comments:document.getElementById('comments').value
    };
    
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    document.getElementById('modalAnswers').classList.remove('is-active');
    
    dataWidget.callInterval = 6000;
    changeCallInterval(dataWidget.callInterval);
}


// if worker won't get answers
function notAnswerPolls() {
    let answObj = {
        pollsType: 'worker',
        date: Date.now(),
        answersToPolls: [],
        employeeRtcToken: dataUser.myEasyrtcId,
        custometRtcToken: dataCall.withUser,
        comments: 'Отказался отвечать'
    };
    
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    
    document.getElementById('modalAnswers').classList.remove('is-active');
    
    dataWidget.callInterval = 6000;
    changeCallInterval(dataWidget.callInterval);
}


// add call entry in journal
function addCallEntry() {
    let tmpEntry = {
            callStart: dataCall.callStart,
            callEnd: dataCall.callEnd,
            employeeToken: dataUser.myEasyrtcId,
            customerToken: dataCall.withUser,
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
    getUserInfo('modal-window');
}


// close modal window with user info
function closeInfo() {
    document.getElementById('modalInfo').classList.remove('is-active');
}


// function to get user info
function getUserInfo(state) {
    let xhr = new XMLHttpRequest();
        
    if(dataCall.withUser !== null) {
        xhr.open('GET', `https://videochat.sdvor.com/journals/userentry/${dataCall.withUser}`, true);
        
        xhr.send();
        
        xhr.onreadystatechange = function() {
          if (this.readyState != 4) return;
    
          if (this.status != 200) {
            alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
            return;
          } else {
            
            if (state === 'modal-window') {
                showInWindow(this.responseText);    
            } else {
                showInCallModal(this.responseText);
            }
            
          }
        };
    } else {
        if (state === 'modal-window') {
            alert('Вы еще не говорили ни с одним пользователем');
        }
    }
}


// update & show user information in window
function showInWindow(string) {
    dataCustomer = JSON.parse(string);
    
    ['userfio', 'city', 'username'].forEach(e => {
        document.getElementById(e).innerHTML = '';
        document.getElementById(e).innerHTML = dataCustomer[e];
    });
}


// update & show user information in call modal
function showInCallModal(string) {
    dataCustomer = JSON.parse(string);
    
    console.log('UFCJ!');
    
    
    ['userfio', 'city', 'username'].forEach(e => {
            document.getElementById(`${e}-call-modal`).innerHTML = '';
            document.getElementById(`${e}-call-modal`).innerHTML = dataCustomer[e];
        });
}


// set timer for update user query
dataWidget.timerUsersUpdate = setInterval(() => {
        document.getElementById('otherClients').innerHTML = '';
        getUserRoom(dataWidget.roomName).then();
    }, dataWidget.userQueryInterval);


// repeat calls
dataWidget.timerWorkerCall = setInterval(() => {
        queryCall();
    }, dataWidget.callInterval);