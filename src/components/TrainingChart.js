import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './TrainingChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrainingChart({ history }) {
  if (!history) return null;

  const epochs = history.loss.map((_, index) => index + 1);

  const accuracyData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Accuracy',
        data: history.accuracy,
        borderColor: 'rgb(72, 187, 120)',
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
        tension: 0.4
      },
      {
        label: 'Validation Accuracy',
        data: history.val_accuracy,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }
    ]
  };

  const lossData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Loss',
        data: history.loss,
        borderColor: 'rgb(245, 101, 101)',
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
        tension: 0.4
      },
      {
        label: 'Validation Loss',
        data: history.val_loss,
        borderColor: 'rgb(237, 137, 54)',
        backgroundColor: 'rgba(237, 137, 54, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="training-chart">
      <div className="chart-container">
        <h4>Accuracy</h4>
        <Line data={accuracyData} options={options} />
      </div>
      
      <div className="chart-container">
        <h4>Loss</h4>
        <Line data={lossData} options={options} />
      </div>
    </div>
  );
}

export default TrainingChart;
