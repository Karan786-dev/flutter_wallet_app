import { applyMiddleware, createStore } from "redux";
import rootReducer from "./Reducers";
import  thunkMiddleware  from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export default store