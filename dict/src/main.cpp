#include <iostream>
#include <sstream>
#include <string>


#include "anatree.h" // <-- TODO: Use <anatree.h> instead
#include "dict.h"

constexpr size_t MIN_LENGTH = 3u;
constexpr size_t MAX_LENGTH = 8u;

std::string gen_json(const std::unordered_set<std::string> &words)
{
  std::vector words_sorted(words.begin(), words.end());
  std::sort(words_sorted.begin(), words_sorted.end());

  std::stringstream ss;
  ss << "{" << std::endl
     << "  \"anagrams\": [" << std::endl;

  for (const std::string &w : words_sorted) {
    ss << "    \"" << w << "\"" << std::endl;
  }

  ss << "  ]" << std::endl
     << "}" << std::endl;

  return ss.str();
}

int main(int argc, char* argv[]) {
  dict d("./en_US.dic", "./en_US.aff");
  anatree a;

  while(d.can_pull()) {
    std::string w = d.pull();

    if (MIN_LENGTH <= w.size() && w.size() <= MAX_LENGTH) {
      a.insert(w);
    }
  }

  const std::unordered_set res = a.anagrams_of("parody");
  std::cout << gen_json(res);
}

