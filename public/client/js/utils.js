// hasWebRTC is undefined
// if .getUserMedia() (and its variants) is not available
function abilityToPerform() {
    let hasWebRTC = navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia;
    if(hasWebRTC){
        return true;
    } else {
        return false;
    }
}
// Call this function, when onload body
function clientInit() {
    if(abilityToPerform()) {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        console.log(width);
        document.getElementById('if-possible').classList.remove('is-hidden');
        my_init();
    } else {
        document.getElementById('if-not-possible').classList.remove('is-hidden');
        alert('This browser is not fully or partially WebRTC-capable');
    }
}