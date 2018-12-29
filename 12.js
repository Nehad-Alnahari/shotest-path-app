// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Final Project (NEW)
// 2018, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//
var _v = [],
    _e = []; // note naming conventions in upload guide


// -----------------------------------------------------------------------
function main_graph()
{
    //heap processing
    var HEAP = new Heap();
    var item = ["b", "d", "f", "a", "e", "c"];
    var key = [9, 6, 8, 2, 5, 7];

    for (var i = 0; i < item.length; i++)
    {
        HEAP.insert(item[i], key[i]);
    }
    document.write(HEAP.show());
    HEAP.insert("g", 10);
    document.write(HEAP.show());
    HEAP.insert("h", 15);
    document.write(HEAP.show());

    //-----------------------------------

    // create a graph (default undirected)
    var graph_1 = new Graph();

    // set graph properties
    graph_1.label = 'Exercise 9.2: 1b (Levitin, 3rd edition)';

    // use global input arrays _v and _e to initialize its internal data structures
    graph_1.readGraph(_v, _e);

    // use print_graph() method to check graph
    graph_1.printGraph();

    // output the graph adjacency matrix
    graph_1.makeAdjMatrix();

    //-----------------------------------

    //MST by prim1
    document.write("<p>MST by first Prim  </p>");
    var prim_1 = graph_1.prim();
    for (var i = 0; i < prim_1.length; i++)
    {
        document.write("( " + prim_1[i].parent + "," + prim_1[i].vertex + " )");
        if (i != prim_1.length - 1)
            document.write(" , ");
    }

    //-----------------------------------

    //MST by prim2
    document.write("<p>MST by Prim2 (linear PQ) </p>");
    var prim_2 = graph_1.prim2();
    for (var i = 0; i < prim_2.length; i++)
    {
        document.write("( " + prim_2[i].parent + "," + prim_2[i].vertex + " )");
        if (i != prim_2.length - 1)
            document.write(" , ");
    }

    //-----------------------------------

    
}


// -----------------------------------------------------------------------
// similar to starter 8
function Vertex(v)
{

    // base base property fields
    this.label = v.label;
    this.visit = false;
    this.adjacent = new List();


    // base member methods
    this.adjacentByID = adjacentByIdImpl;
    this.incidentEdge = incidentEdgeImpl;
    this.insertAdjacent = insertAdjacentImp;
    this.vertexInfo = vertexInfoImpl;

    // student methods next; actual functions in student code sections

}

// -----------------------------------------------------------------------

// similar to starter 8
function Edge(vert_i, weight)
{

    // base property fields
    this.target_v = vert_i;
    this.weight = (weight === undefined ? null : weight);
    this.label = (label === undefined ? "" : label);


    // base member methods

    // student property fields next

}

// -----------------------------------------------------------------------

// similar to starter 8 (NO network methods)
function Graph()
{

    // base property fields
    this.vert = [];
    this.nv = 0;
    this.ne = 0;
    this.digraph = false;
    this.weighted = false;
    this.dfs_push = [];
    this.bfs_order = [];
    this.label = "";
    this.connectedComp = 0;
    this.adjMatrix = [];

    // base member methods

    this.readGraph = better_input;
    this.addEdge = addEdgeImpl2;
    this.printGraph = printGraphImpl;
    this.list_vert = "";
    this.dfs = dfsImpl;
    this.bfs = bfsImpl;
    this.makeAdjMatrix = makeAdjMatrixImpl2;
    this.isConnected = isConnectedImpl;
    this.componentInfo = componentInfoImpl;
    this.topoSearch = topoSearchImpl;
    this.make_graph = make_graphImpl;

    // --------------------

    // more student fields next
    this.distance_matrix = [];
    this.TCmatrix = [];
    this.TC_by_dfs = [];

    // --------------------
    // more student methods next 

    // transitive closure package 

    this.hasPath = hasPathImpl;
    this.shortestPath = shortestPathImpl;
    this.isDAG = isDAGImpl;
    this.warshallFloyd = warshallFloydImpl;
    this.dfsTC = dfsTCImpl;

    this.Prim = PrimImpl;
    this.prim2 = primImpl2;
    this.Dijkstra = DijkstraImpl;

}

//-----------------------------------------------------------------------


// functions used by methods of Graph and ancillary objects


function make_graphImpl(n, m, w) // feel free to change, if needed
{
    // parameter validations and checks: number of edges etc.
    var mmax = n * (n - 1);
    if (!this.digraph) mmax /= 2;
    if (m > mmax)
    {
        document.write("<p>ERROR: invalid number of edges for graph type</p>");
        return;
    }

    // create n vertex in v[] using id 0 to n-1 as label
    var v = [];
    for (var i = 0; i < n; i++)
        v[i] = {
            label: i.toString()
        };

    // if graph complete no need to generate random edges, just create mmax edges systematically


    // otherwise repreat create m distinct edges (graph loops not allowed)

    var e = [],
        wmin = 1,
        wmax = 50000,
        wsum = 0;

    var h = []; // quick-dirty n x n matrix to check previously generated edges, 
    // m-entry hash table would be more efficient
    for (i = 0; i < n; i++)
    {
        h[i] = [];
        h[i][i] = 0; // no graph loops; 0 = blocked pair of vertices
    }

    for (i = 0; i < m; i++)
    {
        // generate vertices u, v randomly
        do {
            var u_i = random(0, n - 1),
                v_i = random(0, n - 1);

        } while (h[u_i][v_i] != undefined);

        h[u_i][v_i] = 0;
        h[v_i][u_i] = 0; // update matrix: block u,v; block v,u also if undirected

        // if (u,v) is distinct insert in e[] (generate random weight if w true)
        // otherwise repeat generate another u,v pair

        e[i] = {
            u: u_i,
            v: v_i
        };
        if (w)
        {
            e[i].w = random(wmin, wmax);
            wsum += e[i].w;
        }
    }

    // call graph reader method and set label, graph type depends on value of digraph property
    this.read_graph(v, e);
    this.label = "Generated " + n + " vertices, " + m + " random " + (!this.digraph ? "un" : "") + "directed edges (" + Math.round(m / mmax * 100) + "%)" + (w ? ", ave weight = " + Math.round(wsum / m) : "");
}

function random(low, high)
{
    return Math.floor(Math.random() * (high - low + 1)) + low;
}


// -----------------------------------------------------------------------
// begin student code section (NO network functions, only code related to this project)
// -----------------------------------------------------------------------

// Final M2 code here

/**
    Check the shortest path to traverse all vertecies 
    by applying Prim algorithm using  heap-based second priority queue.
	
	@memberof Graph# 
    @author Nehad Alnahari
    @method prim
*/
function primImpl2()
{
    // 'parent' array of vertecies parent 
    var parent = [];
    // 'adjVert' a variable contains all adjacents of a vertex,
    // 'm' a length of the adjacents of a vertex
    var adjVert;
    var m;
    // create a priority queue
    var pqueue = new PQHeap();
    // mark all vertecies as unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }
    // make vertex '0' as a starting vertex
    this.VT[this.VT.length] = {
        parent: '-',
        tree: 0
    };
    // mark the first vertex visited
    this.vert[0].visit = true;
    // get all adjacents of the first vertex
    adjVert = this.vert[0].incidentEdge();
    m = adjVert.length;
    // iterate along adjacents,
    // and insert them into priority queue,
    // initiate their parent with '0' (starting vertex)
    for (var i = 0; i < m; i++)
    {
        var u = adjVert[i];
        pqueue.insert(u.adjVert_i, u.edgeWeight);
        parent[u.adjVert_i] = {
            parent: 0,
            weight: u.edgeWeight
        };
    }

    // iterate along vertecies (except the starting vertex),
    // and pick the adjacent with minimum weight (using priority queue)
    for (var i = 1; i < this.nv; i++)
    {
        var u_min = pqueue.deleteMin().item;
        // mark the u_min vertex visited
        this.vert[u_min].visit = true;
        // add u_min in the visited array with its parent
        this.VT[this.VT.length] = {
            parent: parent[u_min].parent,
            tree: u_min
        };
        // get all adjacents of the minmum vertex
        adjVert = this.vert[u_min].incidentEdge();
        m = adjVert.length;
        // iterate along adjacents,
        // and insert the unvisited adjacents into priority queue,
        // update their parents
        for (var j = 0; j < m; j++)
        {
            u = adjVert[j];
            // check if the vertex has been visited before
            if (!(this.vert[u.adjVert_i].visit))
            {
                pqueue.insert(u.adjVert_i, u.edgeWeight);
                // check if the adjacent has no parent yet,
                // or has a parent with a larger weight than from u_min
                if ((parent[u.adjVert_i] == null) || (parent[u.adjVert_i] !== null && parent[u.adjVert_i].weight > u.edgeWeight))
                {
                    parent[u.adjVert_i] = {
                        parent: u_min,
                        weight: u.edgeWeight
                    };
                }
            }
        }
    }
}

// -----------------------------------------------------------------------

/**  finding shortest path from start vertex to any vertex on graph using  heap-based second priority queue
 
 @memberof Graph#
 @author Rana Sandouka
 @method Dijkstra
 @param {integer} source start vertex send from main

*/
function DijkstraImpl(source)
{
    var q = new PQHeap();
    var u;
    var parentV = [];

    //mark all verteces unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }

    //set parent p with null and distance d infinity 
    for (var i = 0; i < this.nv; i++)
    {
        parentV[i] = {
            parent: null,
            distance: Infinity
        };

        //insert all vertex in the queue with id
        q.insert(i, parentV[i].distance);
    }
    //update the vertex source i with distance d 0
    parentV[source] = {
        parent: "-",
        distance: 0
    };
    q.decrease(source, parentV[source].distance);

    for (var j = 0; j < this.nv; j++)
    {
        u = q.deleteMin();
        this.vert[u.item].visit = true;
        // insert vertex with minimum distance d in VT
        this.VT[u.item] = {
            parent: parentV[u.item].parent,
            tree: u.item,
            distance: parentV[u.item].distance
        };
        var w = this.vert[u.item].incidentEdge();
        var m = w.length;
        for (var k = 0; k < m; k++)
        {
            if (!this.vert[w[k].adjVert_i].visit)
            {
                if (u.prior + w[k].edgeWeight < parentV[w[k].adjVert_i].distance)
                {
                    parentV[w[k].adjVert_i] = {
                        parent: u.item,
                        distance: (u.prior + w[k].edgeWeight)
                    };
                    q.decrease(w[k].adjVert_i, parentV[w[k].adjVert_i].distance);

                }
            }
        }
    }
}

// -----------------------------------------------------------------------

/** 
 
    finding a minimum spanning tree by apply the prim algorithm .
 	
 	@methodOf Vertex#
 	@author Areej Ameen Mohammad

 	@returns {object[]} Array of custom objects containing edge information, in
 	input order by default. Supported interface fields are as follows:
 	
 	@returns {integer} <code>object.sourseVert_i</code> - id of sourse vertex
 	@returns {integer} <code>object.targetVert_i</code> - id of adjacent vertex (edge target)
    @returns {number} <code>object.edgeWeight</code> - weight or cost
     
 */

function PrimImpl()
{

    var VTree = []; // Tree vertices
    var ETree = []; //composing MSTs of the graph, with all information of edges and weights
    var i, j, k, v, ADJacent, initialEDGE;

    //----------------------------

    // make all vertices unvisited 

    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        v.visit = false;
    }

    //----------------------------

    //initialize the tree vertices with any vertex and process this vertex 

    v = this.vert[0];
    VTree[0] = v;
    v.visit = true;

    for (i = 1; i < this.nv; i++)
    {
        initialEDGE = Infinity;

        //find a minimum-weight edge e=(v,u) among all (v,u) such that v is in VT and u is in V-VT

        for (j = 0; j < VTree.length; j++)
        {
            ADJacent = VTree[j].incidentEdge();
            for (k = 0; k < ADJacent.length; k++)
            {
                if (!this.vert[ADJacent[k].adjVert_i].visit && ADJacent[k].edgeWeight <= initialEDGE)
                {
                    initialEDGE = ADJacent[k].edgeWeight;
                    v = VTree[j];
                    u = this.vert[ADJacent[k].adjVert_i];
                }
            }
        }

        //end for searching a minimum-weight edge 

        //----------------------------

        //insert u to the tree vertices
        VTree[VTree.length] = u;
        u.visit = true;

        //insert the edge and the new vertex to edges array
        ETree[ETree.length] = {
            sourseVert_i: v,
            targetVert_i: u,
            edgeWeight: initialEDGE
        };
    }
    return ETree;
}


// -----------------------------------------------------------------------
// paste your heap package here 
/**
    Create new Heap Object. Heap is impelemented as an array, it's complete binary tree with keys assigned to its nodes.

    @constructor
    @author Areej Ameen
    @author Israa Allouh
 */
function Heap()
{

    /**#@+
     * @description Property field -
     */

    /** heap of integer keys
     @default []
	 */
    this.h = [null];

    /** corresponding heap of data-items (any object)
     @default []
	 */
    this.h_item = [null];

    /**  heap size (heap_input size)
     @default 0
	 */
    this.size = 0;

    /**#@- */

    // --------------------
    /**#@+
     * @description <b>Member method</b> -
     */

    /** return true if heap empty
    @see #heapIsEmpty */
    this.isEmpty = heapIsEmpty;

    /** return dataitem in root
    @see #heapDeleteRoot */
    this.deleteRoot = heapDeleteRoot;

    /** insert a data with heap key
    @see #heapInsert */
    this.insert = heapInsert;

    /** top-down heapify ("sink")balance the heap according to its properties
    used by {@link heapDeleteRoot()}
    @see #heapifyImpl	*/
    this.heapify = heapifyImpl;


    /** bottom-up reheapify ("swim") used by {@link heapInsert()}
    @see #reheapifyImpl	*/
    this.reheapify = reheapifyImpl;

    /** print the heap
    @see #heapShow	*/
    this.show = heapShow; //print the heap

    /**#@- */

}
// --------------------------------------------------

function heapShow()
{
    var n = this.size;
    var m = Math.floor(n / 2); // last parent node

    var k = this.h.slice(1, n + 1),
        a = this.h_item.slice(1, n + 1);

    var out = "<h2>Heap (size=" + n + "):</h2><p>Keys: " + k + "<br>Data: " + a + "</p>";
    for (var i = 1; i <= m; i++)
    {
        out += "<p>" + i + ": <b>" + this.h[i] + "(" + this.h_item[i] + ")</b><ul>";
        if (2 * i <= n)
            out += "<li>" + this.h[2 * i] + "</li>";
        if (2 * i + 1 <= n)
            out += "<li>" + this.h[2 * i + 1] + "</li>";
        out += "</ul></p>";
    }

    return out;

} // etc.

// --------------------------------------------------
/** is Empty method check if the Heap is empty or not 
 * @method isEmpty#
 * @methodOf Heap#
 * @author Israa Allouh 
 * @returns {boolean} true if Heap is empty false if not 
 */
function heapIsEmpty()
{
    return (this.size == 0);
}

// --------------------------------------------------
/**
 * method to get the highest priority key from the heap (return data-item in root)
 * @author Areej Ameen Mohammad
 * @methodOf Heap# 
 * @returns {object} item (data-item in root)
 */
function heapDeleteRoot()
{
    // save root key and item pair

    var root = [this.h[1], this.h_item[1]];

    // ... complete

    if (!this.isEmpty())
    {
        // set the last key and item pair to be at the root 

        this.h[1] = this.h[this.size];
        this.h_item[1] = this.h_item[this.size];

        //decrease the size of the heap
        this.size--;

        //balance heap by a call [top-down] heapify 
        this.heapify(1);
    }

    //return data-item in root
    return root;
}

// --------------------------------------------------
/**insert data-item with key, This method will  insert the element  at the end of the heap
  as an leaf, then it will rebalance the heap by calling {@link #reheapify}. 
 * @method insert#
 * @memberOf Heap#
 * @param {integer} item
 * @param {integer} key
 * @author Israa Allouh
 */
function heapInsert(item, key)
{
    //exchange between min and max heap
    var Index = this.h_item.indexOf(item);
    if (Index >= 0)
    {
        if (key > this.h[Index])
            this.h[Index] = key;
    }
    // insert the element at leaf node
    this.h[++this.size] = key;
    this.h_item[this.size] = item;

    // call reheapify to balance heap
    this.reheapify(this.size);
}

// --------------------------------------------------
/**  heapify method it's work by swapping the key with the larger between its childern,
 *  otherwise it's in the appropriate place, also make a blance Heap by rearranging 
 *  the keys elements
 * 
 * @method heapify#
 * @memberOf Heap#
 * @param {integer} key
 * @author Israa Allouh
 */
function heapifyImpl()
{
    // set k parent 
    var k = this.h[1];

    var item = this.h_item[1];
    var n = this.size;
    //traversal to see parent(key) has children
    while (key * 2 <= n)
    {
        //assume largest is the first left child 
        var i = key * 2;

        //found both children 
        if (i < n)
        {
            if (this.h[i] < this.h[i + 1])
            {
                i++;
            }
        }
        // heap condition
        if (k >= this.h[i])
        {
            break;
        }
        //swap largest with parent (key)
        this.h[key] = this.h[i];
        this.h_item[key] = this.h_item[i];
        key = j;
    }

    this.h[key] = k;
    this.h_item[key] = item;

}
// --------------------------------------------------

/**
 * balance the heap after inserting item .swapping (bottom-up)used by .insert() method
 * @author Areej Ameen Mohammad
 * @methodOf Heap# 
 * @param {integer} key
 */
function reheapifyImpl(key)
{
    // get the inserted key and item pair ,also the  key and item pair of the parent 
    var item = this.h_item[key];
    var key_item = this.h[key];
    var key_parent = Math.floor(key / 2);
    var parentK = this.h[key_parent];
    var temp_item, temp_key;

    //searching for the correct position for the new inserted item
    while (key > 1 && key_item > parentK)
    {

        //exchange the position by swapping item and its parent positon 
        temp_key = this.h[key];
        temp_item = this.h_item[key];

        this.h[key] = this.h[key_parent];
        this.h_item[key] = this.h_item[key_parent];

        this.h[key_parent] = temp_key;
        this.h_item[key_parent] = temp_item;

        //update the value position of the  parent and its key
        key = Math.floor(key / 2);
        key_parent = Math.floor(key_parent / 2);

    }

    //insert the new item in the correct position
    this.h[key] = key_item;
    this.h_item[key] = item;
}

//----------------------------------------------------------------------------------
// paste your PQ package here
function PQHeap()
{

    this.pqh = new Heap();                     // requirement:  heap-based second priority queue

    // specify (design) methods
    this.isEmpty = PQemptyImp;                  // return true if queue empty
    this.deleteMin = PQdeleteMinImp;            // remove/return item with minimum priority
    this.insert = PQinsertImp;                  // insert an item with priority
    this.decrease = PQupdateImp;                // (fill) update item priority (decrease as defined in textbook) 

}

// --------------------------------------------------

/**
 * Check if priority queue is empty or not
 * @method isEmpty#
 * @memberOf PQHeap#
 * @returns {boolean}
 * @author Nehad Alnahari
 */
function PQemptyImp()
{
    return (this.pqh.isEmpty());
}

//---------------------------------------

/**
 * Delete the first (root) node in priority queue
 * @method deleteMin#
 * @memberOf PQHeap#
 * @returns {Node}
 * @author Nehad Alnahari
 */
function PQdeleteMinImp()
{
    return (this.pqh.deleteRoot());
}

//---------------------------------------

/**
 * Insert a node in priority queue 
 * @method insert#
 * @memberOf PQHeap#
 * @param item {integer}
 * @param key {integer}
 * @author Nehad Alnahari
 */
function PQinsertImp(item, key)
{
    // multiply the key by -1 to be inserted as MIN Heap
    key = key * (-1);
    this.pqh.insert(item, key);
}

//---------------------------------------

/**
 * Check if priority queue is empty or not
 * @method update#
 * @memberOf PQHeap#
 * @param item {integer}
 * @param key {integer}
 * @author Rana Bashir Sandouka
 */
function PQupdateImp(item, key)
{
    {
	
        var helpPtr=this.pq.first;
        while(helpPtr!=null)
        {
            if(helpPtr.item.item=item)
            {
            helpPtr.item.prior=key;
            break;
            }
            helpPtr=helpPtr.next;
        }
    
    }    

}

//----------------------------------------------------------------------------------


// -----------------------------------------------------------------------
// published docs section (ref. assignment page)
// similar to starters 8 and 11
// *NO* JSDOC comments in this section
// -----------------------------------------------------------------------

//return true if there is path between v_i , v_j
function hasPathImpl(v_i, v_j)
{
    return this.TCmatrix[v_i, v_j] != 0 ? true : false;
}

//----------------------------------------------------------------------------------


//return the shortest path between v_i , v_i
function shortestPathImpl(v_i, v_j)
{
    return this.distance_matrix[v_i][v_j];
}

//----------------------------------------------------------------------------------


//if there is one in diagonal is not DAG
function isDAGImpl()
{
    for (var i = 0; i < this.nv; i++)
    {
        if (this.hasPath(i, i))
            return false;
    }
    return true;
}

//----------------------------------------------------------------------------------


//APPLY warshall and Floy algorithm
function warshallFloydImpl()
{
    var k, i, j;
    var z = this.nv;

    for (i = 0; i < z; i++)
    {
        this.TCmatrix[i] = this.adjMatrix[i].slice();
        this.distance_matrix[i] = this.adjMatrix[i].slice();
    }
    //-------------------------------
    for (i = 0; i < z; i++)
    {
        for (j = 0; j < z; j++)
        {
            if (this.distance_matrix[i][j] === 0 && i != j)
            {
                this.distance_matrix[i][j] = Infinity;
            }
        }
    }
    //-----------------------------------
    for (k = 0; k < z; k++)
    {
        for (i = 0; i < z; i++)
        {
            for (j = 0; j < z; j++)
            {
                if (this.digraph) //warshall algorithm
                {
                    this.TCmatrix[i][j] = (this.TCmatrix[i][j] || (this.TCmatrix[i][k] && this.TCmatrix[k][j])) ? 1 : 0;
                }
                if (this.weighted) //Floyd algorithm
                {
                    this.distance_matrix[i][j] = Math.min(this.distance_matrix[i][j], (this.distance_matrix[i][k] + this.distance_matrix[k][j]));
                }
            }
        }
    }
}

//----------------------------------------------------------------------------------


function dfsTCImpl()
{
    var i, j, k, z, v, w;
    //--------------------------

    for (i = 0; i < this.nv; i++)
    {
        this.TC_by_dfs[i] = [];
        for (k = 0; k < this.nv; k++)
        {
            this.TC_by_dfs[i][k] = 0;
        }

        for (j = 0; j < this.nv; j++)
        {
            v = this.vert[j];
            v.visit = false;
        }

        v = this.vert[i];

        w = v.adjacentByID();
        m = w.length;
        for (z = 0; z < m; z++)
        {
            this.dfs(w[z]);
        }

        for (var c = 0; c < this.nv; c++)
        {
            if (this.vert[c].visit)
            {
                this.TC_by_dfs[i][c] = 1;
            }
        }
    }
}

//----------------------------------------------------------------------------------


function addEdgeImpl(u_i, v_i) // obsolete - Use #addEdgeImpl2 instead. 
{
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    u.adjacent.insert(v_i);

    if (!this.digraph)
    {
        v.adjacent.insert(u_i);
    }
}

//----------------------------------------------------------------------------------


function addEdgeImpl2(u_i, v_i, weight)
{
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    var edge_A = new Edge(v_i, weight);
    u.adjacent.insert(edge_A);

    if (!this.digraph)
    {
        var edge_B = new Edge(u_i, weight);
        v.adjacent.insert(edge_B);
    }
}

//----------------------------------------------------------------------------------


function printGraphImpl()
{
    document.write("<p>GRAPH {", this.label, "} ", this.digraph ? "" : " UN", "DIRECTED - ", this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");
    document.write("<p>", this.componentInfo(), "<p>");
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }
}

//----------------------------------------------------------------------------------


function topoSearchImpl(fun)
{
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        v.visit = false;
    }

    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        if (!v.visit)
        {
            (fun === "DFS" ? (this.connectedComp++, this.dfs(i)) : (this.bfs(i)));
        }
    }
    return this.connectedComp;
}

//----------------------------------------------------------------------------------


function DFS() //Use topoSearch() instead
{
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        v.visit = false;
    }

    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        if (!v.visit)
        {
            this.dfs(i);
        }
    }
}

//----------------------------------------------------------------------------------


function dfsImpl(v_i)
{
    var v = this.vert[v_i];
    v.visit = true;
    this.dfs_push[this.dfs_push.length] = v_i;

    var w = v.adjacentByID();
    var m = w.length;
    var i, v;
    for (i = 0; i < m; i++)
    {
        v = this.vert[w[i]];
        if (!v.visit)
        {
            this.dfs(w[i]);
        }
    }
}

//----------------------------------------------------------------------------------


function BFS() //Use topoSearch instead
{
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        v.visit = false;
    }

    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        if (!v.visit)
        {
            this.bfs(i);
        }
    }
}

//----------------------------------------------------------------------------------


function bfsImpl(v_i)
{
    var v = this.vert[v_i];

    v.visit = true;
    this.bfs_order[this.bfs_order.length] = v_i;
    var _q = new Queue();
    _q.enqueue(v);

    while (!_q.isEmpty())
    {

        var u = _q.dequeue();
        var w = u.adjacentByID();
        var m = w.length;

        var i, v;
        for (i = 0; i < m; i++)
        {
            v = this.vert[w[i]];
            if (!v.visit)
            {
                v.visit = true;
                _q.enqueue(v);
                this.bfs_order[this.bfs_order.length] = w[i];
            }
        }
    }
}

//----------------------------------------------------------------------------------


function makeAdjMatrixImpl()
{
    //obsolete - Use #makeAdjMatrixImpl2 instead
    for (var i = 0; i < this.nv; i++)
    {
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }
        var v = this.vert[i];
        var w = v.adjacent.traverse();;
        var m = w.length;
        var weight_ed = v.adjacent.traverse();
        for (var k = 0; k < m; k++)
        {
            this.weighted ? this.adjMatrix[i][w[k]] = weight_ed[k].weight : this.adjMatrix[i][w[k]] = 1;
        }
    }
}

//----------------------------------------------------------------------------------


function makeAdjMatrixImpl2()
{
    var i = 0;
    for (i = 0; i < this.nv; i++)
    {
        this.adjMatrix[i] = [];
        var j;
        for (j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        var v = this.vert[i];
        var w = v.adjacentByID();
        var WEdge = v.incidentEdge();
        var k;
        for (k = 0; k < w.length; k++)
        {
            if (this.weighted)
            {
                this.adjMatrix[i][w[k]] = WEdge[k].edgeWeight;
            }
            else
            {
                this.adjMatrix[i][w[k]] = 1;

            }
        }
    }
}

//----------------------------------------------------------------------------------

function isConnectedImpl()
{
    return (this.connectedComp === 1);
}

//----------------------------------------------------------------------------------


function componentInfoImpl()
{
    var connect;
    if (this.connectedComp === 1)
    {
        connect = "CONNECTED";
    }
    else if (this.connectedComp > 1)
    {
        connect = "DISCONNECTED  " + this.connectedComp;
    }
    else
    {
        connect = "no connectivity info";

    }
    return connect;
}

//----------------------------------------------------------------------------------


function adjacentByIdImpl()
{
    var adjacent_Id = [];
    var adjacent = this.adjacent.traverse();
    var i;
    for (i = 0; i < adjacent.length; i++)
    {
        adjacent_Id[i] = adjacent[i].target_v;
    }
    return adjacent_Id;
}

//----------------------------------------------------------------------------------


function incidentEdgeImpl()
{
    var edgeOPJ = [];
    var w = this.adjacent.traverse();
    var m = w.length;
    var i;
    for (i = 0; i < m; i++)
    {
        edgeOPJ[i] = {
            adjVert_i: w[i].target_v,
            edgeLabel: w[i].label,
            edgeWeight: w[i].weight,
            //edgeFlow: w[i].FLOW //new line added
        };
    }
    return edgeOPJ;
}

//----------------------------------------------------------------------------------


function vertexInfoImpl()
{
    return (" {" + this.label + "} - VISIT: " + this.visit +
        " - ADJACENCY: " + this.adjacentByID() + "<br>");
}

//----------------------------------------------------------------------------------


function insertAdjacentImpl(v_i, weight)
{
    var e = (weight != undefined) ? new Edge(v_i, weight) : new Edge(v_i);
    this.adjacent.insert(edge);
}

//----------------------------------------------------------------------------------


function list_vert() //Use vertexInfo printer method instead.
{
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
            " - ADJACENCY: ", v.adjacentByID(), "<br>");
    }
}

//----------------------------------------------------------------------------------


function better_input(v, e)
{
    this.nv = v.length;
    this.ne = e.length;

    var i;
    for (i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }

    var j;
    for (j = 0; j < this.ne; j++)
    {
        this.addEdge(e[j].u, e[j].v, e[j].w);
    }

    (!(e[0].w === undefined)) ? this.weighted = true: this.weighted = false;

    if (!this.digraph)
    {
        this.ne = this.ne * 2;
    }
}

//----------------------------------------------------------------------------------


function better_output() //Replaced by printGraphImpl
{
    document.write("<p>GRAPH {", this.label, "} ", (this.weighted ? " WEIGHTED" : " UNWEIGHTED"), ",", this.digraph ? "" : " UN", "DIRECTED - ", this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");

    document.write("<p>", this.componentInfo(), "<p>");
    this.list_vert();
}

//----------------------------------------------------------------------------------

// etc.