// Copyright 2024 Christian Blake

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define NUMBER_ENTRIES  (1001)
#define FALSE           (0)
#define TRUE            (1)
#define DONE            (2)
#define MIN_BLOCK_SIZE  (32)

// structure for tracking memory requests
struct request{
    int is_req;
    int is_allocated;
    int size;
    int match_alloc;
    int base_adr;
    int next_boundary_adr;
    int memory_left;
    int largest_chunk;
    int elements_on_free_list;
    void *allocation_info; // pointer to allocation structure (for freeing)
}req_array[NUMBER_ENTRIES];

// first fit/best fit free list element
struct free_list{
    struct free_list *next;
    struct free_list *previous;
    int block_size;
    int block_adr;
    int adjacent_adr;
}list_head, *top;

// buddy system list element
struct lel {
    struct lel *next;
    struct lel *prev;
    int adr;
    int bud_adr;
    int bit;
};

// budy system list head for each power-of-2 size class
struct lh {
    struct lel *head;
    int cnt;
} lst_ary[21]; // support sizes from 2^0 to 2^20

// some globals
struct free_list list_head;
int policy;
int pool_size;
int total_free;
int allocation_count = 0;
int failed_count = 0;

// function declarations
void init_memory(int size);
int allocate_memory(int seq_num, int size);
int update_list(int req_num);
void count_free_elements(int seq_num);
int process_request(int seq_num, char *type, int value);
void print_results();

// init memory pool
void init_memory(int size) {
    int i;

    // init request array
    for (i = 0; i < NUMBER_ENTRIES; i++) {
        req_array[i].is_req = FALSE;
        req_array[i].is_allocated = FALSE;
        req_array[i].allocation_info = NULL;
    }

    total_free = size;

    if (policy == 1 || policy == 2) {
        // first fit or best fit init
        // create initial free block for entire memory pool
        struct free_list *initial = (struct free_list *)malloc(sizeof(struct free_list));
        initial->block_size = size;
        initial->block_adr = 0;
        initial->adjacent_adr = size;
        initial->next = NULL;
        initial->previous = &list_head;

        list_head.next = initial;
        list_head.previous = NULL;
    } else {
        // buddy system init
        int max_power = 0;

        // init all buddy lists
        for (i = 0; i < 21; i++) {
            lst_ary[i].head = NULL;
            lst_ary[i].cnt = 0;
        }

        // find power of 2 that fits memory pool
        while ((1 << max_power) < size) {
            max_power++;
        }

        // create initial block
        struct lel *initial = (struct lel *)malloc(sizeof(struct lel));
        initial->adr = 0;
        initial->bud_adr = 0;
        initial->bit = max_power;
        initial->next = NULL;
        initial->prev = NULL;

        lst_ary[max_power].head = initial;
        lst_ary[max_power].cnt = 1;
    }
}

// process alloc request
int allocate_memory(int seq_num, int size) {
    struct free_list *p, *best, *new_node;
    struct lel *buddy_block;
    int min_diff, size_class, i;

    req_array[seq_num].is_req = TRUE;
    req_array[seq_num].size = size;

    if (policy == 1) {
        // first fit alloc
        for (p = list_head.next; p != NULL; p = p->next) {
            if (p->block_size >= size) {
                // found a block big enough
                req_array[seq_num].is_allocated = TRUE;
                req_array[seq_num].base_adr = p->block_adr;
                req_array[seq_num].next_boundary_adr = p->block_adr + size;

                // update free space
                total_free -= size;

                // check if block needs to be split
                if (p->block_size > size) {
                    // create new free block with remaining space
                    new_node = (struct free_list *)malloc(sizeof(struct free_list));
                    new_node->block_adr = p->block_adr + size;
                    new_node->block_size = p->block_size - size;
                    new_node->adjacent_adr = p->adjacent_adr;
                    new_node->next = p->next;
                    new_node->previous = p->previous;

                    p->previous->next = new_node;
                    if (p->next) {
                        p->next->previous = new_node;
                    }
                } else {
                    // use entire free block
                    p->previous->next = p->next;
                    if (p->next) {
                        p->next->previous = p->previous;
                    }
                }

                // free used node
                free(p);

                allocation_count++;
                return TRUE;
            }
        }

        // no suitable block found
        req_array[seq_num].is_allocated = FALSE;
        failed_count++;
        return FALSE;
    } else if (policy == 2) {
        // best fit alloc
        best = NULL;
        min_diff = pool_size + 1;

        // find smallest block that fits
        for (p = list_head.next; p != NULL; p = p->next) {
            if (p->block_size >= size && p->block_size - size < min_diff) {
                min_diff = p->block_size - size;
                best = p;

                // perfect fit - use immediately
                if (min_diff == 0) break;
            }
        }

        if (best) {
            // found suitable block
            req_array[seq_num].is_allocated = TRUE;
            req_array[seq_num].base_adr = best->block_adr;
            req_array[seq_num].next_boundary_adr = best->block_adr + size;

            // update free space
            total_free -= size;

            // check if block need to be split
            if (best->block_size > size) {
                // create new free block with remaining space
                new_node = (struct free_list *)malloc(sizeof(struct free_list));
                new_node->block_adr = best->block_adr + size;
                new_node->block_size = best->block_size - size;
                new_node->adjacent_adr = best->adjacent_adr;
                new_node->next = best->next;
                new_node->previous = best->previous;

                best->previous->next = new_node;
                if (best->next) {
                    best->next->previous = new_node;
                }
            } else {
                // use entire block
                best->previous->next = best->next;
                if (best->next) {
                    best->next->previous = best->previous;
                }
            }

            // free used node
            free(best);

            allocation_count++;
            return TRUE;
        }

        // no suitable block found
        req_array[seq_num].is_allocated = FALSE;
        failed_count++;
        return FALSE;
    } else {
        // buddy system allocation
        // find smallest power of 2 that can fit the size
        size_class = 0;
        while ((1 << size_class) < size || (1 << size_class) < MIN_BLOCK_SIZE) {
            size_class++;
        }

        // try to find block of right size
        buddy_block = NULL;

        // check if we have block of right size
        if (lst_ary[size_class].cnt > 0) {
            buddy_block = lst_ary[size_class].head;
            lst_ary[size_class].head = buddy_block->next;

            if (buddy_block->next) {
                buddy_block->next->prev = NULL;
            }

            lst_ary[size_class].cnt--;
        } else {
            // try to split a larger block
            for (i = size_class + 1; i < 21; i++) {
                if (lst_ary[i].cnt > 0) {
                    // found larger block
                    struct lel *larger = lst_ary[i].head;
                    lst_ary[i].head = larger->next;

                    if (larger->next) {
                        larger->next->prev = NULL;
                    }

                    lst_ary[i].cnt--;

                    // recursively split until get right size
                    while (larger->bit > size_class) {
                        // split into two buddies
                        struct lel *buddy = (struct lel *)malloc(sizeof(struct lel));
                        buddy->bit = larger->bit - 1;
                        buddy->adr = larger->adr + (1 << (larger->bit - 1));
                        buddy->bud_adr = larger->adr;
                        buddy->next = NULL;
                        buddy->prev = NULL;

                        // add buddy to free list
                        buddy->next = lst_ary[larger->bit - 1].head;
                        if (lst_ary[larger->bit - 1].head) {
                            lst_ary[larger->bit - 1].head->prev = buddy;
                        }
                        lst_ary[larger->bit - 1].head = buddy;
                        lst_ary[larger->bit - 1].cnt++;

                        // update original block
                        larger->bit--;
                    }

                    buddy_block = larger;
                    break;
                }
            }
        }

        if (buddy_block) {
            // alloc success
            req_array[seq_num].is_allocated = TRUE;
            req_array[seq_num].base_adr = buddy_block->adr;
            req_array[seq_num].next_boundary_adr = buddy_block->adr + (1<< buddy_block->bit);
            req_array[seq_num].allocation_info = buddy_block;

            // update free space
            total_free -= (1 << buddy_block->bit);

            allocation_count++;
            return TRUE;
        }

        // no suitable block found
        req_array[seq_num].is_allocated = FALSE;
        failed_count++;
        return FALSE;
    }
}

// free a block
int update_list(int req_num) {
    struct free_list *new_node, *next, *prev;
    struct lel *buddy_block, *partner;
    int buddy_addr;

    // free operations for failed allocs do nothing
    if (!req_array[req_num].is_allocated) {
        return FALSE;
    }

    if (policy == 1 || policy == 2) {
        // first fit/best fit free operation
        // create new free block
        new_node = (struct free_list *)malloc(sizeof(struct free_list));
        new_node->block_adr = req_array[req_num].base_adr;
        new_node->block_size = req_array[req_num].size;
        new_node->adjacent_adr = req_array[req_num].next_boundary_adr;

        // update free space
        total_free += req_array[req_num].size;

        // insert in address order to help coalesce
        prev = &list_head;
        next = list_head.next;

        while (next && next->block_adr < new_node->block_adr) {
            prev = next;
            next = next->next;
        }

        // insert new node
        new_node->previous = prev;
        new_node->next = next;
        prev->next = new_node;

        if (next) {
            next->previous = new_node;
        }

        // try to coalesce with adjacent blocks
        // check for coalescing with next block
        if (new_node->next && new_node->adjacent_adr == new_node->next->block_adr) {
            next = new_node->next;

            // merge blocks
            new_node->block_size += next->block_size;
            new_node->adjacent_adr = next->adjacent_adr;

            // remove next block
            new_node->next = next->next;
            if (next->next) {
                next->next->previous = new_node;
            }

            free(next);
        }

        // check for coalescing with prev block
        if (new_node->previous != &list_head && new_node->previous->adjacent_adr == new_node->block_adr) {
            prev = new_node->previous;

            // merge blocks
            prev->block_size += new_node->block_size;
            prev->adjacent_adr = new_node->adjacent_adr;

            // remove new node
            prev->next = new_node->next;
            if (new_node->next) {
                new_node->next->previous = prev;
            }

            free(new_node);
        }

        return TRUE;
    } else {
        // buddy system free operation
        buddy_block = (struct lel *)req_array[req_num].allocation_info;

        // update free space
        total_free += (1 << buddy_block->bit);

        // try to coalesce with buddies
        while (1) {
            // calculate buddy address
            buddy_addr = buddy_block->adr ^ (1 << buddy_block->bit);
            partner = NULL;

            // look for buddy in same size class
            for (partner = lst_ary[buddy_block->bit].head; partner != NULL; partner = partner->next) {
                if (partner->adr == buddy_addr) {
                    break;
                }
            }

            if (partner) {
                // found buddy, remove from list
                if (partner->prev) {
                    partner->prev->next = partner->next;
                } else {
                    lst_ary[buddy_block->bit].head = partner->next;
                }

                if (partner->next) {
                    partner->next->prev = partner->prev;
                }

                lst_ary[buddy_block->bit].cnt--;

                // merge blocks (use lower address)
                if (buddy_block->adr > partner->adr) {
                    buddy_block->adr = partner->adr;
                }

                buddy_block->bit++; // double size

                free(partner);

                // continue looking for more buddies
            } else {
                // no more buddies, add to free list
                buddy_block->next = lst_ary[buddy_block->bit].head;
                buddy_block->prev = NULL;

                if (lst_ary[buddy_block->bit].head) {
                    lst_ary[buddy_block->bit].head->prev = buddy_block;
                }

                lst_ary[buddy_block->bit].head = buddy_block;
                lst_ary[buddy_block->bit].cnt++;

                break;
            }
        }

        return TRUE;
    }
}

// calculate memory stats
void count_free_elements(int seq_num) {
    struct free_list *p;
    int i, count = 0, largest = 0;

    req_array[seq_num].memory_left = total_free;

    if (policy == 1 || policy == 2) {
        // first fit/best fit
        for (p = list_head.next; p != NULL; p = p->next) {
            count++;
            if (p->block_size > largest) {
                largest = p->block_size;
            }
        }
    } else {
        // buddy system
        for (i = 0; i < 21; i++) {
            count += lst_ary[i].cnt;
            if (lst_ary[i].cnt > 0 && (1 << i) > largest) {
                largest = 1 << i;
            }
        }
    }

    req_array[seq_num].elements_on_free_list = count;
    req_array[seq_num].largest_chunk = largest;
}

// process request (alloc or free)
int process_request(int seq_num, char *type, int value) {
    int result;
    if (strcmp(type, "alloc") == 0) {
        // alloc request
        result = allocate_memory(seq_num, value);
        count_free_elements(seq_num);
        return result;
    } else {
        // free request
        req_array[seq_num].is_req = FALSE;
        req_array[seq_num].match_alloc = value;

        // check if referenced alloc was successful
        if (req_array[value].is_allocated) {
            req_array[seq_num].is_allocated = TRUE;
            update_list(value);
        } else {
            // no-op for failed allocs
            req_array[seq_num].is_allocated = FALSE;
        }

        count_free_elements(seq_num);
        return TRUE;
    }
}

// print final results
void print_results() {
    int i;

    // print policy and pool size
    printf("MANAGEMENT POLICY = ");
    if (policy == 1) {
        printf("First Fit\n");
    } else if (policy == 2) {
        printf("Best Fit\n");
    } else {
        printf("Buddy System\n");
    }

    printf("POOL SIZE = %d KB\n", pool_size / 1024);

    // print failed results
    for (i = 1; i < NUMBER_ENTRIES; i++) {
        if (req_array[i].is_req && !req_array[i].is_allocated) {
            printf("Failed Req %d is size %d\n", i, req_array[i].size);
        }
    }

    // print total allocs
    printf("TOTAL ALLOCATIONS: %d\n", allocation_count);

    // print header
    printf("Seq # Type Size/Rq# Done? Free Total Free Elems Largest Chunk\n");

    // print each request details
    for (i = 1; i < NUMBER_ENTRIES; i++) {
        if (req_array[i].is_req || req_array[i].match_alloc > 0) {
            printf("%-5d ", i);

            if (req_array[i].is_req) {
                printf("alloc %-7d ", req_array[i].size);
            } else {
                printf("free %-7d ", req_array[i].match_alloc);
            }

            printf("%-4s ", req_array[i].is_allocated ? "YES" : "NO");
            printf("%-10d ", req_array[i].memory_left);
            printf("%-10d ", req_array[i].elements_on_free_list);
            printf("%-10d\n", req_array[i].largest_chunk);
        }
    }

}

int main(int argc, char *argv[]) {
    FILE *fp;
    int seq_num, type_val;
    char type[10];

    // check command line args
    if (argc != 4) {
        printf("Usage: %s <policy> <pool_size> <input_file>\n", argv[0]);
        return 1;
    }

    // parse args
    policy = atoi(argv[1]); // 1=first fit, 2=best fit, 3=buddy systen
    pool_size = atoi(argv[2]) * 1024; // KB to bytes

    // init memory
    init_memory(pool_size);

    // open input file
    fp = fopen(argv[3], "r");
    if (fp == NULL) {
        printf("Error opening file: %s\n", argv[3]);
        return 1;
    }

    // process each line in input file
    while (fscanf(fp, "%d %s %d", &seq_num, type, &type_val) != EOF) {
        process_request(seq_num, type, type_val);
    }

    // print results
    print_results();

    // close file
    fclose(fp);
    
    return 0;
}
