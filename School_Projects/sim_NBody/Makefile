CC = g++
CFLAGS = --std=c++17 -Wall -Werror -pedantic -g
LIB = -lsfml-graphics -lsfml-audio -lsfml-window -lsfml-system -lboost_unit_test_framework

# Your .hpp files
DEPS = Universe.hpp CelestialBody.hpp

# Your compiled .o files
OBJECTS = Universe.o CelestialBody.o

# The name of your program
PROGRAM = NBody

# Test program name
TEST_PROGRAM = test

.PHONY: all clean lint

all: $(PROGRAM) $(TEST_PROGRAM)

%.o: %.cpp $(DEPS)
	$(CC) $(CFLAGS) -c $<

NBody.a: $(OBJECTS)
	ar rcs $@ $^
	
$(PROGRAM): main.o NBody.a $(OBJECTS)
	$(CC) $(CFLAGS) -o $@ main.o $(OBJECTS) $(LIB)

$(TEST_PROGRAM): test.o $(OBJECTS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIB)

clean:
	rm -f *.o *.a $(PROGRAM) $(TEST_PROGRAM)

lint:
	cpplint *.cpp *.hpp
