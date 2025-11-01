// Muestra la tabla de cotizaciones, los totales y los botones de eliminar/exportar.
import React from "react";

export default function CotizacionTable({
  cotizaciones,
  plaza,
  cliente, 
  almacen, // ¡CAMBIO! Recibimos el almacén
  eliminarCotizacion,
  subtotalGeneral,
  impuestosGenerales,
  totalGeneral,
  exportarPDF,
  exportarExcel,
}) {
  return (
    <>
      {/* Botones de Exportar */}
      {cotizaciones.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={exportarPDF}
            style={{
              marginRight: "10px",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Exportar PDF
          </button>
          <button
            onClick={exportarExcel}
            style={{
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "orange",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Exportar Excel
          </button>
        </div>
      )}

      {/* Título de la Cotización con Cliente y Plaza */}
      {cliente && (
        <div style={{ marginBottom: "15px", color: "white" }}>
            <h2 style={{ fontSize: "1.2rem", margin: "5px 0", color: "#007BFF" }}>
                Cliente: {cliente}
            </h2>
            <p style={{ fontSize: "1rem", margin: 0, color: "#ccc" }}>
                Plaza: {plaza}
            </p>
            {/* ¡CAMBIO! Mostramos el almacén seleccionado */}
            <p style={{ fontSize: "1rem", margin: 0, color: "#ccc" }}>
                Almacén: {almacen}
            </p>
        </div>
      )}

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
            margin: "0 auto",
            backgroundColor: "#333",
            color: "white",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#444" }}>
              <th style={{ padding: "8px" }}>Plaza</th>
              <th style={{ padding: "8px" }}>Almacén</th> {/* ¡CAMBIO! */}
              <th style={{ padding: "8px" }}>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>IVA %</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((c) => (
              <tr key={c.COD_ART} style={{ borderBottom: "1px solid #555" }}>
                <td style={{ padding: "8px" }}>{plaza}</td>
                <td style={{ padding: "8px" }}>{c.almacen}</td> {/* ¡CAMBIO! */}
                <td style={{ padding: "8px" }}>{c.DESCRI}</td>
                <td>{c.cantidad} {c.unidad}</td>
                <td>${c.precio.toFixed(2)}</td>
                <td>{c.iva}%</td>
                <td>${c.total.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => eliminarCotizacion(c.COD_ART)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {cotizaciones.length > 0 && (
              <>
                <tr style={{ fontWeight: "bold" }}>
                  {/* ¡CAMBIO! colSpan ajustado de 5 a 6 */}
                  <td colSpan="6" style={{ textAlign: "right", padding: "8px" }}>
                    Subtotal
                  </td>
                  {/* ¡CAMBIO! colSpan ajustado de 2 a 2 (sigue bien) */}
                  <td colSpan="2">${subtotalGeneral.toFixed(2)}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  {/* ¡CAMBIO! colSpan ajustado de 5 a 6 */}
                  <td colSpan="6" style={{ textAlign: "right", padding: "8px" }}>
                    Impuestos (IVA)
                  </td>
                  <td colSpan="2">${impuestosGenerales.toFixed(2)}</td>
                </tr>
                <tr style={{ fontWeight: "bold", backgroundColor: "#007b00" }}>
                  {/* ¡CAMBIO! colSpan ajustado de 5 a 6 */}
                  <td colSpan="6" style={{ textAlign: "right", padding: "8px" }}>
                    TOTAL A PAGAR
                  </td>
                  <td colSpan="2">${totalGeneral.toFixed(2)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

