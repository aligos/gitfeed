const initialState = {};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USER":
      return action.payload;
    default:
      return state;
  }
};

export default user;
