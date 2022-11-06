MIN := 3
MAX := 6
DIC_PATH := ../dicts/da_DK.dic
AFF_PATH := ../dicts/da_DK.aff

main:
	@mkdir -p out/
	@rm -f ./out/*.json
	@mkdir -p build/
	@cd build/ && cmake -D CMAKE_BUILD_TYPE=Debug \
                      -D CMAKE_C_FLAGS=$(O2_FLAGS) \
                      -D CMAKE_CXX_FLAGS=$(O2_FLAGS) \
                ..
	@cd build/ && make $(MAKE_FLAGS) main
	@echo "" && echo ""
	@./build/src/main $(MIN) $(MAX) $(DIC_PATH) $(AFF_PATH)
