/*
<canvas id="chart" width="200" height="70"></canvas>
  <div>
    <button id="add">Add</button>
    <button id="remove">Remove</button>
    <input type="text" id="name">
  </div>
*/

window.onload = () => {
  const ctx = document.getElementById('chart').getContext('2d');
  const chartConfig = {
    type: 'line',
    data: {
      labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7', 'Task 8', 'Task 9', 'Task 10'],
      datasets: [], // массив объектов user
    },
    options: {
      title: {
        display: true,
        text: 'Comparison of results',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  };

  const chart = new Chart(ctx, chartConfig);
  const colorSet = new Set(); // Содержит только уникальные эл-ты

  const generateRandomName = () => {
    const length = Math.floor(Math.random() * (8 - 4)) + 4; // 4-7
    let name = '';

    for (let i = 0; i < length; i += 1) {
      name += String.fromCharCode(Math.floor(Math.random() * (122 - 97)) + 97); // 97-121
    }
    return name;
  };

  const generateRandomTime = () => Math.floor(Math.random() * 200);

  const generateRandomColor = () => {
    let color = '#';

    for (let i = 0; i < 3; i += 1) {
      const colorComponent = Math.floor(Math.random() * 255);
      color += colorComponent.toString(16);
    }
    return color;
  };

  const addUserToChart = (config, setName) => {
    const name = setName || generateRandomName();
    const data = Array(10).fill(0).map(() => generateRandomTime());
    let color;

    do {
      color = generateRandomColor();
    } while (colorSet.has(color));

    colorSet.add(color);

    const newUser = {
      label: name,
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      fill: false,
    };

    config.data.datasets.push(newUser);
    chart.update();
  };

  const removeUserFromChart = ({ data: { datasets } }, name) => {
    if (name) {
      if (!datasets.includes(name)) return;
      datasets.splice(datasets.indexOf(name), 1);
    } else {
      datasets.pop(); // иначе выкинуть последнее из списка
    }

    chart.update();
  };

  document.querySelector('#add').addEventListener('click', () => {
    const name = document.querySelector('#name').value || null;
    addUserToChart(chartConfig, name);
  });

  document.querySelector('#remove').addEventListener('click', () => {
    const name = document.querySelector('#name').value || null;
    removeUserFromChart(chartConfig, name);
  });

  addUserToChart(chartConfig, 'V1ctoR');
};
