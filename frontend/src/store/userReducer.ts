const initialState = {
    currentUser: null,
};

const userReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case 'SET_USER':
            return { currentUser: action.payload };
        // case 'LOGOUT':
        //     return { currentUser: null };
        default:
            return state;
    }
};

export default userReducer;