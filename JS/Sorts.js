// ============== Хоара(Быстрая).(n * log(N)) ==========
function quickSortC(arr, startP, endP) {
  let start = startP;
  let end = endP;
  // Не Math.floor(arr.length / 2), т.к. массив изначальный (по ссылке)
  const middle = arr[Math.floor((startP + endP) / 2)];

  do {
    while (arr[start] < middle) start++;
    while (arr[end] > middle) end--;
    if (start <= end) {
      const temp = arr[start];
      arr[start] = arr[end];
      arr[end] = temp;
      start++;
      end--;
    }
  } while (start <= end);

  if (startP < end) quickSortC(arr, startP, end);
  if (endP > start) quickSortC(arr, start, endP);
}

// Из quickSort() всегда будет возвращен самый маленький эл-т, кот.
// будет объединен с чуть большим el.
function quickSort(arr) {
  if (arr.length < 2) return arr;
  const left = [];
  const right = [];
  const el = arr[0]; // опорный эл. всегда 1-ый эл.массива

  for (let i = 1; i < arr.length; i++) {
    el > arr[i] ? left.push(arr[i]) : right.push(arr[i]);
  }
  return quickSort(left).concat(el, quickSort(right));
}

// ========================Простым линейным выбором============================
function lineSelectExchange(arr) {
  for (let i = 0; i < arr.length; i++) {
    let posMinEl = i;
    let minEl = arr[i];

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < minEl) {
        minEl = arr[j];
        posMinEl = j;
      }
    }
    arr[posMinEl] = arr[i];
    arr[i] = minEl;
  }
}

// Сортировка пузырьком сложность: O(N^2)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

// =============== Вставками (сложность: O(N^2)) =============================
function insertionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    let j = i;
    while (j >= 0 && arr[j - 1] > current) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = current;
  }
  return arr;
}

// =============== Шелла(сложность: O((n * log(n))^2) ================================
function shellSort(arr) {
  let incr = Math.floor(arr.length / 2);

  while (incr > 0) {
    // Insertion sort; Когда incr === 1 происходит обыкн. insertionSort
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      let j = i;
      while (j >= incr && arr[j - incr] > current) {
        arr[j] = arr[j - incr];
        j -= incr;
      }
      arr[j] = current;
    }
    incr = incr === 2 ? 1 : Math.floor(incr * (5 / 11));
  }
  return arr;
}

// ============== Merge sort(слиянием)(сложность: n * log(n)) =================
function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    left[0] < right[0] ? result.push(left.shift()) : result.push(right.shift());
  }
  return result.concat(left, right);
}

function mergeSort(arr) {
  if (arr.length < 2) return arr;
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle); // не включая middle
  const right = arr.slice(middle); // от middle и до конца
  return merge(mergeSort(left), mergeSort(right));
}

let myArr = [3, 5, 7, 20, 6, 999, 21, 17, 4, 10, 23, 2, 5, 15, 1];
// quickSortC(myArr, 0, myArr.length - 1);
// myArr = quickSort(myArr);
// lineSelectExchange(myArr);
// insertionSort(myArr);
// shellSort(myArr);
myArr = mergeSort(myArr);
console.log(myArr);
