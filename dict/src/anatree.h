#ifndef ANATREE_H
#define ANATREE_H

#include<algorithm>
#include<assert.h>
#include<memory>
#include<sstream>
#include<string>
#include<unordered_set>

class anatree {
public:
  typedef std::string string;

private:
  class node {
  public:
    typedef std::shared_ptr<node> ptr; // <-- TODO: 'std::unique_ptr'

    static constexpr char NIL = '~';

  public:
    ////////////////////////////////////////////////////////////////////////////
    /// \brief Character in this node
    ////////////////////////////////////////////////////////////////////////////
    char _char = '~';

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Binary choice on children.
    ///
    /// Follow the 'false' pointer, if '_char' does not occur in the word.
    /// Otherwise follow the 'true' pointer, if it does.
    ////////////////////////////////////////////////////////////////////////////
    ptr _children[2] = { nullptr, nullptr }; // <-- TODO: variable out-degree

    ////////////////////////////////////////////////////////////////////////////
    /// \brief
    ////////////////////////////////////////////////////////////////////////////
    std::unordered_set<string> _words;

  public:
    ////////////////////////////////////////////////////////////////////////////
    /// \brief Empty (NIL) node constructor
    ////////////////////////////////////////////////////////////////////////////
    node() = default;

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Copy constructor
    ////////////////////////////////////////////////////////////////////////////
    node(const node&) = default;

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Non-nil constructor
    ////////////////////////////////////////////////////////////////////////////
    node(const char c); // TODO

  public:
    static ptr make_node()
    {
      return std::make_shared<node>();
    }

    static ptr make_node(char c);
    // TODO ?

  public:
    string to_string()
    {
      std::stringstream ss;
      ss << "{ char: " << _char << ", children: { " << _children[false] << ", " << _children[true] << " }, words [ ";
      for (const string &w : _words) {
        ss << w << " ";
      }
      ss << "] }";
      return ss.str();
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively inserts a word into the anatree.
  //////////////////////////////////////////////////////////////////////////////
  node::ptr insert_word(const node::ptr& p,
                        const string& w,
                        string::iterator curr_char,
                        const string::iterator end)
  {
    assert(p != nullptr);
    std::cout << p->to_string() << std::endl;

    // Case: Iterator done
    // -> Insert word
    if (curr_char == end) {
      std::cout << "  case: end" << std::endl;
      p->_words.insert(w);
      return p;
    }

    // Case: NIL
    // -> Turn into non-NIL node
    if (p->_char == node::NIL) {
      std::cout << "  case: NIL" << std::endl;
      assert(p->_children[false] == nullptr && p->_children[true] == nullptr);
      p->_char = *curr_char;
      p->_children[false] = node::make_node();
      p->_children[true]  = node::make_node();
      p->_children[true]  = insert_word(p->_children[true], w, ++curr_char, end);
      return p;
    }

    // Case: Iterator behind
    // -> Insert new node in-between
    if (*curr_char < p->_char) {
      std::cout << "  case: behind" << std::endl;
      const node::ptr np = node::make_node();
      np->_char = *curr_char;
      np->_children[false] = p;
      np->_children[true]  = node::make_node();
      np->_children[true]  = insert_word(np->_children[true], w, ++curr_char, end);
      return np;
    }

    // Case: Iterator ahead
    // -> Follow 'false' child
    if (p->_char < *curr_char) {
       std::cout << "  case: ahead" << std::endl;
      p->_children[false] = insert_word(p->_children[false], w, curr_char, end);
      return p;
    }

    // Case: Iterator and node matches
    // -> Follow 'true' child
    std::cout << "  case: match" << std::endl;
    p->_children[true] = insert_word(p->_children[true], w, ++curr_char, end);
    return p;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively gets all word on the path that matches the iterator.
  //////////////////////////////////////////////////////////////////////////////
  std::unordered_set<string> get_words(const node::ptr p, string::iterator curr, const string::iterator end) const
  {
    std::cout << p->to_string() << std::endl;

    // Case: Iterator or Anatree is done
    if (curr == end || p->_char == node::NIL) {
      return p->_words;
    }

    // Case: Iterator behind
    // -> Insert new node in-between
    if (*curr < p->_char) {
      // Skip missing characters.
      while (*curr < p->_char && curr != end) { ++curr; }
      return get_words(p, curr, end);
    }

    // Case: Iterator ahead
    // -> Follow 'false' child
    if (p->_char < *curr) {
      std::unordered_set<string> ret(p->_words);
      std::unordered_set<string> rec = get_words(p->_children[false], curr, end);
      ret.insert(rec.begin(), rec.end());
      return ret;
    }

    // Case: Iterator and node matches
    // -> Follow both children, merge results and add words on current node
    ++curr;

    std::unordered_set<string> ret(p->_words);
    std::unordered_set<string> rec_false = get_words(p->_children[false], curr, end);
    std::unordered_set<string> rec_true = get_words(p->_children[true], curr, end);
    ret.insert(rec_false.begin(), rec_false.end());
    ret.insert(rec_true.begin(), rec_true.end());
    return ret;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively obtain all words at the leaves.
  //////////////////////////////////////////////////////////////////////////////
  std::unordered_set<string> get_leaves(string::iterator curr, const string::iterator end) const;

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Root of the anatree (initially a NIL pointer).
  //////////////////////////////////////////////////////////////////////////////
  node::ptr _root = node::make_node();

public:
  anatree() = default;
  anatree(const anatree&) = default;

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief
  //////////////////////////////////////////////////////////////////////////////
  string sorted_string(const string& w) const
  {
    string ret(w);
    std::sort(ret.begin(), ret.end()); // <-- TODO: frequency-based ordering?
    return ret;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Adds the word 'w' to the anatree.
  //////////////////////////////////////////////////////////////////////////////
  void insert(const string& w)
  {
    string key = sorted_string(w);
    _root = insert_word(_root, w, key.begin(), key.end());
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Obtain all words that are anagrams of 'w'.
  //////////////////////////////////////////////////////////////////////////////
  std::unordered_set<string> anagrams_of(const string& w) const
  {
    string key = sorted_string(w);
    return get_words(_root, key.begin(), key.end());
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Remove all nodes/anagrams.
  //////////////////////////////////////////////////////////////////////////////
  void erase()
  {
    _root = node::make_node();
  }
};

#endif // ANATREE_H
