import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import classes from './ImagePreview.module.css';

interface Props {
  imageSrc: string;
  onClose: () => void;
}

const ZOOM_INC = 1.1;

function ImagePreview({ imageSrc, onClose }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(0);

  const fitImageToBounds = () => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) {
      return;
    }

    const containerBounds = container.getBoundingClientRect();
    const heightRatio = containerBounds.height / image.naturalHeight;
    const widthRatio = containerBounds.width / image.naturalWidth;

    setScale(Math.min(1, heightRatio, widthRatio));
  };

  useEffect(() => {
    fitImageToBounds();
  }, []);

  const naturalWidth = imageRef.current?.naturalWidth ?? 0;
  const naturalHeight = imageRef.current?.naturalHeight ?? 0;

  const scaledDimensions = {
    width: scale * naturalWidth,
    height: scale * naturalHeight,
  };

  const updateScale = (scale: number) => {
    const image = imageRef.current;
    const container = containerRef.current;

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
    fitImageToBounds();
  };

  return (
    <div className={classes.imagePreview}>
      <div className={classes.topBar}>
        <button className={classes.control} onClick={onClose}>
          ✖
        </button>
      </div>

      <div className={classes.imageContainer} ref={containerRef}>
        <img
          ref={imageRef}
          src={imageSrc}
          alt=""
          className={classes.image}
          style={scaledDimensions}
        />
      </div>

      <div className={classes.bottomBar}>
        <button className={classes.control} onClick={handleZoomOutClick}>
          -
        </button>
        <button
          className={`${classes.control} ${classes.controlWithPadding}`}
          onClick={handleZoomResetClick}
        >
          {Math.round(scale * 100)}%
        </button>
        <button className={classes.control} onClick={handleZoomInClick}>
          +
        </button>
      </div>
    </div>
  );
}

export default ImagePreview;
