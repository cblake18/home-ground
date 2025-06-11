// Copyright 2024 Christian Blake

#ifndef DONUTSHOP_PTHREADS_H
#define DONUTSHOP_PTHREADS_H

#define _GNU_SOURCE
#include <sched.h>
#include <utmpx.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/syscall.h>
#include <linux/unistd.h>
#include <strings.h>
#include <signal.h>
#include <sys/time.h>
#include <pthread.h>
#include <sys/fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <time.h>


#define NUMFLAVORS 4
#define NUMSLOTS 1881
#define NUMCONSUMERS 50
#define NUMPRODUCERS 30
#define NUM_DOZEN 2000


typedef struct {
	int flavor [NUMFLAVORS] [NUMSLOTS];
	int outptr [NUMFLAVORS];
	int	in_ptr [NUMFLAVORS];
	int	serial [NUMFLAVORS];
	int	spaces [NUMFLAVORS];
	int	donuts [NUMFLAVORS];
} DONUT_SHOP;

extern DONUT_SHOP shared_ring;
extern pthread_mutex_t prod[NUMFLAVORS];
extern pthread_mutex_t cons[NUMFLAVORS];
extern pthread_cond_t prod_cond[NUMFLAVORS];
extern pthread_cond_t cons_cond[NUMFLAVORS];
extern pthread_t thread_id[NUMCONSUMERS + NUMPRODUCERS];
extern pthread_t sig_wait_id;
extern const char *flavor_names[NUMFLAVORS];

void *sig_waiter(void *arg);
void sig_handler(int sig);
void *producer (void *arg);
void *consumer (void *arg);

#endif