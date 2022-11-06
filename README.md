# Wordrow

Wordrow is a reimplementation of the classic internet puzzle game [Text
Twist](texttwist.info) as a static webpage with a modern and sleek design.

<div align="center">
  <img src="/example.jpg"
       alt="Image of game"
       style="max-width:32rem; width:32rem;" />
</div>

The _main_ branch is split in three:

- **dict**
  A (modified) copy of the LibreOffice dictionaries for certain languages. These
  are used with the program in *game_gen* to generate all of the games.

- **game_gen**:
  An implementation of the *Anatree* data structure to hold and identify all of
  the anagrams in the given dictionary.

- **game**
  The source files for the game logic of the very browser.

These are precompiled into the final game served on the *gh-pages* branch.

## License

The software and documentation files in this repository are provided under the
[GPL v3](/LICENSE.md) license.
