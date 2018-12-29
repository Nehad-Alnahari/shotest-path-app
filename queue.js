// CPCS 324 Algorithms & Data Structures 2
// Outline - Priority queue data structure
// 2017, Dr. Muhammad Al-Hashimi
// -----------------------------------------------------------------------
// Basic design decisions and implementation planning (objects & interfaces)
// initial requirements: to quickly support Dijkstra and second Prim's algorithms, 
// implement minimum priority functionality
// design decisions:
// based on the 324 linked list implementation
// how will the PQ ops be implemented?
// <student fill here>
// code plan: start to write your API specifications (JSDOC comments) and think about 
// design consequences (design impact)
// Impact analysis:
// <student fill here>
// -----------------------------------------------------------------------
// Priority queue object constructor (document using JSDOC comments)
/**
 * @constructor
 * @description create new list and declare the methode
 * @author Areej Saleh
 */
function PQueue()
{
    this.pq = new List(); // requirement: linked-list implementation


    // specify (design) methods
    this.isEmpty = pqEmpty; // return true if queue empty
    this.deleteMin = deleteMin; // remove/return item with minimum priority
    this.insert = insertImp1; // insert an item with priority
    this.decrease = decrease; // (fill) update item priority (decrease as defined in textbook) 

}

// -----------------------------------------------------------------------
// Priority queue node constructor (document using JSDOC comments)
/**
 * @description create new node with two parameter 
 * @param item {integer}
 * @param key {integer}
 * @author Areej Saleh
 */
function PQNode(item, key)
{
    this.item = item;
    this.prior = key;

    // specify (design) methods

}

// -----------------------------------------------------------------------
// functions used by PQueue() object methods
// specify interface information (JSDOC comments)
// ....

/**
 *  @methodOf PQueue#
 * @description check if pq is empty 
 * @returns {boolean}
 * @author Areej Saleh
 */
function pqEmpty()
{
    return (this.pq.isEmpty());
}

/**
 * @methodOf PQueue#
 * @description delete the first node in the pirorty queue 
 * @returns {PQNode}
 * @author Areej Saleh
 */

function deleteMin()
{
    if (!this.isEmpty())
    {
        var temp = this.pq.first;
        this.pq.first = this.pq.first.next;
        return (temp.item);
    }
}

/**
 * @methodOf PQueue#
 * @description insert node in the pirorty queue 
 * @param item {integer}
 * @param key {integer}
 * @author Areej Saleh
 */

function insertImp1(item, key)
{
    // create PQNode and insert the two parameters into it
    var pqnode = new PQNode(item, key);


    //if the list is empty insert the node 
    if (this.isEmpty())
    {
        this.pq.insert(pqnode);
    }

    // if the key is the minimum insert it first
    else if (pqnode.prior < this.pq.first.item.prior)
    {
        var temp = this.pq.first;
        this.pq.first = new LNode(pqnode);
        this.pq.first.next = temp;

    }

    // otherwise walk down list and insert the node in the correct position
    else
    {
        var l = this.pq.first; // walker variable
        while (l.next != null)
        {
            if (l.next.item.prior > pqnode.prior)
            {
                break;
            }
            l = l.next;
        }
        var temp = new LNode(pqnode)
        temp.next = l.next;
        l.next = temp;

    }

}


/**
 * @methodOf PQueue# 
 * @description update node's key and re-sort the pirorty queue
 * @param item {integer}
 * @param key {integer}
 * @author Areej Saleh
 */
function decrease(item, key)
{
    var l = this.pq.first; // walker variable
    var previous;
    //walk down list 
    while (l != null)
    {
        if (item == l.item.item)
        {
            //update that node's key
            l.item.prior = key;

            // if the node is the first node then deleteMin & reinsert it  	
            if (l.item.item == this.pq.first.item.item)
            {
                var temp = this.deleteMin();
                this.insert(temp.item, temp.prior);
            }

            // otherwise, link the previous node with next & reinsert updated node
            else
            {
                var temp_item = l.item.item;
                var temp_prior = l.item.prior;
                previous.next = l.next;
                this.insert(temp_item, temp_prior);

            }


            break;
        }


        previous = l;
        l = l.next;
    }
}