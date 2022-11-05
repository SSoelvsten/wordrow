#include <iostream>
#include <sstream>
#include <string>
#include <getopt.h>

#include "anatree.h" // <-- TODO: Use <anatree.h> instead
#include "dict.h"

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
    ss << "    \"" << w << "\"," << std::endl;
  }
  ss.seekp(-2,ss.cur);
  ss << std::endl 
     << "  ]" << std::endl
     << "}" << std::endl;

  return ss.str();
}

int main(int argc, char* argv[]) {
  // -----------------------------------------------------------------
  // Parse arguments from user
  if (argc < 4) {
    std::cerr << "Need 4 arguments" << std::endl
              << " min-length : integer" << std::endl
              << " max-length : integer" << std::endl
              << " .dic path  : string"  << std::endl
              << " .aff path  : string"  << std::endl
      ;
    return -1;
  }

  const size_t MIN_LENGTH = std::stoul(argv[1]);
  const size_t MAX_LENGTH = std::stoul(argv[2]);

  const std::string dic_file_path = argv[3];
  const std::string aff_file_path = argv[4];

  // -----------------------------------------------------------------
  // Open dictionary and populate Anatree
  dict d(dic_file_path, aff_file_path);
  anatree a;

  size_t words = 0u;
  size_t chars = 0u;

  while(d.can_pull()) {
    std::string w = d.pull();

    if (MIN_LENGTH <= w.size() && w.size() <= MAX_LENGTH) {
      words++;
      chars += w.size();
      a.insert(w);
    }
  }

  std::cout << "Processed " << words << " words (" << chars << " characters)." << std::endl
            << "Size of Anatree: " << a.size() << std::endl;

  // -----------------------------------------------------------------
  // Create game instances
  size_t idx = 0;

  for (std::string k : a.keys()) {
    std::stringstream ss;
    ss << "./out/" << idx << ".json";

    std::ofstream out_file(ss.str());
    std::unordered_set<std::string> game = a.anagrams_of(k);
    if (game.size() < 21) continue; // <-- ignore small games (def: 'small' less than half the answer)

    out_file << gen_json(a.anagrams_of(k));

    idx++;
  }
  {
    std::stringstream ss;
    ss << "./out/index.json";

    std::ofstream out_file(ss.str());
    out_file << "{" << std::endl
             << "  \"instances\": " << idx << std::endl
             << "}" << std::endl;
      ;
  }

  std::cout << "Created " << idx << " games in '.out/'" << std::endl;
}

