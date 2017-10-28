const initialState = false;

const logged = (state = initialState, action) => {
  switch (action.type) {
    case "LOGGED":
      return !state;
    default:
      return state;
  }
};

export default logged;
