// Copyright 2024 Christian Blake

#include "donut_shop.h"

DONUT_SHOP shared_ring;
pthread_mutex_t prod[NUMFLAVORS];
pthread_mutex_t cons[NUMFLAVORS];
pthread_cond_t prod_cond[NUMFLAVORS];
pthread_cond_t cons_cond[NUMFLAVORS];
pthread_t thread_id[NUMCONSUMERS + NUMPRODUCERS];
pthread_t sig_wait_id;

// Flavor names for output formatting
const char *flavor_names[NUMFLAVORS] = {
    "plain",
    "jelly",
    "coconut",
    "honey-dip"
};

// init shared resources, create threads
 int main(int argc, char *argv[]) {
    int i, j, k, nsigs;
    struct timeval randtime, first_time, last_time;
    struct sigaction new_act;
    int arg_array[NUMCONSUMERS];
    sigset_t all_signals;
    int sigs[] = {SIGBUS, SIGSEGV, SIGFPE};
    char msg[256];

    // initial timestamp
    gettimeofday(&first_time, (struct timezone *)0);

    // init consumer argument array - each consumer gets its ID
    for (i = 0; i < NUMCONSUMERS; i++) {
        arg_array[i] = i + 1;
    }

    // init mutexes, condition vars, ring buff state
    for (i = 0; i < NUMFLAVORS; i++) {
        pthread_mutex_init(&prod[i], NULL);
        pthread_mutex_init(&cons[i], NULL);
        pthread_cond_init(&prod_cond[i], NULL);
        pthread_cond_init(&cons_cond[i], NULL);
        shared_ring.outptr[i] = 0;
        shared_ring.in_ptr[i] = 0;
        shared_ring.serial[i] = 0;
        shared_ring.spaces[i] = NUMSLOTS;
        shared_ring.donuts[i] = 0;
    }

    // setup signal handling
    sigfillset(&all_signals);
    nsigs = sizeof(sigs) / sizeof(int);
    for (i = 0; i < nsigs; i++) {
        sigdelset(&all_signals, sigs[i]);
    }
    sigprocmask(SIG_BLOCK, &all_signals, NULL);

    sigfillset(&all_signals);
    for (i = 0; i < nsigs; i++) {
        new_act.sa_handler = sig_handler;
        new_act.sa_mask = all_signals;
        new_act.sa_flags = 0;
        if (sigaction(sigs[i], &new_act, NULL) == -1) {
            perror("can't set signals: ");
            exit(1);
        }
    }

    printf("Initializing donut shop with %d producers and %d consumers\n", NUMPRODUCERS, NUMCONSUMERS);
    printf("Each consumer will collect %d dozen donuts\n", NUM_DOZEN);
    printf("Ring buffer size: %d slots per flavor\n", NUMSLOTS);

    // create consumer threads
    for (i = 0; i < NUMCONSUMERS; i++) {
        if (pthread_create(&thread_id[i], NULL, consumer, (void *)&arg_array[i]) != 0) {
            printf("pthread_create failed for consumer %d\n", i);
            exit(3);
        }
    }

    // create producer threads
    for (; i< NUMCONSUMERS + NUMPRODUCERS; i++) {
        if (pthread_create(&thread_id[i], NULL, producer, NULL) != 0) {
            printf("pthread_create failed for producer %d\n", i - NUMCONSUMERS);
            exit(3);
        }
    }

    printf("All threads created successfully\n");

    // wait for all consumers to finish
    for (i = 0; i < NUMCONSUMERS; i++) {
        pthread_join(thread_id[i], NULL);
    }

    // calculate and display elapsed time
    gettimeofday(&last_time, (struct timezone *)0);
    if ((i = last_time.tv_sec - first_time.tv_sec) == 0) {
        j = last_time.tv_usec - first_time.tv_usec;
    } else {
        if (last_time.tv_usec - first_time.tv_usec < 0) {
            i--;
            j = 1000000 + (last_time.tv_usec - first_time.tv_usec);
        } else {
            j = last_time.tv_usec - first_time.tv_usec;
        }
    }

    printf("Elapsed consumer time is %d sec and %d usec, or %f sec\n",
         i, j, (float)(i + (float)j / 1000000));

    // record run time to file
    int fd;
    if ((fd = open("./run_times", O_WRONLY | O_CREAT | O_APPEND, 0644)) == -1) {
        perror("Cannot open run time file");
        exit(1);
    }

    sprintf(msg, "%f\n", (float)(i + (float)j / 1000000));
    write(fd, msg, strlen(msg));
    close(fd);

    printf("\nALL CONSUMERS FINISHED, TERMINATING PROCESS\n");
    exit(0);
 }

 // producer thread function - continuously produce donuts of random flavors
 void *producer(void *arg) {
    int i, j, donut_type;
    unsigned short xsub[3];
    struct timeval randtime;

    // init random num generator with unique seed
    gettimeofday(&randtime, (struct timezone *)0);
    xsub[0] = (unsigned short)randtime.tv_usec;
    xsub[1] = (unsigned short)(randtime.tv_usec >> 16);
    xsub[2] = (unsigned short)(pthread_self());

    while (1) {
        // select a random donut flavor
        donut_type = nrand48(xsub) & 3;

        // lock production mutex for this flavor
        pthread_mutex_lock(&prod[donut_type]);

        // wait if theres no space in ring buffer
        while (shared_ring.spaces[donut_type] == 0) {
            pthread_cond_wait(&prod_cond[donut_type], &prod[donut_type]);
        }

        // add donut to ring buffer
        shared_ring.flavor[donut_type][shared_ring.in_ptr[donut_type]] =
            ++shared_ring.serial[donut_type];
        
        // update pointer and counter
        shared_ring.in_ptr[donut_type] = 
            (shared_ring.in_ptr[donut_type] + 1) % NUMSLOTS;
        shared_ring.spaces[donut_type]--;

        // release production mutex
        pthread_mutex_unlock(&prod[donut_type]);

        // lock consumer mutex to update donut count
        pthread_mutex_lock(&cons[donut_type]);
        shared_ring.donuts[donut_type]++;

        // signal waiting consumers that a donut is available
        pthread_cond_signal(&cons_cond[donut_type]);
        pthread_mutex_unlock(&cons[donut_type]);
    }

    return NULL;
 }

 // consumer thread function - collects dozens of donuts until reaching NUM_DOZEN
 void *consumer(void *arg) {
    int i, j, k, m, id, donut_type;
    unsigned short xsub[3];
    struct timeval randtime;
    FILE *fp;
    char filename[128];
    int dozen[NUMFLAVORS][12];
    int dozen_count[NUMFLAVORS];

    // get consumer ID from argument
    id = *(int *)arg;

    // init random num generator with unique seed
    gettimeofday(&randtime, (struct timezone *)0);
    xsub[0] = (unsigned short)randtime.tv_usec;
    xsub[1] = (unsigned short)(randtime.tv_usec >> 16);
    xsub[2] = (unsigned short)(pthread_self());

    // create consumer log file (for first 5 consumers)
    if (id <= 5) {
        sprintf(filename, "consumer_%d.txt", id);
        fp = fopen(filename, "w");
        if (fp == NULL) {
            perror("Cannot open consumer log file");
            pthread_exit(NULL);
        }
    }

    // collect donuts in dozens
    for (i = 0; i < NUM_DOZEN; i++) {
        // reset count for each donut flavor in this dozen
        for (j = 0; j < NUMFLAVORS; j++) {
            dozen_count[j] = 0;
        }

        // collect 12 donuts for this dozen
         for (m = 0; m < 12; m++) {
            // select random donut flavor (0-3)
            donut_type = nrand48(xsub) & 3;

            // lock consumer mutex for this flavor
            pthread_mutex_lock(&cons[donut_type]);

            // wait if there are no donuts of this flavor
            while (shared_ring.donuts[donut_type] == 0) {
                pthread_cond_wait(&cons_cond[donut_type], &cons[donut_type]);
            }

            // take donut from ring buffer
            dozen[donut_type][dozen_count[donut_type]++] =
                shared_ring.flavor[donut_type][shared_ring.outptr[donut_type]];

            // update pointer and counter
            shared_ring.outptr[donut_type] = 
                (shared_ring.outptr[donut_type] + 1) % NUMSLOTS;
            shared_ring.donuts[donut_type]--;

            // release consumer mutex
            pthread_mutex_unlock(&cons[donut_type]);

            // lock producer mutex to update space count
            pthread_mutex_lock(&prod[donut_type]);
            shared_ring.spaces[donut_type]++;

            // signal waiting producers that a space is available
            pthread_cond_signal(&prod_cond[donut_type]);
            pthread_mutex_unlock(&prod[donut_type]);
         }

         // write to log file (only first 10 dozen for first 5 consumers)
         if (id <= 5 && i < 10) {
            struct timeval current_time;
            struct tm *tm_info;
            char time_str[30];

            gettimeofday(&current_time, (struct timezone *)0);
            tm_info = localtime(&current_time.tv_sec);
            strftime(time_str, 30, "%H:%M:%S", tm_info);

            fprintf(fp, "Consumer thread #: %d time: %s.%03d dozen #: %d\n",
                id, time_str, (int)(current_time.tv_usec / 1000), i + 1);

            // print header line with flavor names
            for (j = 0; j < NUMFLAVORS; j++) {
                fprintf(fp, "%-10s", flavor_names[j]);
            }
            fprintf(fp, "\n");

            // print the donuts in each dozen by flavor
            for (m = 0; m < 12; m++) {
                for (j = 0; j < NUMFLAVORS; j++) {
                    if (m < dozen_count[j]) {
                        fprintf(fp, "%-10d", dozen[j][m]);
                    } else {
                        fprintf(fp, "          ");
                    }
                }
                fprintf(fp, "\n");
            }
            fprintf(fp, "\n");
         }

         // sleep to allow other consumers to run
         usleep(100);
    }

    // close log file if it was created
    if (id <= 5) {
        fclose(fp);
        printf("Consumer %d finished collecting %d dozens \n", id, NUM_DOZEN);
    }

    return NULL;
 }

 void *sig_waiter(void *arg) {
    sigset_t sigterm_signal;
    int signo;

    sigemptyset ( &sigterm_signal );
    sigaddset ( &sigterm_signal, SIGTERM );
    sigaddset ( &sigterm_signal, SIGINT );

    /* set for asynch signal management for SIGs 2 and 15 */
    if (sigwait(&sigterm_signal, & signo) != 0) {
        printf ("\n sigwait () failed, exiting \n");
        exit(2);
    }
    printf ("Process exits on SIGNAL %d\n\n", signo);
    exit(1);
    return NULL; /* not reachable */
}

void sig_handler(int sig) {
    pthread_t signaled_thread_id;
    int i, thread_index;

    signaled_thread_id = pthread_self ();

    /******* check for own ID in array of thread Ids *******/
    for ( i = 0; i < ( NUMCONSUMERS ); i++) {
        if ( signaled_thread_id == thread_id [i] ) {
            thread_index = i + 1;
            break;
        }
    }

    printf ("\nThread %d took signal # %d, PROCESS HALT\n",
    thread_index, sig );
    exit (1);
}