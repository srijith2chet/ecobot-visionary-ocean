
import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Filter, Download, Maximize2, Info } from 'lucide-react';

interface ResultsDisplayProps {
  results: DetectionResult[];
  imageUrl: string;
  onReset: () => void;
}

const plasticTypeColors = {
  'bottle': '#FF6B6B',
  'fishing_net': '#FFD166',
  'microplastic': '#06D6A0',
  'general': '#118AB2',
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, imageUrl, onReset }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredResult, setHoveredResult] = useState<DetectionResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!results.length || !imageUrl) return;
    
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      drawDetectionBoxes();
    };

    // Set image to imageRef
    if (imageRef.current) {
      imageRef.current.src = imageUrl;
    }
  }, [results, imageUrl, selectedType]);

  const drawDetectionBoxes = () => {
    if (!containerRef.current || !canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match canvas size to image display size
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate image scale
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    
    // Calculate scale factors and offset to position the boxes correctly
    const displayedImgWidth = imageRef.current.clientWidth;
    const displayedImgHeight = imageRef.current.clientHeight;
    
    const offsetX = (containerWidth - displayedImgWidth) / 2;
    const offsetY = (containerHeight - displayedImgHeight) / 2;
    
    const scaleX = displayedImgWidth / imageWidth;
    const scaleY = displayedImgHeight / imageHeight;
    
    // Draw each detection box
    results.forEach(result => {
      if (selectedType && result.class !== selectedType) return;
      
      const { x, y, width, height, class: plasticType, confidence } = result;
      
      // Scale box to displayed image size
      const boxX = x * scaleX + offsetX;
      const boxY = y * scaleY + offsetY;
      const boxWidth = width * scaleX;
      const boxHeight = height * scaleY;
      
      // Draw box
      ctx.beginPath();
      ctx.rect(boxX, boxY, boxWidth, boxHeight);
      ctx.lineWidth = 2;
      ctx.strokeStyle = plasticTypeColors[plasticType as keyof typeof plasticTypeColors] || '#ffffff';
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = plasticTypeColors[plasticType as keyof typeof plasticTypeColors] || '#ffffff';
      ctx.font = '12px Inter, sans-serif';
      const label = `${plasticType} (${Math.round(confidence * 100)}%)`;
      const labelWidth = ctx.measureText(label).width + 8;
      
      ctx.fillRect(
        boxX,
        boxY - 20,
        labelWidth,
        20
      );
      
      ctx.fillStyle = '#000000';
      ctx.fillText(
        label,
        boxX + 4,
        boxY - 7
      );
    });
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const downloadResults = () => {
    const element = document.createElement('a');
    const resultsData = JSON.stringify({
      timestamp: new Date().toISOString(),
      detections: results,
      summary: {
        totalItems: results.length,
        typeBreakdown: results.reduce((acc, curr) => {
          acc[curr.class] = (acc[curr.class] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    }, null, 2);
    
    const file = new Blob([resultsData], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `ecobot-detection-${new Date().getTime()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getPlasticTypeCounts = () => {
    return results.reduce((acc, curr) => {
      acc[curr.class] = (acc[curr.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const typeCounts = getPlasticTypeCounts();
  const plasticTypes = Object.keys(typeCounts);

  return (
    <div className="glass-panel p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Detection Results</h2>
        <div className="flex space-x-3">
          <button
            onClick={downloadResults}
            className="p-2 text-white/80 hover:text-aqua transition-colors"
            title="Download results"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onReset}
            className="button-outlined text-sm py-1.5 px-3"
          >
            New Detection
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image with detection boxes */}
        <div className="flex-1">
          <div className="relative bg-ocean-light/30 rounded-lg overflow-hidden" ref={containerRef}>
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Analyzed image"
              className="max-w-full max-h-[500px] mx-auto object-contain"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            ></canvas>
          </div>
        </div>
        
        {/* Results summary */}
        <div className="lg:w-80 space-y-6">
          <div className="glass-panel p-4">
            <h3 className="text-lg font-medium text-white/90 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-aqua" size={18} />
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total detections:</span>
                <span className="text-white font-medium">{results.length}</span>
              </div>
              <div className="h-px bg-white/10 my-2"></div>
              {plasticTypes.map(type => (
                <div key={type} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: plasticTypeColors[type as keyof typeof plasticTypeColors] }}
                    ></div>
                    <span className="text-white/70 capitalize">{type.replace('_', ' ')}:</span>
                  </div>
                  <span className="text-white font-medium">{typeCounts[type]}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <h3 className="text-lg font-medium text-white/90 mb-4 flex items-center">
              <Filter className="mr-2 text-aqua" size={18} />
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {plasticTypes.map(type => (
                <button
                  key={type}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedType === type 
                      ? 'bg-aqua text-ocean-dark' 
                      : 'bg-ocean-light/50 text-white/80 hover:bg-ocean-light hover:text-white'
                  } transition-colors`}
                  onClick={() => handleTypeFilter(type)}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
              {selectedType && (
                <button
                  className="px-3 py-1.5 rounded-full text-sm bg-ocean-light/20 text-white/60 hover:bg-ocean-light/40 transition-colors"
                  onClick={() => setSelectedType(null)}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <h3 className="text-lg font-medium text-white/90 mb-3 flex items-center">
              <Info className="mr-2 text-aqua" size={18} />
              Tips
            </h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• Hover over detections for details</li>
              <li>• Filter by type to focus on specific plastics</li>
              <li>• Download results for further analysis</li>
              <li>• Try different images for better accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
