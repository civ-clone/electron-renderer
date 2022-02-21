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
    display(focus = true) {
        if (document.querySelector('div.notificationWindow')) {
            notificationQueue.push(this);
            return;
        }
        super.display();
        if (!focus) {
            return;
        }
        this.element().focus();
    }
}
export default NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map