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
  const std::string& _dic_file_path;
  const std::string& _aff_file_path;

  std::fstream _dict_stream;

  std::unordered_map<char, std::vector<aff_rule>> _rules;

  std::unordered_set<std::string> _out_strings;
  std::unordered_set<std::string>::iterator _out_curr;
  std::unordered_set<std::string>::iterator _out_end;

  const std::regex _is_lower_char;

private:
  char parse_identifier(const std::string& s)
  {
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
  /// \brief Populates _out_strings with new words to pull and returns `true` if
  /// succesful. Keep running, until `can_pull` is empty or it returns `true`.
  //////////////////////////////////////////////////////////////////////////////
  bool generate_composite_words()
  {
    std::string _raw_line;
    if (!std::getline(_dict_stream, _raw_line)) { return false; };
    if (_raw_line.size() == 0) { return false; }    // <-- skip empty lines
    if (_raw_line.find(" ") == 0) { return false; } // <-- skip weird lines due to unintended line breaks

    std::vector<std::string> _next_with_rules = split(_raw_line, '/');
    if (_next_with_rules.size() > 2) { return false; }

    std::string _next_word = _next_with_rules[0];
    if (!regex_match(_next_word, _is_lower_char)) { return false; }

    _out_strings.clear();

    // Depth-first exploration of all words reachable.
    std::vector<std::pair<std::string, std::string>> dfs_stack;
    dfs_stack.push_back(std::make_pair(_next_word,
                                       _next_with_rules.size() > 1 ? _next_with_rules[1] : ""));

    while (!dfs_stack.empty()) {
      _next_word = dfs_stack.back().first;
      _out_strings.insert(_next_word);

      std::vector<std::string> _next_rules = parse_rules(dfs_stack.back().second);
      dfs_stack.pop_back();

      for (const std::string &i : _next_rules) {
        const char identifier = parse_identifier(i);

        auto aff_search = _rules.find(identifier);
        if (aff_search == _rules.end()) {
          continue;
        }

        for (const aff_rule &ar : (*aff_search).second) {
          if (!regex_match(_next_word, ar.guard)) {
            continue;
          }
          const size_t start_idx = ar.ty == aff_rule::PREFIX ? ar.del.size() : 0u;
          const size_t sub_len = _next_word.size() - ar.del.size();

          std::stringstream _ss;
          _ss << (ar.ty == aff_rule::PREFIX ? ar.add : "")
             << _next_word.substr(start_idx, sub_len)
             << (ar.ty == aff_rule::SUFFIX ? ar.add : "");

          const std::vector<std::string> _rec_with_rules = split(_ss.str(), '/');
          assert(_rec_with_rules.size() > 0);
          const std::string _rec_word = _rec_with_rules[0];

          if (_out_strings.find(_rec_word) == _out_strings.end()) { // TODO: account for different rules?
            dfs_stack.push_back(std::make_pair(_rec_word,
                                               _rec_with_rules.size() > 1 ? _rec_with_rules[1] : ""));
          }
        }
      }
    }

    _out_curr = _out_strings.begin();
    return _out_strings.size() > 0;
  }

public:
  dict(const std::string& dic_file_path, const std::string& aff_file_path)
    : _dic_file_path(dic_file_path), _aff_file_path(aff_file_path),
      _dict_stream(dic_file_path),
      _is_lower_char("[a-zæøå]*")
  {
    std::stringstream buffer;

    // Read in rules from '.aff' file.
    std::fstream _aff_stream(aff_file_path);
    assert(_aff_stream.is_open());

    std::string _aff_line;
    while(std::getline(_aff_stream, _aff_line)) {
      if (_aff_line.find("SFX") == -1 && _aff_line.find("PFX") == -1) continue;

      std::vector<aff_rule> _rule_set;

      const std::vector<std::string> _line_args = split(_aff_line, ' ');
      const aff_rule::t type = _line_args[0] == "SFX" ? aff_rule::SUFFIX : aff_rule::PREFIX;
      const char identifier = parse_identifier(_line_args[1]);
      const char something_weird = _line_args[2][0];

      for (size_t i = 0; i < std::stoul(_line_args[3]); ++i) {
        if (!std::getline(_aff_stream, _aff_line)) { exit(-1); }
        const std::vector<std::string> _line_args = split(_aff_line, ' ');

        const std::string deletion = _line_args[2] == "0" ? "" : _line_args[2];
        const std::string addition = _line_args[3];
        const std::string guard_regex = split(_line_args[4], '\t')[0];

        if (!regex_match(split(addition, '/')[0], _is_lower_char)) {
          //std::cerr << "skipping rule that adds: " << addition << "  (" << split(addition, '/')[0] << ")" << std::endl;
          continue;
        }

        _rule_set.push_back(aff_rule(type, deletion, addition, guard_regex));
      }

      if (_rule_set.size() > 0)
        _rules[identifier] = _rule_set;
    }

    while (can_pull() && !generate_composite_words()) { }
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  bool can_pull()
  {
    return _out_curr != _out_end || _dict_stream.peek() != EOF;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string peek()
  {
    assert(can_pull());
    return *_out_curr;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string pull()
  {
    assert(can_pull());

    std::string ret = *(_out_curr++);

    if (_out_curr == _out_end)
      while(can_pull() && !generate_composite_words()) { }

    return ret;
  }
};

#endif // DICT_H
