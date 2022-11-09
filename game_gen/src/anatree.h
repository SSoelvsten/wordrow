#ifndef ANATREE_H
#define ANATREE_H

#include<algorithm>
#include<assert.h>
#include<memory>
#include<sstream>
#include<string>
#include<unordered_set>

////////////////////////////////////////////////////////////////////////////////
/// \brief A data structure capable of storing a set of 'std::string' (or
/// similar) data structures, enabling quick access to all 'anagrams' of each
/// word (within or not).
////////////////////////////////////////////////////////////////////////////////
template<typename word_t = std::string, typename char_t = std::string::value_type>
class anatree {
private:
  class node {
  public:
    typedef std::shared_ptr<node> ptr; // <-- TODO: 'std::unique_ptr'

    static constexpr char_t NIL = 0;

  public:
    ////////////////////////////////////////////////////////////////////////////
    /// \brief Character in this node
    ////////////////////////////////////////////////////////////////////////////
    char_t m_char = NIL;

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Binary choice on children.
    ///
    /// Follow the 'false' pointer, if 'm_char' does not occur in the word.
    /// Otherwise follow the 'true' pointer, if it does.
    ////////////////////////////////////////////////////////////////////////////
    ptr m_children[2] = { nullptr, nullptr }; // <-- TODO: variable out-degree

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Set of words that are anagrams of the path up to this node.
    ////////////////////////////////////////////////////////////////////////////
    std::unordered_set<word_t> m_words;

  public:
    ////////////////////////////////////////////////////////////////////////////
    /// \brief Initialize a NIL node
    ////////////////////////////////////////////////////////////////////////////
    void init(char_t c, ptr f_ptr = nullptr, ptr t_ptr = nullptr)
    {
      assert(m_char == NIL && c != NIL);
      m_char = c;
      m_children[false] = f_ptr ? f_ptr : std::make_shared<node>();
      m_children[true]  = t_ptr ? t_ptr : std::make_shared<node>();
    }

  public:
    ////////////////////////////////////////////////////////////////////////////
    /// \brief Empty (NIL) constructor
    ////////////////////////////////////////////////////////////////////////////
    node() = default;

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Empty (NIL) ptr constructor
    ////////////////////////////////////////////////////////////////////////////
    static ptr make_node()
    { return std::make_shared<node>(); }

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Copy constructor
    ////////////////////////////////////////////////////////////////////////////
    node(const node&) = default;

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Non-nil ptr constructor
    ////////////////////////////////////////////////////////////////////////////
    node(const char_t c, ptr f_ptr = make_node(), ptr t_ptr = make_node())
    { init(c, f_ptr, t_ptr); };

    ////////////////////////////////////////////////////////////////////////////
    /// \brief Non-nil constructor
    ////////////////////////////////////////////////////////////////////////////
    static ptr make_node(char_t c, ptr f_ptr = make_node(), ptr t_ptr = make_node())
    { return std::make_shared<node>(c, f_ptr, t_ptr); }

  public:
    std::string to_string()
    {
      std::stringstream ss;
      ss << "{ char: " << m_char
         << ", children: { " << m_children[false] << ", " << m_children[true]
         << " }, words [ ";
      for (const word_t &w : m_words) {
        ss << w << " ";
      }
      ss << "] }";
      return ss.str();
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively inserts a word into the anatree.
  //////////////////////////////////////////////////////////////////////////////
  typename node::ptr
  insert_word(const typename node::ptr& p,
              const word_t& w,
              typename word_t::iterator curr,
              const typename word_t::iterator end)
  {
    assert(p != nullptr);

    // Case: Iterator done
    // -> Insert word
    if (curr == end) {
      p->m_words.insert(w);
      return p;
    }

    // Case: NIL
    // -> Turn into non-NIL node
    if (p->m_char == node::NIL) {
      assert(p->m_children[false] == nullptr && p->m_children[true] == nullptr);
      p->init(*curr);
      m_size += 2;
      p->m_children[true] = insert_word(p->m_children[true], w, ++curr, end);
      return p;
    }

    // Case: Iterator behind
    // -> Insert new node in-between
    if (*curr < p->m_char) {
      const typename node::ptr np = node::make_node(*curr, p, node::make_node());
      np->m_words = p->m_words;
      p->m_words = std::unordered_set<word_t>();
      m_size += 1;
      np->m_children[true]  = insert_word(np->m_children[true], w, ++curr, end);
      return np;
    }

    // Case: Iterator ahead
    // -> Follow 'false' child
    if (p->m_char < *curr) {
      p->m_children[false] = insert_word(p->m_children[false], w, curr, end);
      return p;
    }

    // Case: Iterator and node matches
    // -> Follow 'true' child
    p->m_children[true] = insert_word(p->m_children[true], w, ++curr, end);
    return p;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively gets all word on the path that matches the iterator.
  //////////////////////////////////////////////////////////////////////////////
  typename std::unordered_set<word_t>
  get_words(const typename node::ptr p,
            typename word_t::iterator curr,
            const typename word_t::iterator end) const
  {
    // Case: Iterator or Anatree is done
    if (curr == end || p->m_char == node::NIL) {
      return p->m_words;
    }

    // Case: Iterator behind
    // -> Insert new node in-between
    if (*curr < p->m_char) {
      // Skip missing characters.
      while (*curr < p->m_char && curr != end) { ++curr; }
      return get_words(p, curr, end);
    }

    // Case: Iterator ahead
    // -> Follow 'false' child
    if (p->m_char < *curr) {
      std::unordered_set<word_t> ret(p->m_words);
      std::unordered_set<word_t> rec = get_words(p->m_children[false], curr, end);
      ret.insert(rec.begin(), rec.end());
      return ret;
    }

    // Case: Iterator and node matches
    // -> Follow both children, merge results and add words on current node
    ++curr;

    std::unordered_set<word_t> ret(p->m_words);
    std::unordered_set<word_t> rec_false = get_words(p->m_children[false], curr, end);
    std::unordered_set<word_t> rec_true = get_words(p->m_children[true], curr, end);
    ret.insert(rec_false.begin(), rec_false.end());
    ret.insert(rec_true.begin(), rec_true.end());
    return ret;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Recursively obtain all words at the leaves.
  //////////////////////////////////////////////////////////////////////////////
  typename std::unordered_set<word_t>
  get_leaves(const typename node::ptr p) const
  {
    std::unordered_set<word_t> ret;
    if (p->m_char == node::NIL) {
      if (p->m_words.size() > 0) {
        ret.insert(*p->m_words.begin());
      }
      return ret;
    }

    std::unordered_set<word_t> rec_false = get_leaves(p->m_children[false]);
    std::unordered_set<word_t> rec_true = get_leaves(p->m_children[true]);
    ret.insert(rec_false.begin(), rec_false.end());
    ret.insert(rec_true.begin(), rec_true.end());
    return ret;
  }

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Root of the anatree (initially a NIL pointer).
  //////////////////////////////////////////////////////////////////////////////
  typename node::ptr m_root = node::make_node();
  size_t m_size = 1u;

public:
  anatree() = default;
  anatree(const anatree&) = default;

private:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief
  //////////////////////////////////////////////////////////////////////////////
  word_t sorted_word(const word_t& w) const
  {
    word_t ret(w);
    std::sort(ret.begin(), ret.end()); // <-- TODO: frequency-based ordering?
    return ret;
  }

public:
  //////////////////////////////////////////////////////////////////////////////
  /// \brief Adds the word 'w' to the anatree.
  //////////////////////////////////////////////////////////////////////////////
  void
  insert(const word_t& w)
  {
    word_t key = sorted_word(w);
    m_root = insert_word(m_root, w, key.begin(), key.end());
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Obtain all words that are anagrams of 'w'.
  //////////////////////////////////////////////////////////////////////////////
  typename std::unordered_set<word_t>
  keys() const
  {
    return get_leaves(m_root);
  }


  //////////////////////////////////////////////////////////////////////////////
  /// \brief Obtain all words that are anagrams of 'w'.
  //////////////////////////////////////////////////////////////////////////////
  typename std::unordered_set<word_t>
  anagrams_of(const word_t& w) const
  {
    word_t key = sorted_word(w);
    return get_words(m_root, key.begin(), key.end());
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Remove all nodes/anagrams.
  //////////////////////////////////////////////////////////////////////////////
  void
  erase()
  {
    m_root = node::make_node();
    m_size = 1u;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// \brief Number of nodes.
  //////////////////////////////////////////////////////////////////////////////
  size_t
  size()
  {
    return m_size;
  }
};

#endif // ANATREE_H
