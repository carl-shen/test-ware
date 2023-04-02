export const loadState = function () {
  try {
    const serialisedState = localStorage.getItem("state");
    if (serialisedState === null) {
      return undefined;
    }
    return JSON.parse(serialisedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = function (state) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("state", serialisedState);
  } catch (error) {
    console.log("Error when saving state to localStorage.");
  }
};
