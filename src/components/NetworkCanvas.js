import React from 'react';
import './NetworkCanvas.css';
import LayerCard from './LayerCard';

function NetworkCanvas({ layers, onRemoveLayer, onUpdateParams, onClearNetwork }) {
  const getLayerColor = (type) => {
    const colors = {
      'Dense': '#4299e1',
      'Conv2D': '#48bb78',
      'MaxPooling2D': '#ed8936',
      'Flatten': '#9f7aea',
      'Dropout': '#f56565',
      'BatchNormalization': '#38b2ac'
    };
    return colors[type] || '#718096';
  };

  return (
    <div className="network-canvas">
      <div className="canvas-header">
        <h2>Network Architecture</h2>
        <div className="canvas-actions">
          <span className="layer-count">{layers.length} layers</span>
          {layers.length > 0 && (
            <button className="clear-button" onClick={onClearNetwork}>
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="canvas-content">
        {layers.length === 0 ? (
          <div className="empty-canvas">
            <div className="empty-icon">🧠</div>
            <h3>No layers yet</h3>
            <p>Add layers from the palette on the left to start building your neural network</p>
          </div>
        ) : (
          <div className="layers-container">
            <div className="input-node">
              <div className="node-label">Input</div>
            </div>
            
            {layers.map((layer, index) => (
              <React.Fragment key={layer.id}>
                <div className="connection-line" />
                <LayerCard
                  layer={layer}
                  index={index}
                  color={getLayerColor(layer.type)}
                  onRemove={onRemoveLayer}
                  onUpdateParams={onUpdateParams}
                />
              </React.Fragment>
            ))}
            
            <div className="connection-line" />
            <div className="output-node">
              <div className="node-label">Output</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NetworkCanvas;
