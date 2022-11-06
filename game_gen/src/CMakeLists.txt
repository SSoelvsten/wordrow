# ============================================================================ #
set(HEADERS
  anatree.h
)

set(SOURCES
)

add_library(${PROJECT_NAME} STATIC ${HEADERS} ${SOURCES})

set_target_properties(${PROJECT_NAME} PROPERTIES
  # Language settings
  LINKER_LANGUAGE CXX
  C_STANDARD 17
  C_STANDARD_REQUIRED ON
  CXX_STANDARD 17
  CXX_STANDARD_REQUIRED ON
  CXX_VISIBILITY_PRESET default

  # Visual Studio
  FOLDER ${PROJECT_NAME}

  # Project Information
  VERSION ${PROJECT_VERSION}
)

target_compile_features(${PROJECT_NAME} PUBLIC cxx_std_17)

# ============================================================================ #
add_executable (main main.cpp)
target_link_libraries(main ${PROJECT_NAME})
