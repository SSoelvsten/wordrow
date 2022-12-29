#include <anatree.h>

#include "common.h"
#include <fstream>

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

int main(int argc, char* argv[])
{
  // -----------------------------------------------------------------
  // Parse arguments from user
  if (argc < 3) {
    std::cerr << "Need 3 arguments" << std::endl
              << " min-length : integer" << std::endl
              << " max-length : integer" << std::endl
              << " dic path   : string"  << std::endl
      ;
    return -1;
  }

  const size_t MIN_LENGTH = std::stoul(argv[1]);
  const size_t MAX_LENGTH = std::stoul(argv[2]);

  const std::string file_path = argv[3];

  // -----------------------------------------------------------------
  // Open dictionary and populate Anatree
  std::fstream dict_stream(file_path);
  anatree a;

  size_t total_words = 0u, used_words = 0u;
  size_t total_chars = 0u, used_chars = 0u;

  size_t anatree_insert__time = 0;

  size_t line_number = 0u;

  while(dict_stream.peek() != EOF) {
    line_number++;

    std::string w;
    if (!std::getline(dict_stream, w)) {
      std::cerr << "File stream reading error on line: " << line_number << std::endl;
      return -1;
    };

    const size_t w_size = word_size(w);

    total_words += 1;
    total_chars += w_size;

    if (MIN_LENGTH <= w_size && w_size <= MAX_LENGTH) {
      used_words += 1;
      used_chars += w_size;

      const time_point insert__start_time = get_timestamp();
      a.insert(w);
      const time_point insert__end_time = get_timestamp();
      anatree_insert__time += duration_of(insert__start_time, insert__end_time);
    }
  }

  // -----------------------------------------------------------------
  // Get all leaves in the Anatree
  const time_point keys__start_time = get_timestamp();
  std::unordered_set<std::string> keys = a.keys();
  const time_point keys__end_time = get_timestamp();

  std::cout << "Dictionary:" << std::endl
            << "| # Words:           " << total_words << " words (" << total_chars << " characters)" << std::endl
    ;

  std::cout << std::endl;

  std::cout << "Anatree:" << std::endl
            << "| # Words:           " << used_words << " words (" << used_chars << " characters)." << std::endl
            << "| # Nodes:           " << a.size() << std::endl
            << "| # Keys:            " << keys.size() << std::endl
            << "| Time:              " << std::endl
            << "| | Insertion:       " << anatree_insert__time << " ns" << std::endl
            << "| | Keys:            " << duration_of(keys__start_time, keys__end_time) << " ns" << std::endl
    ;

  // -----------------------------------------------------------------
  // Create game instances
  size_t idx = 0;
  size_t skipped__short_keys = 0;
  size_t skipped__short_games = 0;
  size_t anagrams__time = 0;

  for (std::string k : keys) {
    // Ignore keys that would lead to a game with the longest word not being of
    // MAX length
    if (word_size(k) < MAX_LENGTH) {
      skipped__short_keys += 1;
      continue;
    }
    assert(word_size(k) == MAX_LENGTH);

    std::stringstream ss;
    ss << "./out/" << idx << ".json";

    std::ofstream out_file(ss.str());

    const time_point anagrams__start_time = get_timestamp();
    std::unordered_set<std::string> game = a.anagrams_of(k);
    const time_point anagrams__end_time = get_timestamp();
    anagrams__time += duration_of(anagrams__start_time, anagrams__end_time);

    // Ignore small games (def: 'small' less than half the answer)
    if (game.size() < 21) {
      skipped__short_games += 1;
      continue;
    }

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

  std::cout << "| | Anagrams:        " << anagrams__time << " ns" << std::endl;

  std::cout << std::endl;
  std::cout << "Created " << idx << " games in '.out/'" << std::endl;
  std::cout << "| Skipped " << skipped__short_keys << " keys that were too short." << std::endl;
  std::cout << "| Skipped " << skipped__short_games << " games that were too short." << std::endl;
}
