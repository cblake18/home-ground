// Copyright 2023 Christian Blake

#pragma once

#include <iostream>
#include <vector>
#include <memory>
#include <utility>
#include <cmath>

#include "CelestialBody.hpp"
#include <SFML/Graphics.hpp>

class Universe : public sf::Drawable {
 public:
    Universe() = default;
    Universe(int n, double r, std::vector<std::shared_ptr<CelestialBody>> p);

    const double G = 6.67e-11;

    int n;
    double radius;
    std::vector<std::shared_ptr<CelestialBody>> planets;

    void step(double dt);

    friend std::istream& operator>>(std::istream& in, Universe& universe);
    friend std::ostream& operator<<
        (std::ostream& out, const Universe& universe);

 private:
    void draw(sf::RenderTarget& target,
    sf::RenderStates states) const override;
};
