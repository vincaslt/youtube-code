import { ChangeEventHandler, useState } from "react";
import ImagePreview from "./ImagePreview";
import { fileToDataString } from "./utils";

function App() {
  const [previewImageSrc, setPreviewImageSrc] = useState<string>();

  const handleChangeFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
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

  const handleCloseClick = () => {
    setPreviewImageSrc(undefined);
  };

  return (
    <>
      <input type="file" onChange={handleChangeFile} accept="image/*" />
      {previewImageSrc && (
        <ImagePreview imageSrc={previewImageSrc} onClose={handleCloseClick} />
      )}
    </>
  );
}

export default App;
