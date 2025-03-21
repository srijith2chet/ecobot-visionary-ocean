
# EcoBot AI Model Integration Guide

This guide explains how to integrate your YOLO model with the EcoBot web application.

## Model Files Structure

Based on your file structure:

```
OCEAN PLASTIC DETECTION
├── .ipynb_checkpoints
├── darknet
├── data
│   ├── training
│   ├── obj.data
│   ├── obj.names
│   ├── ocean_plsatic.png
│   ├── vcpkg.json
│   ├── vid.mp4
│   ├── video_yolov3.sh
│   ├── video_yolov4.sh
│   └── yolo-training.ipynb
```

## Integration Steps

### 1. Model Files Preparation

First, you need to convert your YOLO model to a web-friendly format:

#### Option A: TensorFlow.js Conversion
Convert your YOLOv4 model to TensorFlow.js format:

```bash
# Install tensorflowjs
pip install tensorflowjs

# Convert your model
tensorflowjs_converter --input_format=keras \
                      /path/to/keras/model.h5 \
                      /path/to/output/folder
```

#### Option B: ONNX Format
Convert your YOLOv4 model to ONNX format:

```bash
# Install onnx and tf2onnx
pip install onnx tf2onnx

# Convert your model
python -m tf2onnx.convert --saved-model /path/to/saved_model --output model.onnx
```

### 2. Place Model Files

Create a model directory in the public folder:

```
public/
└── model/
    └── yolov4/
        ├── model.json (or model.onnx)
        ├── weights.bin (if using TensorFlow.js)
        ├── obj.names (copy from your data folder)
        └── config.json (create this with model configuration)
```

Copy your `obj.names` file from the `data` folder to provide class names.

### 3. Create Model Configuration

Create a `config.json` file with model configuration:

```json
{
  "modelType": "yolov4",
  "inputSize": 416,
  "classes": ["bottle", "fishing_net", "microplastic", "general"],
  "anchors": [your model's anchors],
  "scoreThreshold": 0.5,
  "iouThreshold": 0.45
}
```

### 4. Update Detection Service

Modify the `detectPlastics` function in `src/services/detectionService.ts` to use your actual model:

```typescript
import * as tf from '@tensorflow/tfjs';

let model: tf.GraphModel | null = null;
let classNames: string[] = [];

export const initializeModel = async () => {
  if (model) return model;
  
  try {
    // Load model
    model = await tf.loadGraphModel('/model/yolov4/model.json');
    
    // Load class names
    const response = await fetch('/model/yolov4/obj.names');
    const names = await response.text();
    classNames = names.split('\n').filter(name => name.trim() !== '');
    
    console.log('Model initialized with classes:', classNames);
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
};

export const detectPlastics = async (file: File): Promise<DetectionResult[]> => {
  try {
    // Initialize model if not already loaded
    if (!model) {
      await initializeModel();
    }
    
    // Load image
    const img = await loadImage(file);
    
    // Preprocess image for model
    const tensor = preprocessImage(img);
    
    // Run inference
    const predictions = await model!.predict(tensor) as tf.Tensor;
    
    // Process predictions to get detection boxes
    const results = await postprocessPredictions(predictions);
    
    // Clean up tensors
    tf.dispose([tensor, predictions]);
    
    return results;
  } catch (error) {
    console.error('Detection error:', error);
    throw error;
  }
};

// Helper functions for image processing and prediction handling
// ...
```

### 5. Testing

Test your model integration with different images to ensure it's working correctly. Check the browser console for any errors or warnings.

## Additional Resources

- YOLOv4 Paper: https://arxiv.org/abs/2004.10934
- TensorFlow.js Documentation: https://www.tensorflow.org/js
- ONNX Runtime Web: https://github.com/microsoft/onnxruntime/tree/master/js/web

For more help with model conversion and integration, feel free to reach out to the EcoBot team.
