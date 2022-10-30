import { ChangeEvent, useState } from 'react';
import ImagePreview from './ImagePreview';
import { fileToDataString } from './utils';

function App() {
  const [previewImageSrc, setPreviewImageSrc] = useState<string>();

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setPreviewImageSrc(await fileToDataString(file));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClosePreview = () => {
    setPreviewImageSrc(undefined);
  };

  return (
    <div>
      <input type="file" onChange={handleChangeFile} accept="image/*" />
      {previewImageSrc && (
        <ImagePreview imageSrc={previewImageSrc} onClose={handleClosePreview} />
      )}
    </div>
  );
}

export default App;
