import { createContext, useContext, useReducer, useEffect } from "react";

const CarritoContext = createContext();

function getInitialState() {
  try {
    const saved = localStorage.getItem("carrito");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { items: [] };
}

function carritoReducer(state, action) {
  switch (action.type) {
    case "AGREGAR": {
      const existe = state.items.find(i => i.producto.id === action.producto.id);
      let newItems;
      if (existe) {
        newItems = state.items.map(i =>
          i.producto.id === action.producto.id
            ? { ...i, cantidad: i.cantidad + action.cantidad }
            : i
        );
      } else {
        newItems = [...state.items, { producto: action.producto, cantidad: action.cantidad }];
      }
      return { ...state, items: newItems };
    }
    case "QUITAR": {
      return {
        ...state,
        items: state.items.filter(i => i.producto.id !== action.id),
      };
    }
    case "VACIAR": {
      return { items: [] };
    }
    default:
      return state;
  }
}

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(carritoReducer, getInitialState());
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(state));
  }, [state]);
  return (
    <CarritoContext.Provider value={{ state, dispatch }}>
      {children}
    </CarritoContext.Provider>
  );
}

