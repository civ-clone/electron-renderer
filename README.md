# electron-renderer

An initial stab at a basic renderer for this project in Electron. This will likely lift from the previous implementation in the monorepo.

## Current state

This doesn't currently render a map, but as I work through the bugs, the game is 'playable' in that `Unit`s and `City`s can be created, `CityImprovement`s built, and the AI does similarly.

## Known issues

- It hangs when generating the start `Tile`s for way too long.
- `Move`ing `Unit`s to other `Tile`s isn't picked up properly.
