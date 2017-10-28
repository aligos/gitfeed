const initialState = 0;

const count = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_COUNT":
      return state + (action.payload || 1);
    default:
      return state;
  }
};

export default count
