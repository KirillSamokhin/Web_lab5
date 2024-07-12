// export const login = (user: any) => ({
//     type: 'LOGIN',
//     payload: user,
// });
//
// export const logout = () => ({
//     type: 'LOGOUT',
// });

export const setUser = (user: any) => ({
    type: 'SET_USER',
    payload: user,
});

export const updateInitialValue = (name: any, initialValue: any) => {
    return {
        type: 'UPDATE_INITIAL_VALUE',
        payload: { name, initialValue },
    };
};