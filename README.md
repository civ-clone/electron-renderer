# electron-renderer

An initial stab at a basic renderer for this project in Electron. This will likely lift from the previous implementation in the monorepo.

## Current state

The game is currently reasonably playable. You can build cities and produce units, build improvements, research technologies, attack enemies, capture cities, etc.

The AI is relatively primitive, but it does do stuff and will attack you and try to capture your cities, etc.

## Generating assets

To be able to see anything you need asset data. This can currently be generated from the original game's asset data and
copied into the `view` directory.

See [civ-clone/civ1-asset-extractor](https://github.com/civ-clone/civ1-asset-extractor).

I'm looking at adding the ability to add an asset pack and a mechanism for managing these so they can also be plugins and I'd like to collate some open-source/royalty free image to make a default pack that doesn't necessitate the original game.

## Known issues

- It hangs when generating the start `Tile`s for way too long - this has been moved to a `Worker` but transferring the data is still slow and locks the main thread :(
- No `GoTo`.
- Some `Civilization`'s colours are terrible.
- `CityImprovement` maintenance isn't deducted.
- `Happiness` and `Unhappiness` don't work as per Civ1.
- `Bomber`s don't function correctly.

## Images

- [Main menu background photo created by kjpargeter - www.freepik.com](https://www.pexels.com/photo/galaxy-digital-wallpaper-957085/)
