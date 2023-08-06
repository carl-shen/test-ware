import { AppConstants } from "../_constants";

export const appActions = {
  updateComponentSize,
  setTrainingDataSet,
};

function updateComponentSize(componentSizeName, size) {
  const payload = { componentSizeName: componentSizeName, size: size };
  return { type: AppConstants.UPDATE_COMPONENT_SIZE, payload };
}

function setTrainingDataSet(payload) {
  return { type: AppConstants.SET_TRAINING_DATA_SET, payload };
}
