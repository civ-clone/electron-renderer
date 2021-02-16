import { instance as engine } from '@civ-clone/core-engine/Engine';
import { app, BrowserWindow } from 'electron';
import { instance as playerRegistryInstance } from '@civ-clone/core-player/PlayerRegistry';
import Player from '@civ-clone/core-player/Player';
import * as path from 'path';

export interface IGame {
  start(): Promise<void>;
}

export class Game implements IGame {
  #ready: Promise<void>;
  #window: BrowserWindow | undefined;

  constructor() {
    this.#ready = app.whenReady().then((): void => {
      this.createWindow();
      this.bindEvents();
      this.configure();
    });

    app.on('window-all-closed', (): void => app.quit());
  }

  createWindow(): void {
    this.#window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: __dirname + '/view/js/preload.js',
      },
    });

    this.#window.loadFile('view/html/index.html');

    // Open the DevTools.
    this.#window.webContents.openDevTools();
  }

  private bindEvents(): void {
    engine.on('engine:plugins:load:success', (packageName: string): void =>
      this.sendData('logger', `loaded plugin: ${packageName}`)
    );
  }

  private configure(): void {
    engine.setOption('debug', true);

    // Determine number of players
    engine.setOption('players', 5);
  }

  private sendData(channel: string, payload: any): void {
    console.log(`sending data to ${channel}: ${JSON.stringify(payload)}`);
    (this.#window as BrowserWindow).webContents.send(channel, { payload });
  }

  async start(): Promise<void> {
    await this.#ready;

    // await engine.loadPlugins();

    this.sendData('notification', 'Plugins loaded.');

    playerRegistryInstance.register(new Player());
    this.sendData('notification', 'Added player');

    engine.start();
  }
}

export default Game;
