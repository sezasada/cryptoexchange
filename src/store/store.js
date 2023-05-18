import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { provider, tokens } from "./reducers";

const reducer = combineReducers({
  provider,
  tokens
});

const initialSate = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialSate,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
