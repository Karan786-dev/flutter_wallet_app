const { combineReducers } = require("redux");

import userdata from "./userdata";

let rootReducer = combineReducers({
    userdata
})

export default rootReducer