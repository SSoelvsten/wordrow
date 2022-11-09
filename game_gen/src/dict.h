#ifndef DICT_H
#define DICT_H

#include <fstream>
#include <regex>
#include <unordered_map>
#include <vector>

//https://stackoverflow.com/a/236803/13300643
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

  std::fstream m_dict_stream;

  std::unordered_map<char, std::vector<aff_rule>> m_rules;

  std::unordered_set<std::string> m_out_stringss;
  std::unordered_set<std::string>::iterator m_out_curr;
  std::unordered_set<std::string>::iterator m_out_end;

  const std::regex m_is_lower_char;

private:
  char parse_identifier(const std::string& s)
  {
    // TODO: crash on empty string
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
  /// \brief Populates m_out_stringss with new words to pull and returns `true` if
  /// succesful. Keep running, until `can_pull` is empty or it returns `true`.
  //////////////////////////////////////////////////////////////////////////////
  bool generate_composite_words()
  {
    std::string raw_line;
    if (!std::getline(m_dict_stream, raw_line)) { return false; };
    if (raw_line.size() == 0) { return false; }    // <-- skip empty lines
    if (raw_line.find("#") == 0) { return false; } // <-- skip comment lines
    if (raw_line.find(" ") == 0) { return false; } // <-- skip weird lines due to unintended line breaks

    std::vector<std::string> next_with_rules = split(raw_line, '/');
    if (next_with_rules.size() > 2) { return false; }

    std::string next_word = next_with_rules[0];
    if (!regex_match(next_word, m_is_lower_char)) { return false; }

    m_out_stringss.clear();

    // Depth-first exploration of all words reachable.
    std::vector<std::pair<std::string, std::string>> dfs_stack;
    dfs_stack.push_back(std::make_pair(next_word,
                                       next_with_rules.size() > 1 ? next_with_rules[1] : ""));

    while (!dfs_stack.empty()) {
      next_word = dfs_stack.back().first;
      m_out_stringss.insert(next_word);

      std::vector<std::string> _next_rules = parse_rules(dfs_stack.back().second);
      dfs_stack.pop_back();

      for (const std::string &i : _next_rules) {
        const char identifier = parse_identifier(i);

        auto aff_search = m_rules.find(identifier);
        if (aff_search == m_rules.end()) {
          continue;
        }

        for (const aff_rule &ar : (*aff_search).second) {
          if (!regex_match(next_word, ar.guard)) {
            continue;
          }
          const size_t start_idx = ar.ty == aff_rule::PREFIX ? ar.del.size() : 0u;
          const size_t sub_len = next_word.size() - ar.del.size();

          std::stringstream _ss;
          _ss << (ar.ty == aff_rule::PREFIX ? ar.add : "")
             << next_word.substr(start_idx, sub_len)
             << (ar.ty == aff_rule::SUFFIX ? ar.add : "");

          const std::vector<std::string> rec_with_rules = split(_ss.str(), '/');
          assert(rec_with_rules.size() > 0);
          const std::string rec_word = rec_with_rules[0];

          if (m_out_stringss.find(rec_word) == m_out_stringss.end()) { // TODO: account for different rules?
            dfs_stack.push_back(std::make_pair(rec_word,
                                               rec_with_rules.size() > 1 ? rec_with_rules[1] : ""));
          }
        }
      }
    }

    m_out_curr = m_out_stringss.begin();
    return m_out_stringss.size() > 0;
  }

public:
  dict(const std::string& dic_file_path, const std::string& aff_file_path)
    : m_dic_file_path(dic_file_path), m_aff_file_path(aff_file_path),
      m_dict_stream(dic_file_path),
      m_is_lower_char("[a-zæøå]*")
  {
    std::stringstream buffer;

    // Read in rules from '.aff' file.
    std::fstream _aff_stream(aff_file_path);
    assert(_aff_stream.is_open());

    std::string aff_line;
    while(std::getline(_aff_stream, aff_line)) {
      if (aff_line.find("SFX") == -1 && aff_line.find("PFX") == -1) continue;

      std::vector<aff_rule> rule_set;

      const std::vector<std::string> line_args = split(aff_line, ' ');
      const aff_rule::t type = line_args[0] == "SFX" ? aff_rule::SUFFIX : aff_rule::PREFIX;
      const char identifier = parse_identifier(line_args[1]);
      const char something_weird = line_args[2][0];

      for (size_t i = 0; i < std::stoul(line_args[3]); ++i) {
        if (!std::getline(_aff_stream, aff_line)) { exit(-1); }
        const std::vector<std::string> line_args = split(aff_line, ' ');

        const std::string deletion = line_args[2] == "0" ? "" : line_args[2];
        const std::string addition = line_args[3];
        const std::string guard_regex = split(line_args[4], '\t')[0];

        if (!regex_match(split(addition, '/')[0], m_is_lower_char)) {
          //std::cerr << "skipping rule that adds: " << addition << "  (" << split(addition, '/')[0] << ")" << std::endl;
          continue;
        }

        rule_set.push_back(aff_rule(type, deletion, addition, guard_regex));
      }

      if (rule_set.size() > 0)
        m_rules[identifier] = rule_set;
    }

    while (can_pull() && !generate_composite_words()) { }
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  bool can_pull()
  {
    return m_out_curr != m_out_end || m_dict_stream.peek() != EOF;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string peek()
  {
    assert(can_pull());
    return *m_out_curr;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string pull()
  {
    assert(can_pull());

    std::string ret = *(m_out_curr++);

    if (m_out_curr == m_out_end)
      while(can_pull() && !generate_composite_words()) { }

    return ret;
  }
};

#endif // DICT_H
