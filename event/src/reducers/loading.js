const initialState = false;

const loading = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING":
      return !state;
    default:
      return state;
  }
};

export default loading;
