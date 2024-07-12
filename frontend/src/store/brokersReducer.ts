const initialState = {
    currentBrokers: null,
};

const brokersReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default brokersReducer;