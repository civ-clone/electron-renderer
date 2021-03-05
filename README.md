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
- Moves aren't validated correctly when they don't succeed, meaning you have to try over and over until your 0.3333333 moves eventually takes you to the mountain tile.
- `Wonder`s aren't correctly calculating production costs.
- You can't change production in the `City` screen unless you've finished building the current entry. This means that if you build a `Wonder` you can't do anything with that city any more...
- `GoodyHut`s aren't appearing.
- You can't activate a previously `Fortified` `Unit`.
- You can't issue `NoOrders`.
- When transporting a `Unit` in a `NavalTransport` it behaves weirdly after `Unload`ing, almost like it's stored up it's `Move`s for each turn it was being transported.
- Each turn, you're sent all the data again, fresh. This will get big and slow. A nice fix for this might be listeners for things that change the data and only send those updates, but this might end up being problematic in its own way. I've looked at data diffing too, but that will have its own costs associated.
- A bunch of the civilizations colours are the same.
- No `GoTo`.
- Some tile yields are wrong, currently building a city on `Plains`/`Horse` gives you three production and `Forest`/`Game` only yields one `Food`.
- `ClearForest` is broken (and presumably `ClearSwamp`, `ClearJungle`, `PlantForest` too)

## Images

- [Main menu background photo created by kjpargeter - www.freepik.com](https://www.pexels.com/photo/galaxy-digital-wallpaper-957085/)
