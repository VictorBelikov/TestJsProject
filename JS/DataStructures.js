// ================================== Односвязный список ======================
function Node(data) {
  this.data = data;
  this.next = null;
}

function SinglyLinkedList() {
  this.head = null;
  this.tail = null;
  this.numOfValues = 0;
}

SinglyLinkedList.prototype.length = function() {
  return this.numOfValues;
};

SinglyLinkedList.prototype.add = function(data) {
  const node = new Node(data);
  if (!this.head) {
    this.head = node;
    this.tail = node;
  } else {
    this.tail.next = node;
    this.tail = this.tail.next;
  }
  this.numOfValues++;
};

SinglyLinkedList.prototype.remove = function(data) {
  let current = this.head;
  let previous = this.head;

  while (current) {
    if (current.data === data) {
      if (this.head.data === data) this.head = current.next; // Если искомый - голова
      if (this.tail.data === data) this.tail = previous; // Если искомый - хвост
      previous.next = current.next;
      this.numOfValues--;
    }
    previous = current;
    current = current.next;
  }
};

// const list = new SinglyLinkedList();
// list.add(1);
// list.add(2);
// list.add(3);
// console.log(list.length());
// list.remove(2);
// console.log(list.length());

// ================================== Stack ===================================
function Stack() {
  this.stack = [];
}

Stack.prototype.push = function(val) {
  this.stack.push(val);
};
Stack.prototype.pop = function() {
  return this.stack.pop();
};
Stack.prototype.peek = function() {
  return this.stack[this.stack.length - 1];
};

// ================================== Queue ===================================
function Queue() {
  this.queue = [];
}

Queue.prototype.enqueue = function(val) {
  this.queue.push(val);
};
Queue.prototype.dequeue = function() {
  return this.queue.shift();
};
Queue.prototype.peek = function() {
  return this.queue[0];
};
