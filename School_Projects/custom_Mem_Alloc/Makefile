# Copyright 2024 Christian Blake

CC = gcc
CFLAGS = -Wall -g -lm

TARGET = assignment5

all: $(TARGET)

$(TARGET): assignment5.c
	$(CC) $(CFLAGS) -o $(TARGET) assignment5.c

clean:
	rm -f $(TARGET) *.o

run_first_fit_1mb:
	./$(TARGET) 1 1024 proj5_data > first_fit_1mb.txt

run_first_fit_512kb:
	./$(TARGET) 1 512 proj5_data > first_fit_512kb.txt

run_best_fit_1mb:
	./$(TARGET) 2 1024 proj5_data > best_fit_1mb.txt

run_best_fit_512kb:
	./$(TARGET) 2 512 proj5_data > best_fit_512kb.txt

run_buddy_1mb:
	./$(TARGET) 3 1024 proj5_data > buddy_1mb.txt

run_buddy_512kb:
	./$(TARGET) 3 512 proj5_data > buddy_512kb.txt

run_all: run_first_fit_1mb run_first_fit_512kb run_best_fit_1mb run_best_fit_512kb run_buddy_1mb run_buddy_512kb

.PHONY: all clean run_first_fit_1mb run_first_fit_512kb run_best_fit_1mb run_best_fit_512kb run_buddy_1mb run_buddy_512kb run_all