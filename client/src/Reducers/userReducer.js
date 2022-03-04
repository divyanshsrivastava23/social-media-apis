// refer to userContext:
// * initial state of user:
export const initialState = null;

// * a function that will be updating the state of user:
export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "CLEAR":
      return null;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "AVATARUPDATE":
      return {
        ...state,
        avatar: action.payload.avatar,
      };
    default:
      return state;
  }
};
