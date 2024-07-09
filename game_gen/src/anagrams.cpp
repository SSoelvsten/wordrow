#include "common.h"

#include <fstream>
#include <memory>

#include <unicode/utypes.h>
#include <unicode/unistr.h>
#include <unicode/translit.h>

#include <anatree.h>

namespace utf8
{
  using __string__value_type = char16_t;

  //////////////////////////////////////////////////////////////////////////////
  class __string__char_ref
  {
  private:
    icu::UnicodeString& _str;
    const int _pos;

  public:
    __string__char_ref()                          = delete;
    __string__char_ref(const __string__char_ref&) = default;
    __string__char_ref(__string__char_ref&&)      = default;

    __string__char_ref(icu::UnicodeString& us, const int pos)
      : _str(us), _pos(pos)
    {}

  public:
    /// \brief Implicit conversion to its content
    operator __string__value_type() const
    {
      return this->_str.charAt(this->_pos);
    }

    /// \brief Assignment to index.
    operator= (const __string__value_type& ch)
    {
      this->_str.setCharAt(this->_pos, ch);
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  class __string__iterator
  {
  private:
    icu::UnicodeString& _str;
    icu::StringCharacterIterator _iter;

  private:
    // TODO
  };

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Adapter to make `icu::UnicodeString` have an API equivalent to the
  ///        `std::string`.
  //////////////////////////////////////////////////////////////////////////////
  class string
  {
  private:
    icu::UnicodeString _str;

  public:
    using value_type     = __string__value_type;
    using iterator       = __string__iterator;
    using const_iterator = const __string__iterator;

  public:
    /// \brief Default constructor.
    string() = default;

    /// \brief Copy-constructor.
    string(const string&) = default;

    /// \brief Move-constructor.
    string(string&&) = default;

    /// \brief Wrap a *raw* `icu::UnicodeString` into a STD api.
    string(const icu::UnicodeString& icu_string)
      : _str(icu_string)
    {}

    /// \brief Copy-assignment.
    operator= (const string&) = default;

    /// \brief Move-assignment.
    operator= (string&&) = default;

  public:
    /// \brief The number of symbols in the unicode string.
    size_type
    size() const
    {
      return this->_str.length();
    }

    /// \brief The number of symbols in the unicode string.
    size_type
    length() const
    {
      return this->size();
    }

    /// \brief Whether the string is empty
    bool
    empty() const
    {
      return this->size() == 0;
    }

  public:
    /// \brief Return the code unit at offset `pos`.
    __string__char_ref
    at(size_type pos) const
    {
      if (pos >= this->size()) { throw std::out_of_range("'offset' is out of range"); }
      return *this[offset];
    }

    /// \brief Return the code unit at offset `pos`.
    __string__char_ref
    operator[](size_type pos) const
    {
      return __string__char_ref(this->_str, pos);
    }

    /// \brief Access the first character.
    __string__char_ref
    first() const
    {
      if (this->empty()) { throw std::out_of_range("no 'first()' in empty string"); }
      return *this[0];
    }

    /// \brief Access the last character.
    __string__char_ref
    last() const
    {
      if (this->empty()) { throw std::out_of_range("no 'first()' in empty string"); }
      return *this[this->size()-1];
    }

  public:
    /// \brief Clears the contents.
    void
    clear()
    {
      this->_str.remove();
    }
  };









  /// \brief Decode data in a `std::string` with UTF8.
  ///
  /// This code is borrowed from: https://stackoverflow.com/a/13071166
  string
  decode(const std::string& in)
  {
    return string::fromUTF8(in);
  }

  /// \brief Encode data as UTF8 into a `std::string`.
  ///
  /// This code is borrowed from: https://stackoverflow.com/a/13071166
  std::string
  encode(const string& in)
  {
    std::string out;
    in.toUTF8String(out);
    return out;
  }

  /// \brief Remove all accents from characters.
  ///
  /// This code is borrowed from: https://stackoverflow.com/a/13071166
  string
  normalize(const string& x)
  {
    string x_copy = x;

    UErrorCode status = U_ZERO_ERROR;
    std::unique_ptr<icu::Transliterator> accentsConverter(
      icu::Transliterator::createInstance("NFD; [:M:] Remove; NFC",
                                          UTRANS_FORWARD,
                                          status));
    accentsConverter->transliterate(x_copy);

    if (status != U_ZERO_ERROR) {
      throw std::runtime_error("Normalization error: " + std::to_string(status));
    }

    return x_copy;
  }

  struct lexicographical_lt
  {
    bool operator()(const string &a, const string &b)
    {
      const size_t a_length = a.length();
      const size_t b_length = b.length();
      return a_length != b_length ? a_length < b_length : a < b;
    }
  };
}

template<>
struct std::hash<utf8::string>
{
  std::size_t operator()(const utf8::string& x) const noexcept
  {
    return x.hashCode();
  }
};

std::string gen_json(const std::unordered_set<utf8::string> &words)
{
  std::vector words_sorted(words.begin(), words.end());
  std::sort(words_sorted.begin(), words_sorted.end(), utf8::lexicographical_lt());

  std::stringstream ss;
  ss << "{" << std::endl
     << "  \"anagrams\": [" << std::endl;

  for (const utf8::string &w : words_sorted) {
    ss << "    \"" << utf8::encode(w) << "\"," << std::endl;
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
  anatree<utf8::string> a;

  size_t total_words = 0u, used_words = 0u;
  size_t total_chars = 0u, used_chars = 0u;

  size_t anatree_insert__time = 0;

  size_t line_number = 0u;

  while(dict_stream.peek() != EOF) {
    line_number++;

    std::string w_raw;
    if (!std::getline(dict_stream, w_raw)) {
      std::cerr << "File stream reading error on line: " << line_number << std::endl;
      return -1;
    };
    utf8::string w = utf8::decode(w_raw);

    const size_t w_size = w.length();

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
  exit(-1);

  // -----------------------------------------------------------------
  // Get all leaves in the Anatree
  const time_point keys__start_time = get_timestamp();
  std::unordered_set<utf8::string> keys = a.keys();
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
  size_t skipped__long_games = 0;
  size_t anagrams__time = 0;

  for (utf8::string k : keys) {
    // Ignore keys that would lead to a game with the longest word not being of
    // MAX length
    if (k.length() < MAX_LENGTH) {
      skipped__short_keys += 1;
      continue;
    }
    assert(k.length() == MAX_LENGTH);

    std::stringstream ss;
    ss << "./out/" << idx << ".json";

    std::ofstream out_file(ss.str());

    const time_point anagrams__start_time = get_timestamp();
    std::unordered_set<utf8::string> game = a.anagrams_of(k);
    const time_point anagrams__end_time = get_timestamp();
    anagrams__time += duration_of(anagrams__start_time, anagrams__end_time);

    // Ignore small games (def: 'small' less than half the answer)
    if (game.size() < 21) {
      skipped__short_games += 1;
      continue;
    }

    // Ignore long games (def: 'long' more than 'six times nine')
    if (game.size() > 54) {
      skipped__long_games += 1;
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
  std::cout << "| Skipped " << skipped__long_games << " games that were too long." << std::endl;
}
