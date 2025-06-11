// Copyright 2023 Christian Blake

#pragma once

#include <iostream>
#include <string>
#include <memory>

#include <SFML/Graphics.hpp>

class CelestialBody : public sf::Drawable {
 public:
  CelestialBody() = default;
  CelestialBody(double x, double y, double xv, double yv,
  double m, double fx, double fy, const std::string& file);

  double xpos, ypos, xvel, yvel, mass;
  double Fx, Fy;
  std::string filename;
  sf:: Sprite sprite;
  sf::Texture texture;

  void updatePosition(double radius, sf::Vector2u windowSize);

  void applyForce(double dt);

  friend std::istream& operator>>(std::istream& in, CelestialBody& planet);
  friend std::ostream& operator<<
    (std::ostream& out, const CelestialBody& planet);

 private:
  friend class Universe;
  void draw(sf::RenderTarget& target,
    sf::RenderStates states) const override;
};
