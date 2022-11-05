#include <iostream>

#include "anatree.h" // <-- TODO: Use <anatree.h> instead
#include "dict.h"

constexpr size_t MIN_LENGTH = 3u;
constexpr size_t MAX_LENGTH = 8u;

int main(int argc, char* argv[]) {
  dict d("./en_US.dic", "./en_US.aff");
  anatree a;

  while(d.can_pull()) {
    std::string w = d.pull();

    if (MIN_LENGTH <= w.size() && w.size() <= MAX_LENGTH) {
      std::cout << "   " << w << std::endl;
      a.insert(w);
    }
  }

  std::cout << "anagrams_of..." << std::endl;
  const std::unordered_set res_unsorted = a.anagrams_of("parody");
  std::vector res_sorted(res_unsorted.begin(), res_unsorted.end());
  std::sort(res_sorted.begin(), res_sorted.end());

  for (const std::string w : res_sorted) {
    std::cout << "  " << w << std::endl;
  }
}

