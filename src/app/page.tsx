"use client";

import React, { useState, useCallback } from "react";
import {
  Tab,
  Tabs,
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import ImageInput from "@/components/image-input";
import RecommendationDisplay from "@/components/recommendation-display";
import InstructionDisplay from "@/components/instruction-display";
import axios from "axios";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CropTabs: React.FC = () => {
  const [value, setValue] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [prediction, setPrediction] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentCropType, setCurrentCropType] = useState<string>("rice"); // Default to rice

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      setPrediction(undefined); // Clear prediction on tab change
      setError(undefined);
      setImageBase64(undefined);
      if (newValue === 0) setCurrentCropType("rice");
      else if (newValue === 1) setCurrentCropType("melon");
      else if (newValue === 2) setCurrentCropType("cucumber");
      else if (newValue === 3) setCurrentCropType("tomato");
      else if (newValue === 4) setCurrentCropType("other");
    },
    []
  );

  const handleImageBase64 = useCallback((base64Data: string) => {
    setImageBase64(base64Data);
  }, []);

  const handleClassifyImage = useCallback(async () => {
    if (!imageBase64) {
      setError("Please upload or take a picture.");
      return;
    }

    setLoading(true);
    setError(undefined);
    setPrediction(undefined);

    let functionName = "";
    if (currentCropType === "rice") functionName = "classify_rice";
    else if (currentCropType === "melon") functionName = "classify_melon";
    else if (currentCropType === "cucumber") functionName = "classify_cucumber";
    else if (currentCropType === "tomato") functionName = "classify_tomato";
    else {
      setLoading(false);
      setError("Classification not available for 'Other Crops'.");
      return;
    }

    try {
      const response = await axios.post(`/api/${functionName}`, {
        image: imageBase64,
      });
      setPrediction(response.data.prediction);
      setError(undefined);
    } catch (e: unknown) {
      console.error("Error classifying image:", e);
      if (axios.isAxiosError(e)) {
        setError(e.response?.data || "Error classifying image.");
      } else {
        setError("Error classifying image.");
      }
      setPrediction(undefined);
    } finally {
      setLoading(false);
    }
  }, [imageBase64, currentCropType]);

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fertilization Recommendation System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="crop tabs"
          centered
        >
          <Tab label="Rice" {...a11yProps(0)} />
          <Tab label="Melon" {...a11yProps(1)} />
          <Tab label="Cucumber" {...a11yProps(2)} />
          <Tab label="Tomato" {...a11yProps(3)} />
          <Tab label="Other Crops" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <InstructionDisplay cropType="rice" />
        <ImageInput
          onImageBase64={handleImageBase64}
          loading={loading}
          error={error}
          prediction={prediction}
        />
        <Button
          variant="contained"
          onClick={handleClassifyImage}
          disabled={loading || !imageBase64}
          sx={{ mt: 2 }}
        >
          Classify Rice
        </Button>
        <RecommendationDisplay prediction={prediction} cropType="rice" />
      </TabPanel>

      <TabPanel value={value} index={1}>
        {/* Melon Tab */}
        <InstructionDisplay cropType="melon" />
        <ImageInput
          onImageBase64={handleImageBase64}
          loading={loading}
          error={error}
          prediction={prediction}
        />
        <Button
          variant="contained"
          onClick={handleClassifyImage}
          disabled={loading || !imageBase64}
          sx={{ mt: 2 }}
        >
          Classify Melon
        </Button>
        <RecommendationDisplay prediction={prediction} cropType="melon" />
      </TabPanel>

      <TabPanel value={value} index={2}>
        {/* Cucumber Tab */}
        <InstructionDisplay cropType="cucumber" />
        <ImageInput
          onImageBase64={handleImageBase64}
          loading={loading}
          error={error}
          prediction={prediction}
        />
        <Button
          variant="contained"
          onClick={handleClassifyImage}
          disabled={loading || !imageBase64}
          sx={{ mt: 2 }}
        >
          Classify Cucumber
        </Button>
        <RecommendationDisplay prediction={prediction} cropType="cucumber" />
      </TabPanel>

      <TabPanel value={value} index={3}>
        {/* Tomato Tab */}
        <InstructionDisplay cropType="tomato" />
        <ImageInput
          onImageBase64={handleImageBase64}
          loading={loading}
          error={error}
          prediction={prediction}
        />
        <Button
          variant="contained"
          onClick={handleClassifyImage}
          disabled={loading || !imageBase64}
          sx={{ mt: 2 }}
        >
          Classify Tomato
        </Button>
        <RecommendationDisplay prediction={prediction} cropType="tomato" />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Typography variant="body1" mt={2}>
          For other crops, please consult a general fertilization guide or local
          agricultural resources for nitrogen recommendations. Consider factors
          like crop type, growth stage, soil type, and environmental conditions.
        </Typography>
        {/* You can add a static nitrogen recommendation chart here if you have one */}
      </TabPanel>
    </Container>
  );
};

export default CropTabs;
