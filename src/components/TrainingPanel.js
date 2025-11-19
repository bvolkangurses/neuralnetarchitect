import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainingPanel.css';
import TrainingChart from './TrainingChart';

const API_BASE_URL = 'http://localhost:5000/api';

function TrainingPanel({ 
  layers, 
  selectedDataset, 
  onDatasetChange, 
  modelBuilt,
  onModelBuilt,
  trainingHistory,
  onTrainingComplete 
}) {
  const [datasets, setDatasets] = useState({});
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [buildError, setBuildError] = useState(null);
  const [trainingError, setTrainingError] = useState(null);
  const [modelSummary, setModelSummary] = useState(null);
  const [epochs, setEpochs] = useState(5);
  const [batchSize, setBatchSize] = useState(32);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const buildModel = async () => {
    if (layers.length === 0) {
      setBuildError('Please add at least one layer to the network');
      return;
    }

    setIsBuilding(true);
    setBuildError(null);
    setModelSummary(null);

    try {
      // Get input shape from selected dataset
      const inputShape = datasets[selectedDataset]?.input_shape || [28, 28, 1];
      const numClasses = datasets[selectedDataset]?.num_classes || 10;

      // Build layer configuration
      const layerConfig = layers.map(layer => ({
        type: layer.type,
        params: { ...layer.params }
      }));

      // Add final Dense layer for classification if not present
      const lastLayer = layerConfig[layerConfig.length - 1];
      if (lastLayer?.type !== 'Dense' || lastLayer?.params?.units !== numClasses) {
        // Make sure we have Flatten before final Dense
        if (layerConfig.length === 0 || layerConfig[layerConfig.length - 1].type !== 'Flatten') {
          layerConfig.push({ type: 'Flatten', params: {} });
        }
        layerConfig.push({
          type: 'Dense',
          params: { units: numClasses, activation: 'softmax' }
        });
      }

      const config = {
        model_id: 'default',
        layers: layerConfig,
        input_shape: inputShape,
        optimizer: 'adam',
        loss: 'sparse_categorical_crossentropy'
      };

      const response = await axios.post(`${API_BASE_URL}/model/build`, config);
      
      if (response.data.success) {
        setModelSummary(response.data);
        onModelBuilt(true);
      } else {
        setBuildError(response.data.error || 'Failed to build model');
      }
    } catch (error) {
      setBuildError(error.response?.data?.error || error.message);
    } finally {
      setIsBuilding(false);
    }
  };

  const trainModel = async () => {
    setIsTraining(true);
    setTrainingError(null);
    onTrainingComplete(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/model/train`, {
        model_id: 'default',
        dataset: selectedDataset,
        epochs: epochs,
        batch_size: batchSize
      });

      if (response.data.success) {
        onTrainingComplete(response.data);
      } else {
        setTrainingError(response.data.error || 'Training failed');
      }
    } catch (error) {
      setTrainingError(error.response?.data?.error || error.message);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="training-panel">
      <h2>Training Environment</h2>
      
      <div className="panel-section">
        <h3>Dataset Selection</h3>
        <select 
          value={selectedDataset} 
          onChange={(e) => onDatasetChange(e.target.value)}
          className="dataset-select"
          disabled={modelBuilt}
        >
          {Object.entries(datasets).map(([key, dataset]) => (
            <option key={key} value={key}>
              {dataset.name} - {dataset.description}
            </option>
          ))}
        </select>
        {datasets[selectedDataset] && (
          <div className="dataset-info">
            <p>Input Shape: {datasets[selectedDataset].input_shape.join(' × ')}</p>
            <p>Classes: {datasets[selectedDataset].num_classes}</p>
          </div>
        )}
      </div>

      <div className="panel-section">
        <h3>Model Building</h3>
        <button 
          className="build-button"
          onClick={buildModel}
          disabled={isBuilding || layers.length === 0}
        >
          {isBuilding ? 'Building...' : 'Build Model'}
        </button>
        
        {buildError && <div className="error-message">{buildError}</div>}
        
        {modelSummary && (
          <div className="success-message">
            ✓ Model built successfully!
            <div className="model-info">
              Total parameters: {modelSummary.total_params.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {modelBuilt && (
        <div className="panel-section">
          <h3>Training Configuration</h3>
          
          <div className="config-row">
            <label>Epochs:</label>
            <input
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value) || 1)}
              min="1"
              max="50"
              disabled={isTraining}
            />
          </div>
          
          <div className="config-row">
            <label>Batch Size:</label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 32)}
              min="1"
              max="256"
              disabled={isTraining}
            />
          </div>

          <button 
            className="train-button"
            onClick={trainModel}
            disabled={isTraining}
          >
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
          
          {trainingError && <div className="error-message">{trainingError}</div>}
        </div>
      )}

      {trainingHistory && (
        <div className="panel-section">
          <h3>Training Results</h3>
          <TrainingChart history={trainingHistory.history} />
          
          <div className="test-results">
            <h4>Test Set Performance</h4>
            <div className="metric">
              <span>Accuracy:</span>
              <span className="metric-value">
                {(trainingHistory.test_results.accuracy * 100).toFixed(2)}%
              </span>
            </div>
            <div className="metric">
              <span>Loss:</span>
              <span className="metric-value">
                {trainingHistory.test_results.loss.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingPanel;
