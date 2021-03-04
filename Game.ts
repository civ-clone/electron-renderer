import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import ElectronClient from './client/ElectronClient';
import Player from '@civ-clone/core-player/Player';
import SimpleAIClient from '@civ-clone/simple-ai-client/SimpleAIClient';
import { instance as engine } from '@civ-clone/core-engine/Engine';
import { instance as playerRegistryInstance } from '@civ-clone/core-player/PlayerRegistry';
import { instance as clientRegistryInstance } from '@civ-clone/core-client/ClientRegistry';
import TransferObject from './client/TransferObject';

export interface IGame {
  start(): void;
}

export class Game implements IGame {
  #ready: Promise<void>;
  #window: BrowserWindow | undefined;

  constructor() {
    this.#ready = app.whenReady().then((): void => {
      this.createWindow();

      this.sendData('notification', 'window loaded.');
    });

    app.on('window-all-closed', (): void => app.quit());

    ipcMain.handle('start', () => {
      this.sendData('notification', 'off we go!');
      this.bindEvents();
      this.configure();
      this.start();
    });
  }

  private createWindow(): void {
    this.#window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        contextIsolation: true,
        enableRemoteModule: false,
        preload: `${__dirname}/view/js/preload.js`,
      },
    });

    this.#window.loadURL(`file://${__dirname}/view/html/index.html`);

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
    // this.sendData('notification', 'debug enabled');

    engine.setOption('height', 60);
    engine.setOption('width', 80);

    // TODO: Determine number of players via UI
    engine.setOption('players', 5);
    this.sendData('notification', '5 players');
  }

  private sendData(channel: string, payload: any): void {
    (this.#window as BrowserWindow).webContents.send(channel, payload);
  }

  start(): void {
    this.#ready.then((): void => {
      engine.on('engine:start', (): void => {
        new Array(engine.option('players'))
          .fill(0)
          .forEach((value: 0, i: number) => {
            this.sendData('notification', `working on player ${i + 1}...`);

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
                      ): void =>
                        ipcMain.handle(
                          channel,
                          (event: IpcMainInvokeEvent, ...args: any[]): void =>
                            handler(...args)
                        )
                    )
                  : new SimpleAIClient(player);

            playerRegistryInstance.register(player);
            clientRegistryInstance.register(client);

            this.sendData('notification', `generating world...`);
          });
      });

      engine.start();

      this.sendData('notification', 'started.');
    });
  }
}

export default Game;
