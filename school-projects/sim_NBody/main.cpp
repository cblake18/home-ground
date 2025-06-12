// Copyright 2023 Christian Blake

#include <iostream>
#include "Universe.hpp"
#include "CelestialBody.hpp"

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: ./NBody T dt < planets.txt\n";
        return 1;
    }

    double T = std::stod(argv[1]);
    double dt = std::stod(argv[2]);
    double programTime = 0.0;

    int stepCounter = 0;

    Universe universe;
    std::cin >> universe;

    int stepsPerYear = static_cast<int>(round(365.25 * 24 * 60 * 60 / dt));

    sf::RenderWindow window(sf::VideoMode(1200, 800), "NBody");

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
            }
        }
        for (auto& planet : universe.planets) {
            planet->updatePosition(universe.radius, window.getSize());
        }

        if (programTime < T) {
            universe.step(dt);
            programTime += dt;
            stepCounter++;

            if (stepCounter % stepsPerYear == 0) {
                std::cout << "One year elapsed: " << universe << std::endl;
            }

            if (stepCounter == 1 || stepCounter % 10 == 0) {
                std::cout << "Elapsed time: " << programTime << std::endl;
            }
        } else {
            std::cout << universe << std::endl;
            break;
        }

        window.clear();
        window.draw(universe);
        window.display();
    }

    return 0;
}
