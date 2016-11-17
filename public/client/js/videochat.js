// Main object to work script

let clientData = {},
    notificationColors = [
                          'none',
                          'is-primary',
                          'is-info',
                          'is-success',
                          'is-warning',
                          'is-danger'
                          ];
    
    
// Ser default values to new client
function setDefaultClientData() {
    return new Promise((resolve,reject) => {
            clientData.myEasyrtcId = null;
            clientData.muteMicrophone = false;
            clientData.muteVideo = true;
            clientData.needCall = false;
            clientData.trueAnswer = null;
            clientData.iHaveCalled = false;
            clientData.iHaveAnswered = false;
            clientData.withUser = 'worker';
            if(clientData.username = document.getElementById('username').getAttribute('info') === 'anonymous') {
                clientData.clientInfo = false;
            } else {
                clientData.clientInfo = true;
            }
            clientData.username = document.getElementById('username').getAttribute('info');
            clientData.userfio = document.getElementById('userfio').getAttribute('info');
            clientData.city = document.getElementById('city').getAttribute('info');
            clientData.missedTimer = null;
            resolve(true);
        });
}


// Return random number from min to max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomArbitraryFloor(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


// Function check answer
function checkAnswer(id) {
    clientData.randArray.forEach((item) => {
            document.getElementById(`btn-${item}`).classList.remove('is-choosen');
        });
    document.getElementById(`btn-${id}`).classList.add('is-choosen');
    if(clientData.trueAnswer === notificationColors[id]) {
        clientData.needCall = true;
    } else {
        clientData.needCall = false;
    }
}


// Function to translate bulma class to russian
function answerToRus(word) {
    let checker = null;
    if(typeof(word) === 'number')
        checker = notificationColors[word];
    else
        checker = word;
    // Create text on button
    switch(checker) {
        case 'none': return 'Без цвета';
        case 'is-primary': return 'Бирюзовый';
        case 'is-success': return 'Зеленый';            
        case 'is-warning': return 'Желтый';
        case 'is-danger': return 'Красный';
        case 'is-info':return 'Синий';   
    }
}


// Draw question
function drawQuestion(answer) {
    return new Promise(function(resolve, reject) {
        document.getElementById('questionDiv').appendChild(document.createTextNode(`Для того, чтобы подключиться к сервису выберите "${answerToRus(answer)}" и нажмите "Да, позвонить мне"`));
    });
}


function redrawQuestion(answer) {
    return new Promise(function(resolve, reject) {
        document.getElementById('questionDiv').innerHTML ='';
        document.getElementById('questionDiv').appendChild(document.createTextNode(`Вы выбрали не правильный цвет! Для того, чтобы подключиться к сервису выберите "${answerToRus(answer)}" и нажмите "Да, позвонить мне"`));
    });
}


// Function build div & link
function buildCapchaButtons(targetDiv, item) {
    return new Promise((resolve, reject) => {
        // Declarete variable
        let tmpDiv = null,
            tmpLink  = null,
            label = null;
        tmpDiv = document.createElement('div');
        tmpDiv.className = tmpDiv.className.concat('column is-4 has-text-centered');
        // Craeete button
        tmpLink = document.createElement('a');
        tmpLink.className = tmpLink.className.concat(`button is-fullwidth ${notificationColors[item]}`);
        tmpLink.id = `btn-${item}`;
        tmpLink.onclick = function(item) {
            return function() {
                checkAnswer(item);
            };
        }(item);
        label = document.createTextNode(answerToRus(item));
        // Insert elements
        tmpLink.appendChild(label);
        tmpDiv.appendChild(tmpLink);
        targetDiv.appendChild(tmpDiv);
    });
}


// Function to build capcha
function buildCapcha(state) {
    return new Promise((resolve, reject) => {
        // Declarate variables
        let max = notificationColors.length-1,
            randArray = [],
            tmp = null;
        // Add variable to random array
        while(randArray.length !== 3) {
            tmp = 0 + Math.floor(Math.random() * (max + 1 - getRandomArbitrary(0, max)));
            if(randArray.indexOf(tmp) === -1)
                randArray.push(tmp);
        }
        // Set colors array
        clientData.randArray = randArray;
        // Get true answer
        tmp = notificationColors[randArray[getRandomArbitraryFloor(0,3)]];
        // Set true answer
        clientData.trueAnswer = tmp;
        // Async draw question
        console.log(state);
        if (state === 'redraw') {
            redrawQuestion(tmp).then();
        } else {
            drawQuestion(tmp).then();

        }
        // Get target div for buttons
        tmp = document.getElementById('capchaDiv');
        // Iterate array
        randArray.forEach((item) => {
            buildCapchaButtons(tmp, item).then();
        });
    });
}


// Main function connecting client
function my_init() {
    //buildCapcha().then();
    setDefaultClientData().then((res) => {
        document.getElementById('modalCall').classList.add('is-active');
        buildCapcha('draw').then();
    });
}


// Function after success connection and join to EasyRTC APP
function joinSuccess(roomName) {
    // Wait connection
    setTimeout(function() {
            let emptyRoom = true,
                usersInRoom = easyrtc.getRoomOccupantsAsArray(roomName);
            usersInRoom.forEach((e) => {
                if(easyrtc.idToName(e) !== 'client') {
                    emptyRoom = false;
                }
                if(e === usersInRoom[usersInRoom.length-1] && emptyRoom == true) {
                    document.getElementById('emptyRoom').classList.add('is-active');
                } else {
                    document.getElementById('notCalled').classList.add('is-active');
                }
            });
            
        }, 200);
}


// Close user chat
function hangupCall() {
    easyrtc.hangup(otherEasyrtcid);
}


// Mute video function
function muteMyVideo(){
    if(clientData.muteVideo === false) {
        clientData.muteVideo = true;
        document.getElementById('cameraOff').classList.remove('is-hidden');
        document.getElementById('cameraOn').classList.add('is-hidden');
    } else {
        clientData.muteVideo = false;
        document.getElementById('cameraOn').classList.remove('is-hidden');
        document.getElementById('cameraOff').classList.add('is-hidden');
    }
    easyrtc.enableCamera(clientData.muteVideo);
}


// Mute my microphone
function muteMyMicrophone(){
    if(clientData.muteMicrophone === false ){
        clientData.muteMicrophone = true;
        document.getElementById('microphoneOff').classList.remove('is-hidden');
        document.getElementById('microphoneOn').classList.add('is-hidden');
    } else {
        clientData.muteMicrophone = false;
        document.getElementById('microphoneOn').classList.remove('is-hidden');
        document.getElementById('microphoneOff').classList.add('is-hidden');
    }
    easyrtc.enableMicrophone(clientData.muteMicrophone);
}


// Function exec after success get token EasyRTC
function loginSuccess(easyrtcid) {
    clientData.myEasyrtcId = easyrtcid;
    let objToAdd = {
            clientInfo: clientData.clientInfo,
            username: clientData.username, 
            userfio: clientData.userfio, 
            city: clientData.city,
            easyRtcToken: clientData.myEasyrtcId
        },
        xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/connections/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(objToAdd));

    document.getElementById('haveCalled').classList.remove('is-active');    
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(clientData.myEasyrtcId)}`; 

    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}


// Message function
function loginFailure(errorCode, message) {
     let objToAdd = {
            userInfo: clientData,
            date: Date.now(),
            userAgent: window.navigator.userAgent,
            error: `${errCode}: ${message}`
        },
        
    xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/failed-tokenize/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(objToAdd));
        
     easyrtc.showError(errorCode, message);
}


// Connection user based on 
function connectMe(answer) {
    let promise = new Promise((reject, resolve) => {
        if(answer) {
            roomName = document.getElementById('roomname').getAttribute('name');
            // Set resolution
            easyrtc.setVideoDims(640,480);
            // Conntection to EasyRTC App
            easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
        }else{
            alert('Звока не будет!');
        }
    });
    return promise;
}


// Please not call me
function notCall() {
    if(clientData.needCall === true) {
        clientData.needCall = false;
    }
    toggleModal('close').then();
    connectMe(clientData.needCall).then();
}


// Please call me
function pleaseCall() {
    if(clientData.needCall !== false) {
        connectMe(clientData.needCall).then();
        toggleModal('close').then();
        initMissedTimer();
    } else {
        document.getElementById('capchaDiv').innerHTML = '';
        buildCapcha('redraw');
    }
}


// Toggle modal call
function toggleModal(toState) {
    let promise = new Promise ((reject, resolve) => {
        if(toState === 'open') {
            document,getElementById('modalCall').classList.add('is-active');
        } else {
            document.getElementById('modalCall').classList.remove('is-active');
            drawQuestion();
        }
    });
    return promise;
}



// observe disconnett
let timerHaveCalled = setInterval(() => {
        if(easyrtc.getConnectionCount() === 0) {
            if (clientData.iHaveCalled === true) {
                if(clientData.iHaveAnswered === false) {
                    document.getElementById('haveCalled').classList.add('is-active');
                    easyrtc.disconnect();
                } else {
                    document.getElementById('haveAnswered').classList.add('is-active');
                }
            }
        } else {
            document.getElementById('notCalled').classList.remove('is-active');
            if(clientData.iHaveCalled === false) {
                console.log('CLEAR');
                clientData.iHaveCalled = true;
                console.log(clientData.missedTimer);
                clearTimeout(clientData.missedTimer);
                console.log(clientData.missedTimer);
            }
        }
    }, 500),
    userCount = null,
    wokkerCount = null,
    timerUserCount = setInterval(() => {
            if (document.getElementById('notCalled').classList.contains('is-active') === true) {
                userCount = 0;
                workerCount = 0;
                easyrtc.getRoomOccupantsAsArray(roomName).forEach(i => {
                        if (easyrtc.idToName(i) === 'client') {
                            userCount = userCount + 1;
                        } else {
                            workerCount = workerCount + 1;
                        }
                    });
                document.getElementById('userCount').innerHTML = '';
                let newValue = document.createTextNode(`Пользователей в комнате ${userCount}. ${(userCount/workerCount) * 5} минут - составит примерное время ожидания.`);
                document.getElementById('userCount').appendChild(newValue);
            }
        });

// POLLS LOGS
// answer button
function clickAnswerButton(elm) {
    let  groupElement = elm.getAttribute('element-group'),
        tmp = null;
    ['answerOne', 'answerTwo', 'answerThree', 'answerFore'].forEach( e => {
            tmp = `${e}-${groupElement}`;
            console.log(tmp);
            if(elm.id === tmp) {
                if(elm.classList.contains('is-choosen')) {
                    elm.classList.remove('is-choosen');
                } else {
                    elm.classList.add('is-choosen');
                }
            } else {
                if(document.getElementById(tmp)) {
                    if(document.getElementById(tmp).classList.contains('is-choosen')){
                        document.getElementById(tmp).classList.remove('is-choosen');
                    }
                }
            }
        });
    
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
        pollsType: 'client',
        date: Date.now(),
        answersToPolls: answersToPolls,
        employeeRtcToken: clientData.myEasyrtcId,
        custometRtcToken: clientData.withUser,
        comments:document.getElementById('comments').value
    };
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    document.getElementById('haveCalled').classList.remove('is-active');
    clientData.iHaveAnswered = true;
}


// Function for close window without answer on polls
function notAnswerPolls() {
    let answObj = {
        pollsType: 'clietn',
        date: Date.now(),
        answersToPolls: [],
        employeeRtcToken: clientData.myEasyrtcId,
        custometRtcToken: clientData.withUser,
        comments: 'Отказался отвечать'
    };
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/answers/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(answObj));
    document.getElementById('haveCalled').classList.remove('is-active');
    clientData.iHaveAnswered = true;
}

function addMissedCall() {
    let missedCall = {
      userInfo: `Логин: ${clientData.username}, ФИО: ${clientData.userfio}, город: ${clientData.city}`,
      easyRtcToken: clientData.myEasyrtcId
    };
    
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "https://videochat.sdvor.com/journals/missed-calls/add");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(missedCall));
}

function initMissedTimer() {
    clientData.missedTimer = setTimeout(()=>{
        addMissedCall();
    }, 60000);
}
