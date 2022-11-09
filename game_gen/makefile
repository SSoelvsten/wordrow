.PHONY: build run clean

MIN := 3
MAX := 6
DIC_PATH := ../dict/da-DK/da-DK.dic
AFF_PATH := ../dict/da-DK/da-DK.aff

build:
	@mkdir -p build/
	@cd build/ && cmake -D CMAKE_BUILD_TYPE=Debug \
                      -D CMAKE_C_FLAGS=$(O2_FLAGS) \
                      -D CMAKE_CXX_FLAGS=$(O2_FLAGS) \
                ..
	@cd build/ && make $(MAKE_FLAGS) main

run:
	@mkdir -p out/
	@rm -f ./out/*.json
	@./build/src/main $(MIN) $(MAX) $(DIC_PATH) $(AFF_PATH)

clean:
	@rm -rf build
