import { appConstants } from '../_constants';

export const appActions = {
    updateComponentHeight,
    setTrainingDataSet
};

function updateComponentHeight(componentHeightName, height) {
    const payload = { componentHeightName: componentHeightName , height: height };
    console.log(payload);
    return { type: appConstants.UPDATE_COMPONENT_HEIGHT, payload };
}

function setTrainingDataSet(payload) {
    return { type: appConstants.SET_TRAINING_DATA_SET, payload };

}