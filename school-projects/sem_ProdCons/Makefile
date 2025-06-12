# Copyright 2024 Christian Blake

CC = gcc
CFLAGS = -g -Wall
LDFLAGS = -lpthread

# Target
TARGET = donut_shop

# Source
SRCS = donut_shop.c
HEADERS = donut_shop.h

# Object
OBJS = $(SRCS:.c=.o)

# Rules
all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $(OBJS) $(LDFLAGS)

%.o: %.c $(HEADERS)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean run-test-1750 run-test-1800 run-test-1850 run-test-1900 run-test-1950 run-test-2000 run-test-1000-dozens run-test-1500-dozens run-test-2000-dozens run-test-2500-dozens run-test-3000-dozens