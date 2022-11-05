#include <iostream>
#include <sstream>
#include <string>


#include "anatree.h" // <-- TODO: Use <anatree.h> instead
#include "dict.h"

constexpr size_t MIN_LENGTH = 3u;
constexpr size_t MAX_LENGTH = 7u;

struct lexicographical_lt
{
  bool operator()(const std::string &a, const std::string &b)
  {
    return a.size() != b.size() ? a.size() < b.size() : a < b;
  }
};

std::string gen_json(const std::unordered_set<std::string> &words)
{
  std::vector words_sorted(words.begin(), words.end());
  std::sort(words_sorted.begin(), words_sorted.end(), lexicographical_lt());

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

  //size_t words = 0u;
  //size_t chars = 0u;

  while(d.can_pull()) {
    std::string w = d.pull();

    if (MIN_LENGTH <= w.size() && w.size() <= MAX_LENGTH) {
      //words++;
      //chars += w.size();
      a.insert(w);
    }
  }

  //std::cout << "words: " << words << ", chars: " << chars <<  ", nodes: " << a.size() << std::endl;

  size_t idx = 0;
  for (std::string k : a.keys()) {
    std::stringstream ss;
    ss << "./out/" << idx << ".json";
    std::ofstream out_file(ss.str());
    out_file << gen_json(a.anagrams_of(k));

    idx++;
  }
  std::cout << idx << std::endl;
}

