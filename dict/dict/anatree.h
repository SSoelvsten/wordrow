#pragma once
#include <string>
#include <memory>
#include <vector>
//#include <unordered_map>

class Node;

using NodePtr = std::unique_ptr<Node>;

class Anatree {
public:
	Anatree() = default;
	Anatree(std::string filePath);

private:
	std::string anatree{};

	NodePtr root;

};

class Node {
	
public:
	Node();
	//Node(const Node&) = default;
	//Node(Node&&) = default;
	//Node& operator=(const Node&) = default;
	Node(char label);
	Node(char label, std::string word);
	//~Node() = default;

	NodePtr AddNode(const std::string& word, std::string::iterator& it, const std::string& sortedword);
	void TraverseNode();
	char label{};

private:
	std::vector<NodePtr> nodes;
	std::vector<std::string> words;
};