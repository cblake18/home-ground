CC = g++
CFLAGS = --std=c++17 -Wall -Werror -pedantic -g
LIB = -lsfml-graphics -lsfml-audio -lsfml-window -lsfml-system -lboost_unit_test_framework

# Your .hpp files
DEPS = EDistance.hpp 

# Your compiled .o files
OBJECTS = EDistance.o main.o 

# The name of your program
PROGRAM = EDistance

# Test program name
TEST_PROGRAM = test

.PHONY: all clean lint

all: $(PROGRAM) $(TEST_PROGRAM)

%.o: %.cpp $(DEPS)
	$(CC) $(CFLAGS) -c $<

EDistance.a: $(OBJECTS)
	ar rcs $@ $^

$(PROGRAM): EDistance.a
	$(CC) $(CFLAGS) -o $@ $^ $(LIB)

$(TEST_PROGRAM): test.o EDistance.a
	$(CC) $(CFLAGS) -o $@ test.o EDistance.a $(LIB)

clean:
	rm -f *.o *.a $(PROGRAM) $(TEST_PROGRAM)

lint:
	cpplint *.cpp *.hpp
