import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface InstructionDisplayProps {
  cropType: string;
}

const InstructionDisplay: React.FC<InstructionDisplayProps> = ({
  cropType,
}) => {
  let instructions = "";

  if (cropType === "rice") {
    instructions =
      "Please take a picture from directly above the paddy field to capture a representative view of the rice plants. Ensure good lighting and focus on the leaves.";
  } else if (cropType === "melon") {
    instructions =
      "Take a picture of a single melon leaf placed on a white, flat surface. Ensure the leaf occupies at least 80% of the image and is well-lit and in focus.";
  } else if (cropType === "cucumber") {
    instructions =
      "Take a picture of a single cucumber leaf placed on a dark surface. Ensure the leaf is well-lit, in focus, and clearly visible against the dark background.";
  } else if (cropType === "tomato") {
    instructions =
      "Take a picture of a single tomato leaf placed on a dark surface. Make sure the leaf is well-lit, in focus, and stands out against the dark background.";
  } else if (cropType === "other") {
    instructions =
      "For other crops, please refer to general nitrogen recommendation charts based on your crop type and local soil conditions.";
  }

  return (
    <Box p={2} bgcolor="#f5f5f5" borderRadius={1}>
      <Typography variant="subtitle1">Image Capture Instructions:</Typography>
      <Typography variant="body2">{instructions}</Typography>
    </Box>
  );
};

export default InstructionDisplay;
