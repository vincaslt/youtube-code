import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface Props {
  imageSrc: string;
  onClose: () => void;
}

const ZOOM_INC = 1.1;

function ImagePreview({ imageSrc, onClose }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  const fitImageToScreen = () => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!image || !container) {
      return;
    }

    const containerBounds = container.getBoundingClientRect();
    const heightRatio = containerBounds.height / image.naturalHeight;
    const widthRatio = containerBounds.width / image.naturalWidth;

    setScale(Math.min(heightRatio, widthRatio, 1));
  };

  useEffect(() => {
    fitImageToScreen();
  }, []);

  const updateScale = (scale: number) => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!image || !container) {
      return;
    }

    const prevWidth = image.width;
    const prevHeight = image.height;

    flushSync(() => {
      setScale(scale);
    });

    container.scrollBy({
      left: (image.width - prevWidth) / 2,
      top: (image.height - prevHeight) / 2,
    });
  };

  const handleZoomInClick = () => {
    updateScale(scale * ZOOM_INC);
  };

  const handleZoomOutClick = () => {
    updateScale(scale / ZOOM_INC);
  };

  const handleZoomResetClick = () => {
    fitImageToScreen();
  };

  const originalWidth = imageRef.current?.naturalWidth ?? 0;
  const originalHeight = imageRef.current?.naturalHeight ?? 0;

  const scaledDimensions = {
    width: scale * originalWidth,
    height: scale * originalHeight,
  };

  return (
    <div className="image-preview">
      <div className="top-bar">
        <button onClick={onClose} className="control">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div ref={containerRef} className="preview-container">
        <img
          ref={imageRef}
          src={imageSrc}
          alt=""
          style={scaledDimensions}
          className="preview-image"
        />
      </div>
      <div className="bottom-bar">
        <button onClick={handleZoomOutClick} className="control">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </button>
        <button
          onClick={handleZoomResetClick}
          className="control control-with-padding"
        >
          {Math.round(scale * 100)}%
        </button>
        <button onClick={handleZoomInClick} className="control">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ImagePreview;
