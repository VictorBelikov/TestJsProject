//  Бинарное дерево: поиск/вставка/удаление/доступ имеют сложность O(log(n)).
function Node(data) {
  this.data = data;
  this.left = null;
  this.right = null;
}

function BinaryTree() {
  this.root = null;
}

BinaryTree.prototype.add = function (data) {
  const node = new Node(data);
  if (!this.root) {
    this.root = node;
  } else {
    let current = this.root;
    while (current) {
      if (current.data < data) {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      } else if (current.data > data) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        break; // Если такой эл-т уже есть в дереве
      }
    }
  }
  return this;
};

BinaryTree.prototype.search = function (data) {
  let current = this.root;
  while (current) {
    if (current.data === data) return true;
    if (current.data < data) current = current.right;
    else current = current.left;
  }
  return false;
};

function getMin(node) {
  while (node.left) node = node.left;
  return node.data;
}

function removeNode(node, data) {
  if (!node) return null;
  if (data === node.data) {
    if (!node.left && !node.right) return null; // Если не имеет потомков, заменяем его null
    if (!node.left) return node.right; // Если не имеет только левого потомка, заменяем его правым
    if (!node.right) return node.left; // Если не имеет только правого потомка, заменяем его левым

    // Если имеет обоих потомков, то замен. наименьшим узлом в правом поддереве у кот. left === null
    const temp = getMin(node.right);
    node.data = temp; // Данными минимального эл-та заменили данные текущего узла
    node.right = removeNode(node.right, temp); // Теперь нужно удалить этот миним. эл-т
    return node; // Возвр.текущий узел
  }
  if (data < node.data) {
    node.left = removeNode(node.left, data);
    return node; // Возвр.текущий узел
  }
  node.right = removeNode(node.right, data);
  return node; // Возвр.текущий узел
}

BinaryTree.prototype.remove = function (data) {
  removeNode(this.root, data);
};

const bt = new BinaryTree();
bt
  .add(5)
  .add(2)
  .add(18)
  .add(-4)
  .add(3)
  .add(18)
  .add(21)
  .add(25)
  .add(19)
  .add(16)
  .add(20);
console.log(bt.search(18)); // true
bt.remove(18);
console.log(bt.search(18)); // false
console.log(bt);

// Если нужно удалить узел, имеющий только одного потомка, то он просто удаляется
// и замещается следующим.
// Если нужно удалить узел, имеющий двух потомков то удаляемый узел заменяется:
// - наибольшим узлом в левом поддереве (у которого right === null)
// - наименьшим узлом в правом поддереве (у которого left === null)
