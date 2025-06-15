
import { useState } from 'react';

export const usePreviewToggle = (defaultVisible: boolean = true) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(defaultVisible);

  const togglePreview = () => setIsPreviewVisible(!isPreviewVisible);

  return {
    isPreviewVisible,
    togglePreview,
    setIsPreviewVisible
  };
};
