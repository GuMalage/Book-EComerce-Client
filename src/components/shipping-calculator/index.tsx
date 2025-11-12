// ShippingCalculator.tsx
import { useEffect, useState } from "react";
import AddressService from "@/services/Address-service";
import type { ShippingOption } from "@/commons/types";

interface IShippingCalculator {
  selectedAddress: string;
  setShippingOptions: (options: ShippingOption[]) => void;
  setSelectedShipping: (option: ShippingOption | null) => void;
}

function ShippingCalculator({
  selectedAddress,
  setShippingOptions,
  setSelectedShipping,
}: IShippingCalculator) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calcShipping = async () => {
      if (selectedAddress !== null) {
        setLoading(true);
        setError(null);

        const shipmentData = {
          from: {
            postal_code: "85507050",
          },
          to: {
            postal_code: selectedAddress,
          },
          products: [
            {
              id: "x",
              width: 11,
              height: 17,
              length: 11,
              weight: 0.3,
              insurance_value: 10.1,
              quantity: 1,
            },
          ],
          options: {
            receipt: false,
            own_hand: false,
          },
          services: "1,2,18",
        };

        try {
          const result = await AddressService.calculateShipment(shipmentData);
          if (result && Array.isArray(result) && result.length > 0) {
            const validOptions = result.filter(
              (option: any) => !option.error && option.price
            );
            setShippingOptions(validOptions);
            if (validOptions.length > 0) {
              setSelectedShipping(validOptions[0]);
            } else {
              setSelectedShipping(null);
            }
          } else {
            setShippingOptions([]);
            setSelectedShipping(null);
          }
        } catch (error) {
          console.error("Error calculating shipping:", error);
          setError("Falha ao calcular o frete.");
          setShippingOptions([]);
          setSelectedShipping(null);
        } finally {
          setLoading(false);
        }
      }
    };

    calcShipping();
  }, [selectedAddress, setShippingOptions, setSelectedShipping]);

  return (
    <div style={{ marginTop: "10px" }}>
      {loading && (
        <div style={{ color: "#555", fontSize: "14px" }}>Calculando frete...</div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            color: "#900",
            border: "1px solid #f88",
            padding: "8px 12px",
            borderRadius: "6px",
            marginTop: "10px",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default ShippingCalculator;
