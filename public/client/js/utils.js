// Function new version clientInput
function clientInit() {
    let ua = navigator.userAgent,
        userBrowser = {
            OS: detection().operationSystem(ua),
            browser: detection().browserName(ua),
            deviceType: detection().deviceType(ua),
            webrtc: detection().availableWebRTC(ua)
        };
    if(userBrowser.deviceType === 'desktop') {
        console.log('Block for desktop browser');
        if(detection().notSupported.indexOf(userBrowser.browser) === -1){
            if(detection().legacyBrowser.indexOf(userBrowser.browser) === -1) {
                if(userBrowser.webrtc === true){
                    detection().avaliableMicrophone().then((res) => {
                            if(res === true) {
                                detection().availableWebCamera().then((rc) => {
                                        if(rc === true) {
                                            let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                                            document.getElementById('if-possible').classList.remove('is-hidden');
                                            my_init();
                                        } else {
                                            alert('Ваша web-камера не доступна для работы');
                                        }
                                    });
                            } else {
                                alert('Ваш микрофон не доступен для использования');
                            }
                        });
                } else {
                    alert('Ваш браузер не поддерживает WebRTC');
                }
            } else {
                alert('Ваш барузер устарел');    
            }
        } else {
            alert('Ваш браузер не поддерживается')
        }
    } else {
        alert('Не доступен для мобильных бразеров');
    }
}
// Function for detection devices on client side
function detection() {
    return {
        // Detect device type
        deviceType: function (ua) {
            if (ua.match(/iPhone/) ||
                 ua.match(/BlackBerry/) ||
                 ua.match(/(Windows Phone OS|Windows CE|Windows Mobile)/) ||
                 ua.match(/Mobile/) ||
                 ua.match(/(Opera Mini|IEMobile|SonyEricsson|smartphone)/)) {
                return 'mobile';
            } else if(ua.match(/iPod/) ||
                      ua.match(/iPad/) ||
                      ua.match(/PlayBook/) ||
                      ua.match(/(GT-P1000|SGH-T849|SHW-M180S)/) ||
                      ua.match(/Tablet PC/) ||
                      ua.match(/(PalmOS|PalmSource| Pre\/)/) ||
                      ua.match(/(Kindle)/)) {
                return 'tablet';
            } else {
                return 'desktop';
            }
        },
        // Detect operation system
        operationSystem: function(uaInfo) {
            if(this.deviceType(uaInfo) === 'desktop') {
                if(uaInfo.search(/Windows/) > -1)
                {
                    let tmp = uaInfo.toLowerCase(); 
                    if (tmp.indexOf('windows nt 5.0') > 0) return 'Microsoft Windows 2000';
                    if (tmp.indexOf('windows nt 5.1') > 0) return 'Microsoft Windows XP';
                    if (tmp.indexOf('windows nt 5.2') > 0) return 'Microsoft Windows Server 2003 or Server 2003 R2';
                    if (tmp.indexOf('windows nt 6.0') > 0) return 'Microsoft Windows Vista or Server 2008';
                    if (tmp.indexOf('windows nt 6.1') > 0) return 'Microsoft Windows 7 or Server 2008';
                    if (tmp.indexOf('windows nt 6.2') > 0) return 'Microsoft Windows 8 or Server 2012';
                    if (tmp.indexOf('windows nt 6.3') > 0) return 'Microsoft Windows 8.1 or Server 2012 R2';
                    if (tmp.indexOf('windows nt 10') > 0) return 'Microsoft Windows 10 or Server 2016';
                }
                if (uaInfo.search('Linux') > -1) return 'Linux';
                if (uaInfo.search('Macintosh') > -1) return 'Macintosh';
                if (uaInfo.search('Mac OS X') > -1) return 'Mac OS X';
                return 'UnknownDesktopOperatingSystem';
            } else {
                if(uaInfo.match(/iPhone/) || uaInfo.match(/iPod/) || uaInfo.match(/iPhone/) && !window.MSStream) return 'iOS';
                if(uaInfo.match(/BlackBerry/)) return 'BlackBerry OS';
                if(uaUnfo.match(/(Windows Phone OS|Windows CE|Windows Mobile)/)) return 'Windows Phone';
                if(uaInfo.match(/Android/)) return 'Android';
                return 'UnknownMobileOperationgSystem';
            }
        },
        // Check available WebRTC features
        availableWebRTC: function() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
        },
        // Check webcamera permission
        availableWebCamera: function() {
            return new Promise((resolve) => {
                                    navigator.getUserMedia({video:true},
                                        function(stream) {
                                            resolve(true);
                                        },
                                        function(error) {
                                            resolve(false)
                                    });
                                });
        },
        // Check microphone permission
        avaliableMicrophone: function() {
            return new Promise((resolve) => {
                                navigator.getUserMedia({audio: true},
                                    function(stream) {
                                        resolve(true);    
                                    },
                                    function(error) {
                                        resolve(false)
                                    });
                            });
        },
        // Get browser name
        browserName: function(uaInfo) {
            if(uaInfo.search(/MSIE/) > -1) return 'InternetExplorer';
            if(uaInfo.search(/OPR/) >-1) return 'NewOpera';
            if(uaInfo.search(/Yowser/) > -1 ) return 'YandexBrowser';
            if(uaInfo.search(/UBrowser/) > -1) return 'UCBrowser';
            if(uaInfo.search(/SeaMonkey/) > -1) return 'SeaMonkey';
            if(uaInfo.search(/Iceweasel/) > -1) return 'IceWeasel';
            if(uaInfo.search(/Opera/) > -1) return 'OldOpera';
            if(uaInfo.search(/Firefox/) > -1) return 'Firefox';
            if(uaInfo.search(/Vivaldi/) > -1) return 'Vivaldi';
            if(uaInfo.search(/Edge/) > -1) return 'Edge';
            if(uaInfo.search(/Safari/) > -1 && navigator.vendor.indexOf('Apple') >-1 && uiInfo && uiInfo.match('CriOS')) return 'Safari';
            if(uaInfo.search(/Konqueror/) > -1) return 'Konqueror';
            if (uaInfo.search(/Chrome/) > -1 ) return 'GoogleChrome';
            return 'UnknownBrowser';
        },
        // Check enabled cookie
        enabledCookie: navigator.cookieEnabled,
        // Get main browser language
        mainLanguage: navigator.language,
        // Display all information
        uaInLog: function(uaInfo) {
            console.log('This user agent: ', uaInfo);
            console.log('Browser name: ', this.browserName(uaInfo));
            console.log('Operationg system', this.operationSystem(uaInfo));
            console.log('Avaliable WebRTC features: ', this.availableWebRTC());
            console.log('Enabled cookie: ', this.enabledCookie);
            console.log('Main language: ', this.mainLanguage);
            console.log('Device type: ', this.deviceType(uaInfo));
            this.availableWebCamera().then((res) => {
                    console.log('Available WebCamera', res);
                });
            this.avaliableMicrophone().then((res) => {
                    console.log('Available Microphone', res);
                });
            
        },
        // List of legacy browser
        legacyBrowser: [
                        'InternetExplorer',
                        'Konqueror',
                        'SeaMonkey',
                        'OldOpera'
                        ],
        // List of unsupport browser
        notSupported: [
            'Safari',
            'Edge'
        ]
    };   
}