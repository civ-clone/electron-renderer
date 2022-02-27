#!/bin/bash

for module; do

    if ! [[ -e node_modules/@civ-clone/$module ]]; then
        echo $module not found, skipping. >&2;
        continue;
    fi

    echo "+ rm -rf node_modules/@civ-clone/$module" >&2;
    rm -rf node_modules/@civ-clone/$module
    echo "+ cp -R ../$module node_modules/@civ-clone" >&2;
    cp -R ../$module node_modules/@civ-clone
    echo "+ rm -rf node_modules/@civ-clone/$module/node_modules" >&2;
    rm -rf node_modules/@civ-clone/$module/node_modules
done

