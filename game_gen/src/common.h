#include <chrono>

typedef std::chrono::steady_clock::time_point time_point;

inline time_point get_timestamp() {
  return std::chrono::steady_clock::now();
}

typedef unsigned long int time_duration;

inline unsigned long int duration_of(const time_point &before, const time_point &after) {
  return std::chrono::duration_cast<std::chrono::nanoseconds>(after - before).count();
}

#include <getopt.h>
#include <iostream>
#include <sstream>
#include <string>
#include <regex>

size_t word_size(const std::string& w) {
  // Regex of all characters that actually are two letters.
  std::regex double_char("æ|ø|å|ä|ö|ü|ß|ñ");

  // https://stackoverflow.com/a/8283994
  const size_t double_chars = std::distance(std::sregex_iterator(w.begin(), w.end(), double_char),
                                            std::sregex_iterator());

  return w.size() - double_chars;
}

struct lexicographical_lt
{
  bool operator()(const std::string &a, const std::string &b)
  {
    const size_t a_length = word_size(a);
    const size_t b_length = word_size(b);
    return a_length != b_length ? a_length < b_length : a < b;
  }
};
