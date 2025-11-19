import React, { useState } from 'react';
import './LayerCard.css';

function LayerCard({ layer, index, color, onRemove, onUpdateParams }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderParamInput = (paramName, currentValue) => {
    const handleChange = (e) => {
      const value = e.target.value;
      // Convert to number if it's a numeric parameter
      const numericParams = ['units', 'filters', 'kernel_size', 'pool_size'];
      const floatParams = ['rate'];
      
      let finalValue = value;
      if (numericParams.includes(paramName)) {
        finalValue = parseInt(value) || 0;
      } else if (floatParams.includes(paramName)) {
        finalValue = parseFloat(value) || 0;
      }
      
      onUpdateParams(layer.id, { [paramName]: finalValue });
    };

    if (paramName === 'activation') {
      return (
        <select value={currentValue} onChange={handleChange} className="param-select">
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
          <option value="softmax">Softmax</option>
          <option value="linear">Linear</option>
        </select>
      );
    }

    return (
      <input
        type="number"
        value={currentValue}
        onChange={handleChange}
        className="param-input"
        step={paramName === 'rate' ? 0.1 : 1}
        min={0}
        max={paramName === 'rate' ? 1 : undefined}
      />
    );
  };

  const getParamLabel = (paramName) => {
    const labels = {
      units: 'Units',
      filters: 'Filters',
      kernel_size: 'Kernel Size',
      pool_size: 'Pool Size',
      rate: 'Dropout Rate',
      activation: 'Activation'
    };
    return labels[paramName] || paramName;
  };

  return (
    <div className="layer-card" style={{ borderLeftColor: color }}>
      <div className="layer-card-header">
        <div className="layer-info">
          <span className="layer-number">#{index + 1}</span>
          <span className="layer-type">{layer.type}</span>
        </div>
        <div className="layer-actions">
          <button
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            className="remove-button"
            onClick={() => onRemove(layer.id)}
            title="Remove layer"
          >
            ✕
          </button>
        </div>
      </div>
      
      {isExpanded && Object.keys(layer.params).length > 0 && (
        <div className="layer-params">
          {Object.entries(layer.params).map(([paramName, paramValue]) => (
            <div key={paramName} className="param-row">
              <label className="param-label">{getParamLabel(paramName)}:</label>
              {renderParamInput(paramName, paramValue)}
            </div>
          ))}
        </div>
      )}
      
      {isExpanded && Object.keys(layer.params).length === 0 && (
        <div className="layer-params">
          <p className="no-params">No configurable parameters</p>
        </div>
      )}
    </div>
  );
}

export default LayerCard;
