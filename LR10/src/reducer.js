const reducer = (state, action) => {
    if (action.type === "CLEAR_CART") {
        return {...state, cart:[] };
    }

    if (action.type === "REMOVE") {
        return {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload),
        };
    }

    if (action.type === "INCREASE") {
        let tempCart = state.cart.map((item) =>{
            if (item.id=== action.payload) {
                return { ...item, amount: item.amount + 1}
            }
            return item;
        });
        return {
            ...state,
            cart: tempCart,
        }
    }

    if (action.type === "DECREASE") {
        let tempCart = state.cart.map((item) => {
            if (item.id === action.payload) {
                const newAmount = item.amount - 1;
                return { ...item, amount: newAmount };
            }
            return item;
        })
        .filter((item) => item.amount !== 0);
        return {
            ...state,
            cart: tempCart,
        };
    }

    if (action.type === "GET_TOTALS") {
        const {total, amount} = state.cart.reduce(
            (cartTotal, cartItem) => {
                cartTotal.total += cartItem.amount * cartItem.price;
                cartTotal.amount += cartItem.amount;
                return cartTotal;
            },
            {total:0, amount: 0 }
        );
    
        return { ...state, amount, total: parseFloat(total.toFixed(2)) };
    }
    
    if (action.type === "LOADING") {
        return {...state, loading: true };
    }

    if (action.type === "DISPLAY_ITEMS") {
        return {...state, cart: action.payload, loading: false };
    }



    return state;
};

export default reducer;