import React from 'react';
import './LayerPalette.css';

const LAYER_TEMPLATES = [
  {
    type: 'Dense',
    icon: '◉',
    color: '#4299e1',
    defaultParams: { units: 128, activation: 'relu' }
  },
  {
    type: 'Conv2D',
    icon: '▦',
    color: '#48bb78',
    defaultParams: { filters: 32, kernel_size: 3, activation: 'relu' }
  },
  {
    type: 'MaxPooling2D',
    icon: '▼',
    color: '#ed8936',
    defaultParams: { pool_size: 2 }
  },
  {
    type: 'Flatten',
    icon: '▬',
    color: '#9f7aea',
    defaultParams: {}
  },
  {
    type: 'Dropout',
    icon: '✕',
    color: '#f56565',
    defaultParams: { rate: 0.5 }
  },
  {
    type: 'BatchNormalization',
    icon: '≈',
    color: '#38b2ac',
    defaultParams: {}
  }
];

function LayerPalette({ onAddLayer }) {
  const handleAddLayer = (template) => {
    onAddLayer(template.type, template.defaultParams);
  };

  return (
    <div className="layer-palette">
      <h2>Layer Palette</h2>
      <p className="palette-description">Click to add layers to your network</p>
      
      <div className="layer-list">
        {LAYER_TEMPLATES.map((template) => (
          <button
            key={template.type}
            className="layer-button"
            onClick={() => handleAddLayer(template)}
            style={{ borderColor: template.color }}
          >
            <span className="layer-icon" style={{ color: template.color }}>
              {template.icon}
            </span>
            <span className="layer-name">{template.type}</span>
          </button>
        ))}
      </div>
      
      <div className="palette-info">
        <h3>Quick Guide</h3>
        <ul>
          <li><strong>Dense:</strong> Fully connected layer</li>
          <li><strong>Conv2D:</strong> 2D convolution layer</li>
          <li><strong>MaxPooling2D:</strong> Max pooling operation</li>
          <li><strong>Flatten:</strong> Flattens the input</li>
          <li><strong>Dropout:</strong> Regularization layer</li>
          <li><strong>BatchNorm:</strong> Batch normalization</li>
        </ul>
      </div>
    </div>
  );
}

export default LayerPalette;
