#include "anatree.h"
#include <iostream>
#include <fstream>
#include <algorithm>

Anatree::Anatree(std::string filePath)
{
	root = std::make_unique<Node>('a');

	std::string temp;

	std::ifstream file(filePath.c_str(), std::ios::in);


	if (file.good()) {
		std::getline(file, temp, '\n');
		std::string tempier(temp);
		std::sort(temp.begin(), temp.end());

		auto it = tempier.begin();

		root.get()->AddNode(temp, it, tempier);

		std::cout << temp << " " << tempier;

		root.get()->TraverseNode();
	}
}

Node::Node()
	: label('~')
{

}

Node::Node(char label)
	: label(label)
{
	
}

Node::Node(char label, std::string word)
	: label(label)
{
	//std::cout << label << "\n";
}

NodePtr Node::AddNode(const std::string& word, std::string::iterator& it, const std::string& sortedword)
{
	if (it == sortedword.end()) {
		return std::make_unique<Node>(' ', word);
	}
	else if (*it < label) {
		auto parent = std::make_unique<Node>(*(it++));
		parent.get()->nodes.push_back(std::make_unique<Node>(*it));
		std::cout << "parent\n";
		parent.get()->AddNode(word, it, sortedword);
		return parent;
	}
	else {
		std::cout << "child\n";
		auto node = std::make_unique<Node>(*(it), word);
		
		auto abc = node.get()->AddNode(word, ++it, sortedword);

		nodes.emplace_back(std::move(abc));

		//auto abc = AddNode(word, ++it, sortedword);

		return node;
	}

	//nodes.emplace_back(it);

}

void Node::TraverseNode()
{
	for (auto& it : nodes) {
		it.get()->TraverseNode();
		std::cout << label << "\n";
	}
}
