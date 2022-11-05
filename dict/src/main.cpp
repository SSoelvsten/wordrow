#include <iostream>

#include "anatree.h" // <-- TODO: Use <anatree.h> instead
#include "dict.h"

int main(int argc, char* argv[]) {
  dict("./en_US.dic", "./en_US.aff");

  return 0;
  anatree a;

  std::cout << "insert..." << std::endl;
  a.insert("do");
  a.insert("god");
  a.insert("gold");
  a.insert("dog");
  a.insert("do");
  a.insert("food");

  std::cout << "anagrams_of..." << std::endl;
  for (const std::string w : a.anagrams_of("food")) {
    std::cout << "  " << w << std::endl;
  }
}

