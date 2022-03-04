import { e, h, t } from '../lib/html.js';
import Element from './Element.js';
import MandatorySelection from './MandatorySelection.js';
export class MainMenu extends Element {
    constructor(element) {
        super(element);
        this.build();
        const backgroundImage = document.querySelector('#preload img[src$="main-menu-bg.jpg"]');
        if (backgroundImage.loading) {
            backgroundImage.addEventListener('load', () => {
                element.classList.add('active');
            });
        }
        else {
            element.classList.add('active');
        }
    }
    build() {
        this.element().append(e('nav', h(e('button', t('Start a New Game')), {
            click: async () => {
                this.disableButtons();
                // TODO: This needs to be done via some `Rule`s or something, so that other plugins can add items in the flow
                const numberOfPlayers = new MandatorySelection('How many players?', [
                    {
                        label: '7 civilizations',
                        value: 7,
                    },
                    {
                        label: '6 civilizations',
                        value: 6,
                    },
                    {
                        label: '5 civilizations',
                        value: 5,
                    },
                    {
                        label: '4 civilizations',
                        value: 4,
                    },
                    {
                        label: '3 civilizations',
                        value: 3,
                    },
                ], (selection) => transport.send('setOption', {
                    name: 'players',
                    value: selection,
                }));
                await numberOfPlayers.display();
                this.remove();
                transport.send('start');
            },
        }), 
        // h(e('button', t('Customise World')), {
        //   click: () => {
        //     // TODO: show options panel
        //   },
        // }),
        h(e('button', t('Quit')), {
            click: () => {
                this.remove();
                transport.send('quit');
            },
        })));
    }
    disableButtons() {
        this.element()
            .querySelectorAll('button')
            .forEach((button) => button.setAttribute('disabled', ''));
    }
    remove() {
        this.element().classList.remove('active');
        setTimeout(() => {
            this.element().remove();
        }, 2000);
    }
}
export default MainMenu;
//# sourceMappingURL=MainMenu.js.map