// Copyright 2023 Christian Blake

#pragma once

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>

class EDistance {
 private:
    std::string x, y;
    std::vector<std::vector<int>> opt;

 public:
    EDistance(std::string x, std::string y);

    static int penalty(char a, char b);

    static int min3(int a, int b, int c);

    int optDistance();

    std::string alignment();

    void printOptMatrix();
};
