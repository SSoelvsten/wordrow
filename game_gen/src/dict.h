#ifndef DICT_H
#define DICT_H

#include <fstream>
#include <regex>
#include <unordered_map>
#include <vector>

////////////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/a/236803/13300643
template <typename Out>
void split(const std::string &s, char delim, Out result) {
  std::istringstream iss(s);
  std::string item;
  while (std::getline(iss, item, delim)) {
    if (item.size() == 0) continue;
    *result++ = item;
  }
}

std::vector<std::string> split(const std::string &s, char delim) {
  std::vector<std::string> elems;
  split(s, delim, std::back_inserter(elems));
  return elems;
}

////////////////////////////////////////////////////////////////////////////////
// https://en.cppreference.com/w/cpp/string/basic_string/find_first_not_of
std::string trim(std::string str)
{
  const std::string whitespace_definition = " \t\n\r\f\v";
  str.erase(str.find_last_not_of(whitespace_definition) + 1);
  str.erase(0,str.find_first_not_of(whitespace_definition));
  return str;
}

////////////////////////////////////////////////////////////////////////////////
/// \brief A stream-like parser for '.dic' and '.aff' files.
////////////////////////////////////////////////////////////////////////////////
class dict {
private:
  class aff_rule {
  public:
    enum t { PREFIX, SUFFIX };

  public:
    t ty;

    std::string del;
    std::string add;

    std::regex guard;

  public:
    aff_rule(t type, std::string deletion, std::string addition, std::string guard_regex)
      : ty(type), del(deletion), add(addition), guard(".*"+guard_regex)
    { }
  };

private:
  const std::string& m_dic_file_path;
  const std::string& m_aff_file_path;

  size_t m_dict_line_number = 0;
  std::fstream m_dict_stream;

  std::unordered_map<char, std::vector<aff_rule>> m_rules;

  std::unordered_set<std::string> m_out_strings;
  std::unordered_set<std::string>::iterator m_out_curr;
  std::unordered_set<std::string>::iterator m_out_end;

private:
  char parse_identifier(const std::string& s)
  {
    // TODO: is called with an empty string
    return (regex_match(s, std::regex("[A-Za-z]")))
      ? s.at(0)
      : std::stoi(s);
  }

  std::vector<std::string> parse_rules(const std::string &s)
  {
    return s.size() == 0
      ? std::vector<std::string>()
      : split(split(s, ' ')[0], ',');
  }

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Populates m_out_strings with new words to pull and returns `true` if
  /// succesful. Keep running, until `can_pull` is empty or it returns `true`.
  //////////////////////////////////////////////////////////////////////////////
  bool parse_dic_line()
  {
    m_dict_line_number += 1;
    std::string raw_line;
    if (!std::getline(m_dict_stream, raw_line)) { return false; };
    if (raw_line.size() == 0) { return false; }    // <-- skip empty lines
    if (raw_line.find("#") == 0) { return false; } // <-- skip comment lines
    if (raw_line.find(" ") == 0) {
      std::cerr << m_dict_line_number << ": Skipped weird line, starting with whitespace" << std::endl;
      return false;
    }

    std::vector<std::string> next_with_rules = split(raw_line, '/');
    if (next_with_rules.size() > 2) {
      std::cerr << m_dict_line_number << ": Skipped weird line, that includes two '/'" << std::endl;
      return false;
    }

    std::string next_word = next_with_rules[0];

    m_out_strings.clear();

    // Depth-first exploration of all words reachable.
    std::vector<std::pair<std::string, std::string>> dfs_stack;
    dfs_stack.push_back(std::make_pair(next_word,
                                       next_with_rules.size() > 1 ? next_with_rules[1] : ""));

    while (!dfs_stack.empty()) {
      next_word = dfs_stack.back().first;
      m_out_strings.insert(next_word);

      std::vector<std::string> next_rules = parse_rules(dfs_stack.back().second);
      dfs_stack.pop_back();

      // Loop through all rules to be applied to this word
      for (const std::string &rule_str : next_rules) {
        const char rule_id = parse_identifier(rule_str);

        auto aff_search = m_rules.find(rule_id);
        if (aff_search == m_rules.end()) {
          // 'rule_id' is not a key in 'm_rules'. Abort this search-path.
          continue;
        }

        // Loop through each specific case for this rule
        for (const aff_rule &ar : (*aff_search).second) {
          if (!regex_match(next_word, ar.guard)) continue;

          const size_t start_idx = ar.ty == aff_rule::PREFIX ? ar.del.size() : 0u;
          const size_t sub_len = next_word.size() - ar.del.size();

          std::stringstream _ss;
          _ss << (ar.ty == aff_rule::PREFIX ? ar.add : "")
             << next_word.substr(start_idx, sub_len)
             << (ar.ty == aff_rule::SUFFIX ? ar.add : "");

          const std::vector<std::string> rec_with_rules = split(_ss.str(), '/');
          assert(rec_with_rules.size() > 0);
          const std::string rec_word = rec_with_rules[0];

          if (m_out_strings.find(rec_word) == m_out_strings.end()) { // TODO: account for different rules?
            dfs_stack.push_back(std::make_pair(rec_word,
                                               rec_with_rules.size() > 1 ? rec_with_rules[1] : ""));
          }
        }
      }
    }

    m_out_curr = m_out_strings.begin();
    return m_out_strings.size() > 0;
  }

private:
  void parse_aff()
  {
    std::stringstream buffer;

    // Read in rules from '.aff' file.
    std::fstream aff_stream(m_aff_file_path);
    assert(aff_stream.is_open());

    size_t line_number = 0;
    std::string aff_line;
    while(std::getline(aff_stream, aff_line)) {
      line_number += 1;

      if (aff_line.find("SFX") == -1 && aff_line.find("PFX") == -1) continue;

      std::vector<aff_rule> rule_set;

      const std::vector<std::string> line_args = split(aff_line, ' ');
      const aff_rule::t type = line_args[0] == "SFX" ? aff_rule::SUFFIX : aff_rule::PREFIX;
      const char identifier = parse_identifier(line_args[1]);
      /*const char unknown_value = line_args[2][0];*/
      const size_t number_of_rules = std::stoul(line_args[3]);

      for (size_t i = 0; i < number_of_rules; ++i) {
        line_number += 1;

        if (!std::getline(aff_stream, aff_line)) {
          std::cerr << line_number
                    << ": could not read as many .aff rules, as expected for '" << identifier << "'"
                    << std::endl;
          exit(-1);
        }

        const std::vector<std::string> line_args = split(aff_line, ' ');

        const std::string deletion = line_args[2] == "0" ? "" : line_args[2];
        const std::string addition = line_args[3];
        const std::string guard_regex = split(line_args[4], '\t')[0];

        rule_set.push_back(aff_rule(type, deletion, addition, guard_regex));
      }

      if (rule_set.size() > 0)
        m_rules[identifier] = rule_set;
    }
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Constructor in which the dictionary parser is set up to generate
  /// words based on the two '.dic' and '.aff' files.
  ///
  /// \param dic_file_path Path to the '.dic' file.
  /// \param aff_file_path Path to the '.aff' file.
  //////////////////////////////////////////////////////////////////////////////
  dict(const std::string& dic_file_path, const std::string& aff_file_path)
    : m_dic_file_path(dic_file_path), m_aff_file_path(aff_file_path),
      m_dict_stream(dic_file_path)
  {
    // Parse the entire .aff file
    parse_aff();

    // Begin parsing the .dic file until the first set of the output has been
    // generated in 'm_out_strings'.
    while(m_dict_stream.peek() != EOF) {
      const bool successfully_obtained_words = parse_dic_line();
      if (successfully_obtained_words) break;
    }
  }

  // TODO: constructor with a single file, guessing the path of the '.aff' file.

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Whether more words exist in the library.
  //////////////////////////////////////////////////////////////////////////////
  bool can_pull()
  {
    return m_out_curr != m_out_end;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Obtain the next word without moving the read-head.
  //////////////////////////////////////////////////////////////////////////////
  std::string peek()
  {
    assert(can_pull());
    return *m_out_curr;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Obtain the next word and move the read-head to the next.
  //////////////////////////////////////////////////////////////////////////////
  std::string pull()
  {
    assert(can_pull());

    // Store next word to be returned later.
    std::string ret = *(m_out_curr++);

    // Repopulate 'm_out_strings' with the next set of words, if all words from
    // it has been exhausted..
    if (m_out_curr == m_out_end) {
      while(m_dict_stream.peek() != EOF) {
        const bool successfully_obtained_words = parse_dic_line();
        if (successfully_obtained_words) break;
      }
    }

    return ret;
  }
};

#endif // DICT_H
