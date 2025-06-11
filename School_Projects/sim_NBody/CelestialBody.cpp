// Copyright 2023 Christian Blake

#include "CelestialBody.hpp"

CelestialBody::CelestialBody(double x, double y, double xv,
    double yv, double m, double fx, double fy, const std::string& file)
    : xpos(x), ypos(y), xvel(xv), yvel(yv), mass(m),
      Fx(fx), Fy(fy), filename(file) {
}

std::istream& operator>>(std::istream& in, CelestialBody& planet) {
    in >> planet.xpos >> planet.ypos >> planet.xvel
        >> planet.yvel >> planet.mass >> planet.filename;

    // if (!planet.texture.loadFromFile("nbody/" + planet.filename)) {
    if (!planet.texture.loadFromFile(planet.filename)) {
        std::cout << "Error loading file" << std::endl;
    }
    planet.sprite.setTexture(planet.texture);

    return in;
}

std::ostream& operator<<(std::ostream& out, const CelestialBody& planet) {
    out << planet.xpos << ' ' << planet.ypos << ' ' << planet.xvel
        << ' ' << planet.yvel << ' ' << planet.mass << ' ' << planet.filename;
    return out;
}

void CelestialBody::updatePosition(double radius, sf::Vector2u windowSize) {
    // Meters to pixels
    double pixels_x = (xpos / radius) * windowSize.x / 2 + windowSize.x / 2;
    double pixels_y = windowSize.y /2 - (ypos / radius) * windowSize.y / 2;

    sprite.setPosition(sf::Vector2f(pixels_x, pixels_y));
}

void CelestialBody::applyForce(double dt) {
    double ax = Fx / mass;
    double ay = Fy / mass;

    xvel += ax * dt;
    yvel += ay * dt;

    xpos += xvel * dt;
    ypos += yvel * dt;
}

void CelestialBody::draw(sf::RenderTarget& target,
    sf::RenderStates states) const {
    target.draw(sprite, states);
}
