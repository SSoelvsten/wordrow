#include "anatree.h"
#include <iostream>
#include <fstream>
#include <algorithm>

Anatree::Anatree(std::string filePath)
{
	root = std::make_unique<Node>('c');

	std::string temp;

	std::ifstream file(filePath.c_str(), std::ios::in);


	if (file.good()) {
		std::getline(file, temp, '\n');
		std::string tempier(temp);
		std::sort(tempier.begin(), tempier.end());

		auto it = tempier.begin();

		auto abc = root.get()->AddNode(temp, it, tempier);

		std::cout << temp << " " << tempier << "\n";

		std::cout << abc.get()->label << " FWEWE";

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
		//std::cout << *it << "\n";
		auto parent = std::make_unique<Node>(*(it), word);
		//parent.get()->nodes.emplace_back(std::make_unique<Node>(*(it)));
		auto abc = AddNode(word, ++it, sortedword);
		std::cout << "parent\n";
		std::cout << abc.get()->label << "\n";
		parent.get()->nodes.emplace_back(std::move(abc));
		return parent;
	}
	else {
		//std::cout << *it << "\n";
		std::cout << "child\n";
		auto node = std::make_unique<Node>(*(it), word);
		
		auto abc = node.get()->AddNode(word, ++it, sortedword);
		std::cout << abc.get()->label << "\n";
		nodes.emplace_back(std::move(node));

		//auto abc = AddNode(word, ++it, sortedword);

		return abc;
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
