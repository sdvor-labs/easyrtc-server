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
            ['users', 'rooms', 'call', 'query'].forEach((item) => {
                    unhideTab(`${item}-menu-block`);
                });
            break;
        case 'users-menu':
            if(activeTab !== 'all-menu')
                unhideTab('users-menu-block');
            activeThisTab(name);
            ['rooms', 'call', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'rooms-menu':
            if(activeTab !== 'all-menu')
                unhideTab('rooms-menu-block');
            activeThisTab(name);
            ['users', 'call', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                });
            break;
        case 'call-menu':
            if(activeTab !== 'all-menu')
                unhideTab('call-menu-block');
            activeThisTab(name);
            ['users', 'rooms', 'query'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                })
            break;
        case 'query-menu':
            if(activeTab !== 'all-menu')
                unhideTab('query-menu-block');
            activeThisTab(name);
            ['users', 'rooms', 'call'].forEach((item) => {
                    hideTab(`${item}-menu-block`);
                })
            break;
        default:
            alert('Произошла ошибка, '+ name);
    }
    
}