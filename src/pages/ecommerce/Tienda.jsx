import { useState } from "react";
import { CarritoProvider } from "./CarritoContext";
import ProductosTienda from "./ProductosTienda";
import Carrito from "./Carrito";
import CheckoutForm from "./CheckoutForm";
import { ErrorBoundary } from "../../components/routing/ErrorBoundary";

export default function Tienda() {
  const [checkout, setCheckout] = useState(false);

  return (
    <CarritoProvider>
      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Tienda</h1>
          <ProductosTienda />
        </div>
        <div className="w-full md:w-[400px]">
          <ErrorBoundary>
            {checkout ? (
              <CheckoutForm onFinish={() => setCheckout(false)} />
            ) : (
              <Carrito onCheckout={() => setCheckout(true)} />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </CarritoProvider>
  );
}
