"use client";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PhotoLibrary from "@mui/icons-material/PhotoLibrary";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useCallback, useRef, useState } from "react";

interface ImageInputProps {
  onImageBase64: (base64Image: string) => void;
  loading: boolean;
  error?: string;
  prediction?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onImageBase64,
  loading,
  error,
  prediction,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        const base64Data = base64String.split(",")[1]; // Remove data URL prefix
        onImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    },
    [onImageBase64]
  );

  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleGalleryClick = useCallback(() => {
    galleryInputRef.current?.click();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <IconButton
          color="primary"
          aria-label="take a photo"
          component="span"
          onClick={handleCameraClick}
        >
          <PhotoCamera />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="choose from gallery"
          component="span"
          onClick={handleGalleryClick}
        >
          <PhotoLibrary />
        </IconButton>
      </Box>
      {imagePreview && (
        <Box mt={2} maxWidth="100%" maxHeight="300px" overflow="hidden">
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      )}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {prediction && (
        <Typography variant="h6" mt={2}>
          Prediction: {prediction}
        </Typography>
      )}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        ref={cameraInputRef}
        onChange={handleImageChange}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={galleryInputRef}
        onChange={handleImageChange}
      />
    </Box>
  );
};

export default ImageInput;
