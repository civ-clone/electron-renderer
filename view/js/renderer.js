"use strict";
const notificationArea = document.getElementById('notification'), dataArea = document.getElementById('data'), startButton = document.querySelector('button');
transport.receive('notification', (data) => {
    notificationArea.innerHTML = data;
});
transport.receive('gameData', (data) => {
    dataArea.innerHTML = JSON.stringify(data);
});
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () => {
        transport.send('start');
    });
});
//# sourceMappingURL=renderer.js.map