# ------------------------------------------------------------------------------
add_executable (anagrams anagrams.cpp)

# https://github.com/SSoelvsten/anatree
target_link_libraries(anagrams anatree)

# https://cmake.org/cmake/help/latest/module/FindICU.html
find_package(ICU COMPONENTS uc i18n REQUIRED)
target_link_libraries(anagrams ICU::uc ICU::i18n)

# ------------------------------------------------------------------------------

add_executable (hunspell_exploder hunspell_exploder.cpp)
