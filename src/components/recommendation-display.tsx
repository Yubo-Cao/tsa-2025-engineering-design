import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import React from "react";

interface RecommendationDisplayProps {
  prediction?: string;
  cropType: string;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  prediction,
  cropType,
}) => {
  if (!prediction) {
    return null; // Or a placeholder if you prefer
  }

  let recommendation = "";
  let alertSeverity: "success" | "info" | "warning" | "error" | undefined =
    "info";
  let alertTitle = "Recommendation";

  if (cropType === "rice") {
    const riceLevelMap: { [key: string]: string } = {
      "Level 2":
        "Nitrogen Deficiency Detected. Consider increasing nitrogen fertilizer application based on local guidelines.",
      "Level 3":
        "Possible Nitrogen Deficiency. Monitor plant health and consider a slight increase in nitrogen if growth is stunted.",
      "Level 4":
        "Optimal Nitrogen Level. Plant appears healthy based on leaf color. Continue current fertilization practices.",
      "Level 5":
        "Slightly High Nitrogen Level. Plant is likely healthy, but consider slightly reducing nitrogen in the next application to prevent overuse in the long run. This is optional as current level might be acceptable.",
    };
    recommendation =
      riceLevelMap[prediction] || "No specific recommendation available.";
    if (prediction === "Level 2" || prediction === "Level 3") {
      alertSeverity = "warning"; // or "error" if you want to emphasize deficiency
    } else if (prediction === "Level 5") {
      alertSeverity = "info"; // or "success" if you see slightly high as acceptable
    } else if (prediction === "Level 4") {
      alertSeverity = "success";
      alertTitle = "Healthy Plant";
    }
  } else if (["melon", "cucumber", "tomato"].includes(cropType)) {
    if (prediction === "Healthy") {
      recommendation =
        "Plant appears healthy. Continue current fertilization practices.";
      alertSeverity = "success";
      alertTitle = "Healthy Plant";
    } else if (prediction.includes("Nitrogen Deficiency")) {
      recommendation = `Nitrogen Deficiency Detected (${prediction}). Consider increasing nitrogen fertilizer application based on local guidelines.`;
      alertSeverity = "warning"; // or "error"
    } else {
      recommendation = `Disease Detected: ${prediction}. Consult agricultural experts for disease-specific treatment and fertilization adjustments. Note that this disease might be related to nutrient imbalances.`;
      alertSeverity = "error";
      alertTitle = "Disease Detected";
    }
  }

  return (
    <Box mt={3}>
      <Alert severity={alertSeverity}>
        <AlertTitle>{alertTitle}</AlertTitle>
        {recommendation}
      </Alert>
    </Box>
  );
};

export default RecommendationDisplay;
