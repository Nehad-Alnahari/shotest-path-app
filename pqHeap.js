// CPCS 324 Algorithms & Data Structures 2
// Outline - Priority queue data structure
// 2016, Dr. Muhammad Al-Hashimi
/**
@fileOverview <p>Simple priority queue implementation with a basic set of 
priority queue nodes constructor and priority queue operations  implementation.</p>
@author Raneem Gharbi
 */
// -----------------------------------------------------------------------
// Basic design decisions and implementation planning (objects & interfaces)
// initial requirements: to support Dijkstra and second Prim's algorithms, implement  
// minimum priority functionality
// design decisions:    
// based on the 324 linked list implementation
// how will the PQ ops be implemented?
//---------------------------------------------------------------------------------------------------------------------------------------
// the design we chose is choice number 4, we will change internal linked list directly from the priority queue package
// added operations for the priority queue: 
// (insert): insert the node into the correct ordered place in the priority queue (manipulate linklist from pq package)
// (deleteMin): delete the vertex with the minimum weight from the list (always the first node)
// (isEmpty): check if the priority queue is empty (use linklist's isEmpty method)
// (decrease): method to update the priority of a vertex if it's changed
//--------------------------------------------------------------------------------------------------------------------------------------
// code plan: start to write your API specifications (JSDOC comments) and think about 
// design consequences (design impact)
// Impact analysis:
//--------------------------------------------------------------------------------------------------------------------------------------
// 1- encapaulation violation to the linklist package by manipulating it directly from the priority queue package
// violation occures in the (pqInsertImpl method)
// 2- reuse the next methods from the linklist package in the priority queue package:
//  isEmpty() to check if the priority queue is empty
//--------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------
// Priority queue object constructor (document using JSDOC comments)
/**
 Create a PQ object
 @constructor
 @author Raneem Gharbi
 @config {list} pq list  Expected property
 @returns {PQueue}
 */
function PQueue()
{
    /**#@+
     * @description Property field - 
     */
    // user input fields
    /** head pointer of  priority queue
       @private */
    this.pq = new Heap(); // requirement: Heap implementation

    /**#@- */

    // specify (design) methods
    /**#@+
     * @description <em>Member method - </em> 
     */
    /**  return true if the priority queue is empty or false if not  {uses linklist package method: .isEmpty()}*/
    this.isEmpty = pqIsEmptyImpl;
    /**   remove/return item with minimum priority (weight) from the priority queue  */
    this.deleteMin = deleteMinImpl;
    /** insert an item with priority */
    this.insert = pqInsertImpl;
    /** update item priority (decrease as defined in textbook) */
    this.decrease = decreaseImpl;

    /**#@- */
}

// -----------------------------------------------------------------------
// Priority queue node constructor (document using JSDOC comments)
/**
 used for defining vertex objects in PQ
 
 @constructor

 @author Raneem Gharbi
 @param {object} item input (configuration) object containing user field such as item and key
 @param {integer} key input

 */
function PQNode(item, key)
{
    /**#@+
     * @description Property field - 
     */
    // user input fields
    /** to store the item in the priority queue*/
    this.item = item;
    /**key to maintain queue order*/
    this.prior = key;
    /**#@- */
}

// -----------------------------------------------------------------------
// functions used by PQueue() object methods
// specify interface information (JSDOC comments)
// ....

// -------------------
/**
check if the priority queue is empty or not
@methodOf PQueue#
@author Raneem Gharbi
@returns {boolean} -  true or false depending if the priority queue is empty or not
 */
function pqIsEmptyImpl()
{
    //return true or false depending if the priority queue is empty or nor
    return this.pq.isEmpty();
}

// -------------------
/**
insert into the priority queue in ascending order
@methodOf PQueue#
@author Raneem Gharbi
@author Zainab Abdulmani
@param {PQNode} item pq node
@param {PQNode} key represents the Priority key
 */
function pqInsertImpl(item, key)
{
    this.pq.insert(item, key);
}

// -------------------
/**
delete the item with highest priority (weight)
the list is sorted, so delete first node
@methodOf PQueue#
@author Raneem Gharbi
@author Zainab Abdulmani
@returns vertex with minimum weight 
 */
function deleteMinImpl()
{
    return this.pq.deleteRoot();
}

// -------------------
/**
update the priority of an item
@methodOf PQueue#
@author Raneem Gharbi
 @param {integer} itemID 
 @param {integer} key
 */

function decreaseImpl(itemID, key)
{
    //walker variable
    var w = this.pq.first;
    var p;
    //walk to the end of the pq
    while (w.next !== null)
    {
        //if reached the wanted node 
        if (itemID == w.item.dataitem)
        {
            //update that node's key
            if (w.item.key > key)
                w.item.key = key;

            if (w.item.dataitem == this.pq.first.item.dataitem)
            {
                var itemID_ = w.item.dataitem;
                var key_ = w.item.key;
                var item = this.deleteMin();
                this.insert(itemID_, key_);
            }
            else
            {
                var itemID_ = w.item.dataitem;
                var key_ = w.item.key;
                p.next = w.next;
                this.insert(w.item.dataitem, w.item.key);

            }


            break;
        }
        p = w;
        w = w.next;

    }
}