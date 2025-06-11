// Copyright 2023 Christian Blake

#include "Universe.hpp"

Universe::Universe(int n, double r,
    std::vector<std::shared_ptr<CelestialBody>> p)
    : n(n), radius(r), planets(std::move(p)) {}

std::istream& operator>>(std::istream& in, Universe& universe) {
    in >> universe.n >> universe.radius;
    // universe.planets.resize(universe.n); // non smartpointer
    for (int i = 0; i < universe.n; ++i) {
        universe.planets.push_back(std::make_shared<CelestialBody>());
        // in >> universe.planets[i]; // non smartpointer
        in >> *(universe.planets[i]);
    }
    return in;
}

std::ostream& operator<<(std::ostream& out, const Universe& universe) {
    out << universe.n << '\n' << universe.radius;
    for (const auto& planet : universe.planets) {
        out << '\n' << *planet;
    }
    return out;
}

void Universe::step(double dt) {
    for (auto &planet : planets) {
        planet->Fx = 0.0;
        planet->Fy = 0.0;
    }

        for (auto &planet1 : planets) {
            for (auto &planet2 : planets) {
                if (planet1 == planet2) {
                    continue;
                }

                double dx = planet2->xpos - planet1->xpos;
                double dy = planet2->ypos - planet1->ypos;
                double r = std::sqrt(dx * dx + dy * dy);
                double r3 = r * r * r;

                double dFx = G * planet1->mass * planet2->mass * dx / r3;
                double dFy = G * planet1->mass * planet2->mass * dy / r3;

                planet1->Fx += dFx;
                planet1->Fy += dFy;
            }
        }
    for (auto &planet : planets) {
        planet->applyForce(dt);
    }
}

void Universe::draw(sf::RenderTarget& target, sf::RenderStates states) const {
    sf::Vector2u windowSize = target.getSize();
    for (const auto& planet : planets) {
        planet->updatePosition(radius, windowSize);
        target.draw(*planet);
    }
}
