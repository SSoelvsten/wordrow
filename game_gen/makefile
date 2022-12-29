.PHONY: build run/* clean

build:
	@mkdir -p build/
	@cd build/ && cmake -D CMAKE_BUILD_TYPE=Debug \
                      -D CMAKE_C_FLAGS=$(O2_FLAGS) \
                      -D CMAKE_CXX_FLAGS=$(O2_FLAGS) \
                ..
	@cd build/ && make $(MAKE_FLAGS) anagrams
	@cd build/ && make $(MAKE_FLAGS) hunspell_exploder

clean:
	@rm -rf build

clean/out:
	@rm -rf out

MIN := 3
MAX := 6

TXT_PATH := ../dict/da-DK/da-DK.txt

run/anagrams:
	@mkdir -p out/
	@rm -f ./out/*
	@./build/src/anagrams $(MIN) $(MAX) $(TXT_PATH)

DIC_PATH := ../dict/da-DK/da-DK.dic
AFF_PATH := ../dict/da-DK/da-DK.aff

run/hunspell_exploder:
	@mkdir -p out/
	@rm -f ./out/*
	@./build/src/hunspell_exploder $(DIC_PATH) $(AFF_PATH)
