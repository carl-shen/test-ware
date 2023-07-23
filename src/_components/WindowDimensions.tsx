import React, { useState, useEffect } from "react";
import config from "_configs/configs.json";

import { WindowDimensions } from "_types/common";

export function getWindowDimensions(): WindowDimensions {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export function useWindowDimensions(): WindowDimensions {
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

export function usePortraitMode(): boolean {
  const dimensions = getWindowDimensions();
  if (dimensions.width < config.LANDSCAPE_MODE_MIN_WIDTH) {
    return true;
  } else {
    return false;
  }
}
