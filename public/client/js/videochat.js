// Main object to work script
let clientData = {},
    notificationColors = ['none', 'is-primary', 'is-info', 'is-success', 'is-warning', 'is-danger'];
// Ser default values to new client
function setDefaultClientData() {
    let promise = new Promise((resolve,reject) => {
            clientData.myEasyrtcId = null;
            clientData.muteMicrophone = false;
            clientData.muteVideo = true;
            clientData.needCall = false;
            clientData.trueAnswer = null;
            resolve(true);
        });
    return promise;
}
// Return random number from min to max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomArbitraryFloor(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
// Function chack answer
function checkAnswer(id) {
    clientData.randArray.forEach((item) => {
            document.getElementById(`btn-${item}`).classList.remove('is-choosen');
        });
    document.getElementById(`btn-${id}`).classList.add('is-choosen');
    if(clientData.trueAnswer === notificationColors[id]) {
        clientData.needCall = true;
    } else {
        clientData.needCall = false
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
        case 'none':
            return 'Без цвета';
        case 'is-primary':
            return 'Бирюзовый';
        case 'is-success':
            return 'Зеленый';            
        case 'is-warning':
            return 'Желтый';
        case 'is-danger':
            return 'Красный';
        case 'is-info':
            return 'Синий';   
    }
}
// Draw questuin
function drawQuestion(answer) {
    let promise = new Promise(function(resolve, reject) {
        document.getElementById('questionDiv').appendChild(document.createTextNode(`Для того, чтобы подкюлчитьс к сервису выберите "${answerToRus(answer)}" и надмите "Да, позвонить мне"`));
    });
    return promise;
}
// Function build div & link
function buildCapchaButtons(targetDiv, item) {
    let promise = new Promise((resolve, reject) => {
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
            }
        }(item);
        label = document.createTextNode(answerToRus(item));
        // Insert elements
        tmpLink.appendChild(label);
        tmpDiv.appendChild(tmpLink);
        targetDiv.appendChild(tmpDiv);
    });
    // Return promise
    return promise;
}
// Function to build capcha
function buildCapcha() {
    let promise = new Promise((resolve, reject) => {
        // Declarate variables
        let max = notificationColors.length,
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
        drawQuestion(tmp).then();
        // Get target div for buttons
        tmp = document.getElementById('capchaDiv');
        // Iterate array
        randArray.forEach((item) => {
            buildCapchaButtons(tmp, item).then();
        });
    });
    return promise;
}
// Main functoin connecting client
function my_init() {
    //buildCapcha().then();
    setDefaultClientData().then((res) => {
        document.getElementById('modalCall').classList.add('is-active');
        buildCapcha().then();
    });
}
// Function after success connection and join to EasyRTC APP
function joinSuccess(roomName) {
    // Wait connection
    setTimeout(function() {
            console.log('JoinRomm is success!');
        }, 100);
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
    document.getElementById('iam').innerHTML = `Мой ID: ${easyrtc.cleanId(clientData.myEasyrtcId)}`; 
    easyrtc.joinRoom(roomName, null, joinSuccess(roomName), loginFailure);
}
// Message function
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}
// Connection user based on 
function connectMe(answer) {
    let promise = new Promise((reject, resolve) => {
        if(answer) {
            // Set resolution
            easyrtc.setVideoDims(640,480);
            // Conntection to EasyRTC App
            easyrtc.easyApp('easyrtc.videochat', 'selfVideo', ['callerVideo'], loginSuccess, loginFailure);
            // Get roomname
            roomName = document.getElementById('roomname').getAttribute('name');
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
    }
    toggleModal('close').then();
}
// Toggle modal call
function toggleModal(toState) {
    let promise = new Promise ((reject, resolve) => {
        if(toState === 'open') {
            document,getElementById('modalCall').classList.add('is-active');
        } else {
            document.getElementById('modalCall').classList.remove('is-active');
        }
    });
    return promise;
}