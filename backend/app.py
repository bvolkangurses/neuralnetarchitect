from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)

# Store for trained models (in-memory for simplicity)
models = {}

# Available layer types
LAYER_TYPES = {
    'Dense': layers.Dense,
    'Conv2D': layers.Conv2D,
    'MaxPooling2D': layers.MaxPooling2D,
    'Flatten': layers.Flatten,
    'Dropout': layers.Dropout,
    'BatchNormalization': layers.BatchNormalization,
}

# Available datasets
DATASETS = {
    'mnist': keras.datasets.mnist,
    'fashion_mnist': keras.datasets.fashion_mnist,
    'cifar10': keras.datasets.cifar10,
}

def build_model_from_config(config):
    """Build a Keras model from configuration"""
    model = keras.Sequential()
    
    for i, layer_config in enumerate(config['layers']):
        layer_type = layer_config['type']
        params = layer_config.get('params', {})
        
        if layer_type not in LAYER_TYPES:
            raise ValueError(f"Unknown layer type: {layer_type}")
        
        # Add input_shape to first layer if provided
        if i == 0 and 'input_shape' in config:
            params['input_shape'] = tuple(config['input_shape'])
        
        # Create layer based on type
        layer_class = LAYER_TYPES[layer_type]
        
        # Handle different layer parameters
        if layer_type == 'Dense':
            units = params.get('units', 128)
            activation = params.get('activation', 'relu')
            if 'input_shape' in params:
                model.add(layer_class(units, activation=activation, input_shape=params['input_shape']))
            else:
                model.add(layer_class(units, activation=activation))
                
        elif layer_type == 'Conv2D':
            filters = params.get('filters', 32)
            kernel_size = params.get('kernel_size', 3)
            activation = params.get('activation', 'relu')
            if 'input_shape' in params:
                model.add(layer_class(filters, kernel_size, activation=activation, input_shape=params['input_shape']))
            else:
                model.add(layer_class(filters, kernel_size, activation=activation))
                
        elif layer_type == 'MaxPooling2D':
            pool_size = params.get('pool_size', 2)
            model.add(layer_class(pool_size))
            
        elif layer_type == 'Dropout':
            rate = params.get('rate', 0.5)
            model.add(layer_class(rate))
            
        elif layer_type == 'Flatten':
            model.add(layer_class())
            
        elif layer_type == 'BatchNormalization':
            model.add(layer_class())
    
    return model

def load_dataset(dataset_name):
    """Load and preprocess dataset"""
    if dataset_name not in DATASETS:
        raise ValueError(f"Unknown dataset: {dataset_name}")
    
    dataset = DATASETS[dataset_name]
    (x_train, y_train), (x_test, y_test) = dataset.load_data()
    
    # Normalize pixel values
    x_train = x_train.astype('float32') / 255.0
    x_test = x_test.astype('float32') / 255.0
    
    # Add channel dimension for grayscale images if needed
    if dataset_name in ['mnist', 'fashion_mnist']:
        x_train = np.expand_dims(x_train, -1)
        x_test = np.expand_dims(x_test, -1)
    
    return (x_train, y_train), (x_test, y_test)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Neural Network Architect API is running'})

@app.route('/api/layers', methods=['GET'])
def get_layers():
    """Get available layer types"""
    layers_info = {
        'Dense': {'params': ['units', 'activation']},
        'Conv2D': {'params': ['filters', 'kernel_size', 'activation']},
        'MaxPooling2D': {'params': ['pool_size']},
        'Flatten': {'params': []},
        'Dropout': {'params': ['rate']},
        'BatchNormalization': {'params': []},
    }
    return jsonify(layers_info)

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """Get available datasets"""
    datasets_info = {
        'mnist': {
            'name': 'MNIST',
            'description': 'Handwritten digits (28x28 grayscale)',
            'input_shape': [28, 28, 1],
            'num_classes': 10
        },
        'fashion_mnist': {
            'name': 'Fashion MNIST',
            'description': 'Fashion items (28x28 grayscale)',
            'input_shape': [28, 28, 1],
            'num_classes': 10
        },
        'cifar10': {
            'name': 'CIFAR-10',
            'description': 'Objects (32x32 color)',
            'input_shape': [32, 32, 3],
            'num_classes': 10
        }
    }
    return jsonify(datasets_info)

@app.route('/api/model/build', methods=['POST'])
def build_model():
    """Build a model from configuration"""
    try:
        config = request.json
        model = build_model_from_config(config)
        
        # Compile model
        optimizer = config.get('optimizer', 'adam')
        loss = config.get('loss', 'sparse_categorical_crossentropy')
        
        model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=['accuracy']
        )
        
        # Store model
        model_id = config.get('model_id', 'default')
        models[model_id] = model
        
        # Get model summary
        summary_list = []
        model.summary(print_fn=lambda x: summary_list.append(x))
        
        return jsonify({
            'success': True,
            'model_id': model_id,
            'summary': '\n'.join(summary_list),
            'total_params': model.count_params()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/model/train', methods=['POST'])
def train_model():
    """Train a model"""
    try:
        data = request.json
        model_id = data.get('model_id', 'default')
        dataset_name = data.get('dataset')
        epochs = data.get('epochs', 5)
        batch_size = data.get('batch_size', 32)
        
        if model_id not in models:
            return jsonify({'success': False, 'error': 'Model not found'}), 404
        
        model = models[model_id]
        
        # Load dataset
        (x_train, y_train), (x_test, y_test) = load_dataset(dataset_name)
        
        # Train model
        history = model.fit(
            x_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=0
        )
        
        # Evaluate on test set
        test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
        
        return jsonify({
            'success': True,
            'history': {
                'loss': [float(x) for x in history.history['loss']],
                'accuracy': [float(x) for x in history.history['accuracy']],
                'val_loss': [float(x) for x in history.history['val_loss']],
                'val_accuracy': [float(x) for x in history.history['val_accuracy']]
            },
            'test_results': {
                'loss': float(test_loss),
                'accuracy': float(test_accuracy)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/model/evaluate', methods=['POST'])
def evaluate_model():
    """Evaluate a trained model"""
    try:
        data = request.json
        model_id = data.get('model_id', 'default')
        dataset_name = data.get('dataset')
        
        if model_id not in models:
            return jsonify({'success': False, 'error': 'Model not found'}), 404
        
        model = models[model_id]
        
        # Load test dataset
        (_, _), (x_test, y_test) = load_dataset(dataset_name)
        
        # Evaluate
        test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
        
        # Get predictions for confusion matrix
        predictions = model.predict(x_test[:1000], verbose=0)  # Limit to 1000 samples
        predicted_classes = np.argmax(predictions, axis=1)
        true_classes = y_test[:1000]
        
        return jsonify({
            'success': True,
            'test_loss': float(test_loss),
            'test_accuracy': float(test_accuracy),
            'predictions': predicted_classes.tolist()[:100],  # Send first 100 predictions
            'true_labels': true_classes.tolist()[:100]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    import os
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, port=5000)
