# Neural Network Architect

Interactive tool for designing and visualizing neural network architectures with drag-and-drop layer composition.

## Features

- 🎨 **Drag-and-Drop Interface**: Build neural networks by adding layers from a visual palette
- 🧠 **Multiple Layer Types**: Support for Dense, Conv2D, MaxPooling2D, Flatten, Dropout, and BatchNormalization layers
- 📊 **Dataset Integration**: Built-in support for popular datasets (MNIST, Fashion MNIST, CIFAR-10)
- 🚀 **Training Environment**: Train and evaluate models directly in the browser
- 📈 **Real-time Visualization**: View training progress with interactive charts
- ⚙️ **Configurable Parameters**: Adjust layer parameters, training epochs, and batch size

## Architecture

The application consists of two main components:

- **Frontend**: React-based web interface with drag-and-drop functionality
- **Backend**: Flask API with TensorFlow/Keras for model building and training

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (3.8 or higher)
- pip

### Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

```bash
cd backend
python app.py
```

The backend API will start on `http://localhost:5000`

**For development with debug mode:**
```bash
export FLASK_DEBUG=true  # On Unix/macOS
# OR
set FLASK_DEBUG=true     # On Windows
python app.py
```

### Start the Frontend Development Server

In a new terminal:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Build Your Network**:
   - Click on layer types in the left palette to add them to your network
   - Click the expand button (▶) on each layer to configure its parameters
   - Remove layers by clicking the ✕ button

2. **Select a Dataset**:
   - Choose from MNIST, Fashion MNIST, or CIFAR-10 in the training panel

3. **Build the Model**:
   - Click "Build Model" to compile your network architecture
   - The system will automatically add necessary layers for classification

4. **Train the Model**:
   - Configure the number of epochs and batch size
   - Click "Start Training" to begin the training process
   - Monitor training progress with real-time charts

5. **View Results**:
   - See training and validation accuracy/loss curves
   - Check test set performance metrics

## Available Layers

- **Dense**: Fully connected neural network layer
- **Conv2D**: 2D convolutional layer for image processing
- **MaxPooling2D**: Max pooling operation to reduce spatial dimensions
- **Flatten**: Converts multi-dimensional input to 1D
- **Dropout**: Regularization to prevent overfitting
- **BatchNormalization**: Normalizes layer inputs

## Technology Stack

- **Frontend**: React, React DnD, Chart.js, Axios
- **Backend**: Flask, TensorFlow/Keras, NumPy
- **Datasets**: Built-in TensorFlow Datasets (MNIST, Fashion MNIST, CIFAR-10)

## Project Structure

```
neuralnetarchitect/
├── backend/
│   └── app.py              # Flask API server
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── LayerPalette.js
│   │   ├── NetworkCanvas.js
│   │   ├── LayerCard.js
│   │   ├── TrainingPanel.js
│   │   └── TrainingChart.js
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Node.js dependencies
└── requirements.txt        # Python dependencies
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/layers` - Get available layer types
- `GET /api/datasets` - Get available datasets
- `POST /api/model/build` - Build model from configuration
- `POST /api/model/train` - Train the model
- `POST /api/model/evaluate` - Evaluate trained model

## License

MIT
