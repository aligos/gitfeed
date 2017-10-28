import { combineReducers } from "redux";

import count from "./count";
import loading from "./loading";
import logged from "./logged";
import user from "./user";

export default combineReducers({
  count,
  loading,
  logged,
  user
});
