import { AppConstants } from "../_constants";

export const appActions = {
  updateComponentSize,
  setTrainingDataSet,
};

interface ActionReturnType {
  type: AppConstants;
  payload: Record<string, any> | string;
}

function updateComponentSize(
  componentSizeName: string,
  size: number
): ActionReturnType {
  const payload = { componentSizeName, size };
  return { type: AppConstants.UPDATE_COMPONENT_SIZE, payload };
}

function setTrainingDataSet(dataSetName: string): ActionReturnType {
  return { type: AppConstants.SET_TRAINING_DATA_SET, payload: dataSetName };
}
