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

bool is_clean(const std::string &s)
{
  for (const char c : s) {
    if (c < 'a' || 'z' < c) return false; // <-- TODO: Dansk
  }
  return true;
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

  size_t _out_idx = (size_t) -1;
  std::vector<std::string> _out_strings;

  std::unordered_map<char, std::vector<aff_rule>> _rules;

public:
  dict(const std::string& dic_file_path, const std::string& aff_file_path)
    : _dic_file_path(dic_file_path), _aff_file_path(aff_file_path), _dict_stream(dic_file_path)
  {
    // Read in rules from '.aff' file.
    std::fstream _aff_stream(aff_file_path);
    assert(_aff_stream.is_open());

    while(_aff_stream.peek() != EOF) {
      std::string _aff_line; = aff_stream.getline();
      if (_aff_line.find("SFX") == -1 && _aff_line.find("PFX") == -1) continue;

      std::vector<aff_rule> _rule_set;

      const std::vector<std::string> _line_args = split(_aff_line, ' ');
      const aff_rule::t type = _line_args[0] == "SFX" ? aff_rule::SUFFIX : aff_rule::PREFIX;
      const char identifier = _line_args[1][0];
      const char something_weird = _line_args[2][0];

      for (size_t i = 0; i < std::stoul(_line_args[3]); ++i) {
        _aff_line = aff_stream.getline();
        const std::vector<std::string> _line_args = split(_aff_line, ' ');

        const std::string deletion = _line_args[2] == "0" ? "" : _line_args[2];
        const std::string addition = _line_args[3];
        const std::string guard_regex = _line_args[4];

        if (!is_clean(addition)) continue;

        _rule_set.push_back(aff_rule(type, deletion, addition, guard_regex));
      }

      //if (!_rule_set.empty())
      _rules[identifier] = _rule_set;
    }
  }

private:
  void generate_composite_words() 
  {
    std::vector<std::string> _dict_line = split(_dict_stream.getline(), '/');
    assert(_dict_line.size() <= 2);

    std::string _base_word = _dict_line[0];

    _out_strings.erase();
    if (_dict_line.size() == 2) {
      for (const char i : _dict_line[1]) {
        for (const aff_rule ar : _rules[i]) {
          if (!regex_match(_base_word, ar.guard)) continue;
            int start_idx = ar.ty == aff_rule::PREFIX ? ar.del.size() : 0;
            int sub_len = _base_word.size() - ar.del.size();

            _out_strings.push_back((ar.ty == aff_rule::SUFFIX ? "" : ar.add) +
                                    _base_word.substr(start_idx, sub_len) +
                                    (ar.ty == aff_rule::SUFFIX ? "" : ar.add));
        }
      }
    } else {
      _out_strings = { _base_word };
    }
    _out_idx = (size_t) 0;
  }

  bool can_pull()
  {
    return out_idx < out_strings.size() || _dict_stream.peek() != EOF;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string peek()
  {
    assert(can_pull());

    if (_out_idx < _out_strings.size()) {
      return _out_strings[_out_idx];
    }

    generate_composite_words();

    return _out_strings(_out_idx);
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief ...
  //////////////////////////////////////////////////////////////////////////////
  std::string pull()
  {
    assert(can_pull());

    if (_out_idx < _out_strings.size()) {
      return _out_strings[_out_idx++];
    }

    generate_composite_words();

    return _out_strings(_out_idx++);
  }
};

#endif // DICT_H
