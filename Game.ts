import {
  app,
  dialog,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
} from 'electron';
import ElectronClient from './client/ElectronClient';
import Player from '@civ-clone/core-player/Player';
import SimpleAIClient from '@civ-clone/simple-ai-client/SimpleAIClient';
import TransferObject from './client/TransferObject';
import { instance as clientRegistryInstance } from '@civ-clone/core-client/ClientRegistry';
import { instance as engine } from '@civ-clone/core-engine/Engine';
import { instance as playerRegistryInstance } from '@civ-clone/core-player/PlayerRegistry';

export interface IGame {
  start(): void;
}

export class Game implements IGame {
  #ready: Promise<void>;
  #window: BrowserWindow | undefined;

  constructor() {
    this.#ready = app.whenReady().then((): void => this.createWindow());

    app.on('window-all-closed', (): void => app.quit());

    ipcMain.handle('start', () => {
      this.bindEvents();
      this.configure();
      this.start();
    });

    ipcMain.handle('setOption', (event, { name, value }) => {
      this.sendData('notification', `setting ${name} to ${value}`);
      engine.setOption(name, value);
    });

    ipcMain.handle('quit', () => app.quit());
  }

  private createWindow(): void {
    this.#window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        contextIsolation: true,
        // enableRemoteModule: false,
        preload: `${__dirname}/view/js/preload.js`,
      },
    });

    this.#window.loadURL(`file://${__dirname}/view/html/index.html`);

    this.#window.on('close', (event) => {
      const response = dialog.showMessageBoxSync(this.#window!, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?',
      });

      if (response === 1) {
        event.preventDefault();
      }
    });

    // this.#window.webContents.openDevTools();
  }

  private bindEvents(): void {
    this.sendData('notification', `binding events`);

    engine.on('engine:initialise', (): void =>
      this.sendData('notification', `initialising...`)
    );

    engine.on('engine:plugins:load:success', (packageName: string): void =>
      this.sendData('notification', `loaded plugin: ${packageName}`)
    );

    engine.on('engine:plugins-loaded', (): void =>
      this.sendData('notification', `plugins loaded`)
    );

    engine.on('engine:start', (): void =>
      this.sendData('notification', `starting...`)
    );

    engine.on('world:generate-start-tiles', (): void =>
      this.sendData('notification', `generating start tiles...`)
    );

    engine.on('world:built', (): void =>
      this.sendData('notification', `world built`)
    );

    engine.on('game:start', (): void =>
      this.sendData('notification', `game start`)
    );

    engine.on('turn:start', (turn): void =>
      this.sendData('notification', `turn start ${turn}`)
    );

    engine.on('player:turn-start', (player): void =>
      this.sendData(
        'notification',
        `player turn-start: ${player.civilization().constructor.name}`
      )
    );
  }

  private configure(): void {
    // engine.setOption('debug', true);

    engine.setOption('height', 60);
    engine.setOption('width', 80);
  }

  private receiveData(
    channel: string,
    handler: (...args: any[]) => void
  ): void {
    ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: any[]): void =>
      handler(...args)
    );
  }

  private sendData(channel: string, payload: any): void {
    (this.#window as BrowserWindow).webContents.send(channel, payload);
  }

  start(): void {
    this.#ready.then((): void => {
      engine.on('engine:start', (): void => {
        new Array(parseInt(engine.option('players'), 10))
          .fill(0)
          .forEach((value: 0, i: number) => {
            const player = new Player(),
              // TODO: This is pretty basic.
              client =
                i === 0
                  ? new ElectronClient(
                      player,
                      (channel: string, payload: TransferObject) =>
                        this.sendData(channel, payload),
                      (
                        channel: string,
                        handler: (...args: any[]) => void
                      ): void => this.receiveData(channel, handler)
                    )
                  : new SimpleAIClient(player);

            playerRegistryInstance.register(player);
            clientRegistryInstance.register(client);

            this.sendData('notification', `generating world...`);
          });
      });

      engine.setOption('height', 50);
      engine.setOption('width', 80);

      engine.start();
    });
  }
}

export default Game;
