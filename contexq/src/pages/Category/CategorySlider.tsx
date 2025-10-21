import React, { useEffect, useState } from "react";
import GridList from "@material-ui/core/GridList";
import { GridListTile, GridListTileBar } from "@material-ui/core";
import ProductPlaceholder from "../../images/product_placeholder.jpg";
import { ProductModel } from "../../types";
import { FetchProductsApi, AddToCartApi } from "../../api/product-api";

export const CategorySlider = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token") || "";
      const res: any = await FetchProductsApi(token);
      if (res && res.data && Array.isArray(res.data)) {
        setProducts(res.data as ProductModel[]);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = async (p: ProductModel) => {
    try {
      const token = localStorage.getItem("token") || "";
      const payload = {
        product_id: p._id,
        name: p.name,
        image_url: p.image_url || "",
        price: p.price,
        item_qty: 1,
      };
      const res: any = await AddToCartApi(token, payload);
      if (res && res.message && res.message.toLowerCase().includes("success")) {
        alert("Added to cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  return (
    <div
      style={{
        width: "90%",
        flexDirection: "column",
      }}
    >
      <p style={{ fontSize: 26, fontWeight: "700" }}>Top Products</p>

      {loading && <div>Loading products...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <GridList
        cols={2.5}
        style={{
          flexWrap: "nowrap",
          transform: "translateZ(0)",
        }}
      >
        {products.map((item) => (
          <GridListTile
            key={item._id}
            style={{
              display: "flex",
              height: 300,
              width: 220,
              marginLeft: 5,
              marginRight: 5,
              padding: 5,
              justifyContent: "center",
              border: `solid 1px #A2A2A2`,
              borderRadius: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                draggable={false}
                src={item.image_url || ProductPlaceholder}
                alt={item.name}
                style={{
                  width: "80%",
                  height: 140,
                  objectFit: "contain",
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: 80,
                  paddingTop: 8,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: "600",
                    margin: 0,
                    padding: 0,
                    color: "#505050",
                  }}
                >
                  {item.name}
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: "800",
                      color: "#505050",
                    }}
                  >
                    ${item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};