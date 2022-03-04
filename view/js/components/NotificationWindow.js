import { Window } from './Window.js';
const notificationQueue = [];
export class NotificationWindow extends Window {
    constructor(title, body, options = {}) {
        super(title, body, options);
        this.element().classList.add('notificationWindow');
        this.element().addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.close();
                event.stopPropagation();
            }
        });
    }
    close() {
        super.close();
        if (notificationQueue.length) {
            const [notification, focus, resolve] = notificationQueue.shift();
            notification.display(focus);
            resolve();
        }
    }
    display(focus = true) {
        return new Promise((resolve) => {
            if (document.querySelector('div.notificationWindow')) {
                notificationQueue.push([this, focus, resolve]);
                return;
            }
            super.display();
            if (!focus) {
                resolve(undefined);
                return;
            }
            this.element().focus();
            resolve(undefined);
        });
    }
}
export default NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map