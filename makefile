.PHONY: build build/game build/game_gen build/dict

MAKE_FLAGS=-j $$(nproc)

# ---------------------------------------------------------------------------- #
#     Complete build script.
# ---------------------------------------------------------------------------- #
build:
    # Build React Page
	make $(MAKE_FLAGS) clean
	make $(MAKE_FLAGS) build/game
	
    # Remove Developer games
	rm -rf build/dict/**

    # Build Dictionaries
	make $(MAKE_FLAGS) build/game_gen

	make $(MAKE_FLAGS) build/dict DICT=da-DK
	mv out build/dict/da-DK

	make $(MAKE_FLAGS) build/dict DICT=de-DE
	mv out build/dict/de-DE

	make $(MAKE_FLAGS) build/dict DICT=en-US
	mv out build/dict/en-US
	
    # Add CNAME record
	echo "wordrow.io" > build/CNAME
	
# ---------------------------------------------------------------------------- #
#     Build React application.
# ---------------------------------------------------------------------------- #
build/game:
	cd game && npm install
	cd game && npm run build
	mv ./game/build ./build

# ---------------------------------------------------------------------------- #
#     Build Anatree and Dictionary parser.
# ---------------------------------------------------------------------------- #
build/game_gen:
	mkdir -p game_gen/build/
	cd game_gen/build/ && cmake -D CMAKE_BUILD_TYPE=Debug \
                              -D CMAKE_C_FLAGS=$(O2_FLAGS) \
                              -D CMAKE_CXX_FLAGS=$(O2_FLAGS) \
                        ..
	cd game_gen/build/ && make $(MAKE_FLAGS) anagrams

# ---------------------------------------------------------------------------- #
#     Build .json files for the games for the given language.
# ---------------------------------------------------------------------------- #
build/dict: MIN := 3
build/dict: MAX := 6
build/dict: DICT := da-DK
build/dict:
	mkdir -p out/
	rm -f ./out/*.json

	./game_gen/build/src/anagrams $(MIN) $(MAX) ./dict/$(DICT)/$(DICT).txt

# ---------------------------------------------------------------------------- #
#     Remove all build files.
# ---------------------------------------------------------------------------- #
clean:
	rm -rf ./build
	rm -rf ./out
