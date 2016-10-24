// Function new version clientInput
function clientInit() {
    // Set object with user information (from userAgent)
    let userInformation = {
        userBrowser: detection().browserName(),
        userDeviceType: detection().deviceType(),
        browserVersion: detection().versionBrowser(),
        werbrtc: detection().availableWebRTC()
    };
    // Chek on type device
    if(userInformation.userDeviceType === 'desktop') {
        // For desktop device
        if(detection().notSupported.indexOf(userInformation.userBrowser) === -1) {
            // Check on legacy browser
            if(detection().legacyBrowser.indexOf(userInformation.userBrowser) === -1){
                // Check version browser
                if(userInformation.userBrowser === 'GoogleChrome' && Number(userInformation.browserVersion) < 17 ||
                    userInformation.userBrowser === 'Firefox' && Number(userInformation.browserVersion) < 18 ||
                    userInformation.userBrowser === 'NewOpera' && Number(userInformation.browserVersion) < 18) {
                    //  Error: browser version not support webrtc
                    resultatTesting = 'sowtware-error';
                } else {
                    // Check to available webrtc
                    if(userInformation.werbrtc === true) {
                        // Check available web-camera
                        detection().availableWebCamera().then((rc) => {
                                // If web-camera available
                                if(rc === true) {
                                    // Check available microphone
                                    detection().avaliableMicrophone().then((rm) => {
                                            // if microphone available
                                            if(rm === true) {
                                                showTestingResults('all-right');
                                            // if microphone not available (hardware error_)
                                            } else {
                                                showTestingResults('hardware-error');    
                                            }
                                        });
                                // if web-camera not available
                                } else {
                                    // Hardware error
                                    showTestingResults('hardware-error');    
                                }
                            });
                    } else {
                        // Software error
                        showTestingResults('software-error');    
                    }
                }
            } else {
                // User browser is very old
                showTestingResults('software-error');    
            }
        } else {
            // Error: user browser not support WebRTC protocol
            showTestingResults('software-error');    
        }
    } else {
        // Error: Not supported not desktop devise
        showTestingResults('device-error');
    }
}
// Function show bad ot good resultat testing
function showTestingResults(state) {
    switch(state) {
        case 'device-error':
            document.getElementById('if-not-posible').classList.remove('is-hidden');
            document.getElementById('deviceError').classList.remove('is-hidden');
            break;
        case 'software-error':
            document.getElementById('if-not-posible').classList.remove('is-hidden');
            document.getElementById('softwareError').classList.remove('is-hidden');
            break;
        case 'hardware-error':
            document.getElementById('if-not-posible').classList.remove('is-hidden');
            document.getElementById('hardwareError').classList.remove('is-hidden');
            break;
        case 'all-right':
            document.getElementById('if-possible').classList.remove('is-hidden');
            my_init();
            break;
    }   
}
// Function for detection devices on client side
function detection() {
    return {
        // User agetn variable
        ua: navigator.userAgent,
        // Detect device type
        deviceType: function () {
            if (this.ua.match(/iPhone/) ||
                 this.ua.match(/BlackBerry/) ||
                 this.ua.match(/(Windows Phone OS|Windows CE|Windows Mobile)/) ||
                 this.ua.match(/Mobile/) ||
                 this.ua.match(/(Opera Mini|IEMobile|SonyEricsson|smartphone)/)) {
                return 'mobile';
            } else if(this.ua.match(/iPod/) ||
                      this.ua.match(/iPad/) ||
                      this.ua.match(/PlayBook/) ||
                      this.ua.match(/(GT-P1000|SGH-T849|SHW-M180S)/) ||
                      this.ua.match(/Tablet PC/) ||
                      this.ua.match(/(PalmOS|PalmSource| Pre\/)/) ||
                      this.ua.match(/(Kindle)/)) {
                return 'tablet';
            } else {
                return 'desktop';
            }
        },
        // Detect operation system
        operationSystem: function() {
            if(this.deviceType() === 'desktop') {
                if(this.ua.search(/Windows/) > -1)
                {
                    let tmp = this.ua.toLowerCase(); 
                    if (tmp.indexOf('windows nt 5.0') > 0) return 'Microsoft Windows 2000';
                    if (tmp.indexOf('windows nt 5.1') > 0) return 'Microsoft Windows XP';
                    if (tmp.indexOf('windows nt 5.2') > 0) return 'Microsoft Windows Server 2003 or Server 2003 R2';
                    if (tmp.indexOf('windows nt 6.0') > 0) return 'Microsoft Windows Vista or Server 2008';
                    if (tmp.indexOf('windows nt 6.1') > 0) return 'Microsoft Windows 7 or Server 2008';
                    if (tmp.indexOf('windows nt 6.2') > 0) return 'Microsoft Windows 8 or Server 2012';
                    if (tmp.indexOf('windows nt 6.3') > 0) return 'Microsoft Windows 8.1 or Server 2012 R2';
                    if (tmp.indexOf('windows nt 10') > 0) return 'Microsoft Windows 10 or Server 2016';
                }
                if (this.ua.search('Linux') > -1) return 'Linux';
                if (this.ua.search('Macintosh') > -1) return 'Macintosh';
                if (this.ua.search('Mac OS X') > -1) return 'Mac OS X';
                return 'UnknownDesktopOperatingSystem';
            } else {
                if(this.ua.match(/iPhone/) || this.ua.match(/iPod/) || uaInfo.match(/iPhone/) && !window.MSStream) return 'iOS';
                if(this.ua.match(/BlackBerry/)) return 'BlackBerry OS';
                if(this.ua.match(/(Windows Phone OS|Windows CE|Windows Mobile)/)) return 'Windows Phone';
                if(this.ua.match(/Android/)) return 'Android';
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
                                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
                                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                                navigator.getUserMedia({audio: true},
                                    function(stream) {
                                        resolve(true);    
                                    },
                                    function(error) {
                                        resolve(false);
                                    });
                            });
        },
        // Get browser name
        browserName: function() {
            if(this.ua.search(/MSIE/) > -1) return 'InternetExplorer';
			if(this.ua.search(/Trident/) > -1) return 'InternetExplorer(Trident)';
            if(this.ua.search(/OPR/) >-1) return 'NewOpera';
            if(this.ua.search(/Yowser/) > -1 ) return 'YandexBrowser';
            if(this.ua.search(/UBrowser/) > -1) return 'UCBrowser';
            if(this.ua.search(/SeaMonkey/) > -1) return 'SeaMonkey';
            if(this.ua.search(/Iceweasel/) > -1) return 'IceWeasel';
            if(this.ua.search(/Opera/) > -1) return 'OldOpera';
            if(this.ua.search(/Firefox/) > -1) return 'Firefox';
            if(this.ua.search(/Vivaldi/) > -1) return 'Vivaldi';
            if(this.ua.search(/Edge/) > -1) return 'Edge';
            if(this.ua.search(/Safari/) > -1 && navigator.vendor.indexOf('Apple') >-1 && this.ua && this.ua.match('CriOS')) return 'Safari';
            if(this.ua.search(/Konqueror/) > -1) return 'Konqueror';
            if (this.ua.search(/Chrome/) > -1 ) return 'GoogleChrome';
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
        // Get user browser version
        versionBrowser: function() {
			if(this.deviceType() === 'desktop') {
				switch(this.browserName()) {
					case 'InternetExplorer(Trident)': return (this.ua.split('Trident/')[1]).split(';')[0];
					case 'InternetExplorer': return (this.ua.split('MSIE ')[1]).split(';')[0];
					case 'Firefox': return this.ua.split('Firefox/')[1];
					case 'NewOpera': return this.ua.split('OPR/')[1];
					case 'OldOpera': return this.ua.split('Version/')[1];
					case 'GoogleChrome': return (this.ua.split('Chrome/')[1]).split(' ')[0];
					case "Safari": return (this.ua.split('Version/')[1]).split(' ')[0];
					case "Konqueror": return (this.ua.split('KHTML/')[1]).split(' ')[0];
					case "IceWeasel": return (this.ua.split('Iceweasel/')[1]).split(' ')[0];
					case "SeaMonkey": return this.ua.split('SeaMonkey/')[1];
					case 'YaBrowser': return (this.ua.split('YaBrowser/')[1]).split(' ')[0];
					case 'UCBrowser': return (this.ua.split('UBrowser/')[1]).split(' ')[0];
					case 'Vivaldi': return this.ua.split('Vivaldi/')[1];
					case 'UnknownBrowser': return 'UnknownVersion';
				}
			}
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