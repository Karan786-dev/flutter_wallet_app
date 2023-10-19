export default (state = {}, action) => {
    return action.type == 'USERDATA' ? action.payload : { ...state }
}