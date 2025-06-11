// Copyright 2023 Christian Blake

#include "EDistance.hpp"

EDistance::EDistance(std::string x, std::string y) : x(x), y(y) {
    if (x.empty() || y.empty()) {
        throw std::invalid_argument("Input strings must not be empty.");
    }
}

int EDistance::penalty(char a, char b) {
    return a == b ? 0 : 1;
}

int EDistance::min3(int a, int b, int c) {
    return std::min({a, b, c});
}

int EDistance::optDistance() {
    int m = x.length(), n = y.length();
    opt.resize(m + 1, std::vector<int>(n + 1));

    for (int i = m; i >= 0; --i) {
        opt[i][n] = 2 * (m - i);
    }
    for (int j = n; j >= 0; --j) {
        opt[m][j] = 2 * (n - j);
    }

    for (int i = m - 1; i >= 0; --i) {
        for (int j = n - 1; j >= 0; --j) {
            int costMatchMismatch = (x[i] == y[j]) ? 0 : 1;
            int matchOrMismatch = opt[i + 1][j + 1] + costMatchMismatch;
            int gapInX = opt[i + 1][j] + 2;
            int gapInY = opt[i][j + 1] + 2;
            opt[i][j] = min3(matchOrMismatch, gapInX, gapInY);
        }
    }
    return opt[0][0];
}


std::string EDistance::alignment() {
    std::string alignment;
    size_t i = 0, j = 0;

    while (i < x.length() || j < y.length()) {
        if (i < x.length() && j < y.length()) {
            if (opt[i][j] == opt[i + 1][j + 1] + penalty(x[i], y[j])) {
                alignment += x[i];
                alignment += " ";
                alignment += y[j];
                alignment += " ";
                alignment += std::to_string(penalty(x[i], y[j]));
                alignment += "\n";
                i++;
                j++;
                continue;
            }
        }
        if (i < x.length() && opt[i][j] == opt[i + 1][j] + 2) {
            alignment += x[i];
            alignment += " - 2\n";
            i++;
        } else if (j < y.length() && opt[i][j] == opt[i][j + 1] + 2) {
            alignment += "- ";
            alignment += y[j];
            alignment += " 2\n";
            j++;
        } else {
            throw std::logic_error
                ("Misalignment in sequence alignment algorithm.");
                }
        }
    return alignment;
}

// For debugging
void EDistance::printOptMatrix() {
    for (size_t i = 0; i < opt.size(); ++i) {
        for (size_t j = 0; j < opt[i].size(); ++j) {
            std::cout << opt[i][j] << " ";
        }
        std::cout << std::endl;
    }
}
