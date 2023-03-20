# Wordrow

Wordrow is a reimplementation of the classic internet puzzle game [Text
Twist](https://texttwist.info) as a static webpage with a modern and sleek design.

<div align="center">
  <img src="/example.jpg"
       alt="Image of game"
       style="max-width:32rem; width:32rem;" />
</div>

The *main* branch is split in three:

- **dict**
  A (modified) copy of dictionaries for certain languages. These are used with the
  program in *game_gen* to generate all of the games.

- **game_gen**:
  A C++ application that generates the *json* file of all games efficiently with
  the [*Anatree* data structure](http://github.com/ssoelvsten/anatree).

- **game**
  The source files for the game logic run in as a static website in the browser.

These are precompiled into the final game served on the *gh-pages* branch.

## License

The software and documentation files in this repository are provided under the
[GPL v3](/LICENSE.md) license.
