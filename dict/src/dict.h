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

  std::vector<std::string> _out_strings;
  size_t _out_idx = (size_t) -1;

  const std::regex _is_lower_char;

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Populates _out_strings with new words to pull and returns `true` if
  /// succesful. Keep running, until `can_pull` is empty or it returns `true`.
  //////////////////////////////////////////////////////////////////////////////
  bool generate_composite_words()
  {
    std::string _raw_line;
    if (!std::getline(_dict_stream, _raw_line)) { exit(-1); };

    std::vector<std::string> _dict_line = split(_raw_line, '/');
    assert(_dict_line.size() <= 2);

    std::string _base_word = _dict_line[0];
    if (!regex_match(_base_word, _is_lower_char)) return false;

    _out_strings.clear();
    _out_strings = { _base_word };

    if (_dict_line.size() == 2) {
      //std::cout << "_dict_line: " << _dict_line[1] << std::endl;
      for (const char i : _dict_line[1]) {
        for (const aff_rule ar : _rules[i]) {
          if (!regex_match(_base_word, ar.guard)) { continue; }
          size_t start_idx = ar.ty == aff_rule::PREFIX ? ar.del.size() : 0u;
          size_t sub_len = _base_word.size() - ar.del.size();

          std::stringstream ss;
          ss << (ar.ty == aff_rule::PREFIX ? ar.add : "")
             << _base_word.substr(start_idx, sub_len)
             << (ar.ty == aff_rule::SUFFIX ? ar.add : "");

          //std::cout << "ar.add: " << ar.add << std::endl;

          _out_strings.push_back(ss.str());
          break;
        }
      }
    } else {
      _out_strings = { _base_word };
    }
    _out_idx = (size_t) 0;
    return true;
  }

public:
  dict(const std::string& dic_file_path, const std::string& aff_file_path)
    : _dic_file_path(dic_file_path), _aff_file_path(aff_file_path),
      _dict_stream(dic_file_path),
      _is_lower_char("[a-z]*")
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
      const char identifier = _line_args[1][0];
      const char something_weird = _line_args[2][0];

      for (size_t i = 0; i < std::stoul(_line_args[3]); ++i) {
        if (!std::getline(_aff_stream, _aff_line)) { exit(-1); }
        const std::vector<std::string> _line_args = split(_aff_line, ' ');

        const std::string deletion = _line_args[2] == "0" ? "" : _line_args[2];
        const std::string addition = _line_args[3];
        const std::string guard_regex = _line_args[4];

        if (!regex_match(addition, _is_lower_char)) continue;

        _rule_set.push_back(aff_rule(type, deletion, addition, guard_regex));
      }

      // if (_rule_set.size() > 0)
      _rules[identifier] = _rule_set;
    }

    do { } while (can_pull() && !generate_composite_words());
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  bool can_pull()
  {
    return _out_idx < _out_strings.size() || _dict_stream.peek() != EOF;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string peek()
  {
    assert(can_pull());

    if (_out_idx < _out_strings.size()) {
      return _out_strings[_out_idx];
    }
    return _out_strings[_out_idx];
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string pull()
  {
    assert(can_pull());

    if (_out_idx < _out_strings.size()) {
      return _out_strings[_out_idx++];
    }

    if (_out_strings.size() <= _out_idx)
      while(can_pull() && !generate_composite_words()) { }

    std::string ret = _out_strings[_out_idx++];

    if (_out_strings.size() <= _out_idx)
      while(can_pull() && !generate_composite_words()) { }

    return ret;
  }
};

#endif // DICT_H
