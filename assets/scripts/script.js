// Define the data for the chart
const data = {
  labels: ["HTML", "CSS", "Bootstrap", "JavaScript", "VBA"],
  datasets: [
    {
      label: "Language used (%)",
      data: [40, 20, 5, 7, 35,0],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)"
      ],
      borderWidth: 1
    }
  ]
};

// Get the chart canvas element
const ctx = document.getElementById("my-chart").getContext("2d");

// Create the chart using Chart.js
const myChart = new Chart(ctx, {
  type: "bar",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: true,
  }
});
