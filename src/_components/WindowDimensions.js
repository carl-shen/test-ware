import React, { useState, useEffect } from "react";
import config from "../_configs/configs.json";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      const dimensions = getWindowDimensions();
      setWindowDimensions(dimensions);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function usePortraitMode() {
  const dimensions = getWindowDimensions();
  if (dimensions.width < config.LANDSCAPE_MODE_MIN_WIDTH) {
    return true;
  } else {
    return false;
  }
}

export { getWindowDimensions, useWindowDimensions, usePortraitMode };
