import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import LayerPalette from './components/LayerPalette';
import NetworkCanvas from './components/NetworkCanvas';
import TrainingPanel from './components/TrainingPanel';

function App() {
  const [layers, setLayers] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('mnist');
  const [modelBuilt, setModelBuilt] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState(null);

  const addLayer = (layerType, params) => {
    const newLayer = {
      id: Date.now(),
      type: layerType,
      params: params || {}
    };
    setLayers([...layers, newLayer]);
    setModelBuilt(false);
  };

  const removeLayer = (id) => {
    setLayers(layers.filter(layer => layer.id !== id));
    setModelBuilt(false);
  };

  const updateLayerParams = (id, params) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, params: { ...layer.params, ...params } } : layer
    ));
    setModelBuilt(false);
  };

  const clearNetwork = () => {
    setLayers([]);
    setModelBuilt(false);
    setTrainingHistory(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header className="App-header">
          <h1>Neural Network Architect</h1>
          <p>Design, build, and train neural networks with drag and drop</p>
        </header>
        
        <div className="App-content">
          <div className="left-panel">
            <LayerPalette onAddLayer={addLayer} />
          </div>
          
          <div className="main-panel">
            <NetworkCanvas 
              layers={layers}
              onRemoveLayer={removeLayer}
              onUpdateParams={updateLayerParams}
              onClearNetwork={clearNetwork}
            />
          </div>
          
          <div className="right-panel">
            <TrainingPanel 
              layers={layers}
              selectedDataset={selectedDataset}
              onDatasetChange={setSelectedDataset}
              modelBuilt={modelBuilt}
              onModelBuilt={setModelBuilt}
              trainingHistory={trainingHistory}
              onTrainingComplete={setTrainingHistory}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
