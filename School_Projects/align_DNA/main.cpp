// Copyright 2023 Christian Blake

#include "EDistance.hpp"
#include <SFML/System.hpp>

int main() {
    sf::Clock clock;

    std::string x, y;

    std::getline(std::cin, x);
    std::getline(std::cin, y);

    EDistance edistance(x, y);
    int distance = edistance.optDistance();
    sf::Time t = clock.getElapsedTime();

    std::cout << "Edit distance = " << distance << "\n";
    std::cout << edistance.alignment();

    std::cout << "Execution time is " << t.asSeconds()
        << " seconds" << std::endl;

    return 0;
}
