// Maneja los inputs, el autocompletado de Plaza/Producto, y la lógica de selección de precio.
import React from "react";

export default function CotizacionForm({
  plaza, sugerenciasPlaza, handleSelectPlaza, handleChangePlaza, isPlazaValid,
  almacen, setAlmacen, sugerenciasAlmacen, isAlmacenValid,
  cliente, sugerenciasCliente, handleSelectCliente, handleChangeCliente, isClientValid,
  producto, sugerencias, handleSelectProducto, handleChangeProducto,
  existencia,
  precio, setPrecio,
  cantidad, setCantidad,
  unidad, setUnidad,
  iva, setIva,
  agregarCotizacion, canAddCotizacion,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
        justifyContent: "center",
      }}
    >
      {/* CAMPO CLIENTE con autocompletado */}
      <div 
        style={{ 
          position: "relative", 
          flex: "1 1 100%", // Ocupa todo el ancho
          minWidth: "120px"
        }}
      >
        <input 
          type="text"
          placeholder="Nombre del Cliente"
          value={cliente}
          onChange={handleChangeCliente}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: `2px solid ${isClientValid || cliente.length === 0 ? '#ccc' : '#dc3545'}`,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#333'
          }}
        />
        {sugerenciasCliente.length > 0 && (
          <ul
            style={{
              position: "absolute",
              backgroundColor: "black",
              border: "1px solid #ffffffff",
              width: "100%",
              listStyle: "none",
              margin: 0,
              padding: 0,
              maxHeight: "300px",
              overflowY: "auto",
              borderRadius: "5px",
              zIndex: 10,
              top: "100%",
              color: "white"
            }}
          >
            {sugerenciasCliente.map((item, i) => (
              <li
                key={i}
                onClick={() => handleSelectCliente(item.NOM_CTE)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #555",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onMouseDown={(e) => e.preventDefault()}
              >
                {item.NOM_CTE}
              </li>
            ))}
          </ul>
        )}
        {!isClientValid && cliente.length > 0 && (
          <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
            * Selecciona un cliente válido de la lista.
          </div>
        )}
      </div>

      {/* CAMPO PLAZA con autocompletado */}
      <div 
        style={{ 
          position: "relative", 
          flex: "1 1 45%", // Ajustado para dar espacio al almacén
          minWidth: "120px"
        }}
      >
        <input 
          type="text"
          placeholder="Plaza"
          value={plaza}
          onChange={handleChangePlaza}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: `2px solid ${isPlazaValid || plaza.length === 0 ? '#ccc' : '#dc3545'}`,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#333'
          }}
        />
        {sugerenciasPlaza.length > 0 && (
          <ul
            style={{
              position: "absolute",
              backgroundColor: "black",
              border: "1px solid #ffffffff",
              width: "100%",
              listStyle: "none",
              margin: 0,
              padding: 0,
              maxHeight: "300px",
              overflowY: "auto",
              borderRadius: "5px",
              zIndex: 10,
              top: "100%",
              color: "white"
            }}
          >
            {sugerenciasPlaza.map((item) => (
              <li
                key={item.PLAZA} // Usar PLAZA (ID) como key
                onClick={() => handleSelectPlaza(item.NOM_PLAZA)} // Usar NOM_PLAZA para seleccionar
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #555",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onMouseDown={(e) => e.preventDefault()}
              >
                {item.NOM_PLAZA}
              </li>
            ))}
          </ul>
        )}
        {!isPlazaValid && plaza.length > 0 && (
          <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
            * Selecciona una plaza válida de la lista.
          </div>
        )}
      </div>

      {/* ¡NUEVO! CAMPO ALMACÉN (Select) */}
      <div 
        style={{ 
          position: "relative", 
          flex: "1 1 45%", // Ajustado para estar al lado de la plaza
          minWidth: "120px"
        }}
      >
        <select 
          value={almacen}
          onChange={(e) => setAlmacen(e.target.value)}
          disabled={sugerenciasAlmacen.length === 0}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: `2px solid ${isAlmacenValid || almacen.length === 0 ? '#ccc' : '#dc3545'}`,
            backgroundColor: sugerenciasAlmacen.length === 0 ? '#eee' : 'white',
            color: sugerenciasAlmacen.length === 0 ? '#999' : 'black',
            boxSizing: 'border-box',
            height: '43px' // Para alinear con los inputs
          }}
        >
          <option value="">{sugerenciasAlmacen.length > 0 ? "Selecciona Almacén..." : "Selecciona Plaza"}</option>
          {sugerenciasAlmacen.map((item) => (
            <option key={item.COD_ALM} value={item.NOM_ALM}>
              {item.NOM_ALM}
            </option>
          ))}
        </select>
        {!isAlmacenValid && almacen.length > 0 && (
          <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
            * Almacén no válido.
          </div>
        )}
      </div>
      
      {/* --- CAMPO PRODUCTO y EXISTENCIA --- */}
      <div style={{ flex: "1 1 100%", display: 'flex', gap: '10px', alignItems: 'flex-start' }}> {/* Contenedor para Producto y Existencia */}
          {/* CAMPO PRODUCTO con autocompletado */}
          <div 
            style={{ 
              position: "relative", 
              flexGrow: 1, // Permite que ocupe el espacio disponible
              minWidth: "120px" 
            }}
          >
            <input
              type="text"
              placeholder="Producto"
              value={producto}
              onChange={handleChangeProducto}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: '#333'
              }}
            />
            {sugerencias.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  backgroundColor: "black",
                  border: "1px solid #ffffffff",
                  width: "100%",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  maxHeight: "300px",
                  overflowY: "auto",
                  borderRadius: "5px",
                  zIndex: 10,
                  top: "100%",
                  color: "white"
                }}
              >
                {sugerencias.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectProducto(item.DESCRI)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #555",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {item.DESCRI}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* ¡NUEVO! MOSTRAR EXISTENCIA */}
          <div style={{ 
                padding: "10px", 
                backgroundColor: "#333", 
                color: existencia === null ? '#888' : 'white', 
                borderRadius: "5px",
                minWidth: '80px', // Ancho mínimo
                textAlign: 'center',
                border: '1px solid #555',
                whiteSpace: 'nowrap', // Evita que el texto se parta
                height: '43px', // Para alinear
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
           >
              Exist: {existencia !== null ? existencia : 'N/A'}
           </div>
          {/* --------------------------- */}
      </div>
      {/* --------------------------------- */}
      
      {/* INPUT PRECIO */}
      <input
        type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)}
        style={{ flex: "1 1 45%", padding: "10px", borderRadius: "5px", minWidth: "120px", boxSizing: 'border-box', backgroundColor: '#fff', color: '#333' }}
      />

      {/* INPUT CANTIDAD */}
      <input
        type="number" placeholder="Cantidad" value={cantidad} min="0.01" onChange={(e) => setCantidad(e.target.value)}
        style={{ flex: "1 1 22%", padding: "10px", borderRadius: "5px", minWidth: "120px", boxSizing: 'border-box', backgroundColor: '#fff', color: '#333' }}
      />
      {/* SELECT UNIDAD */}
      <select
        value={unidad} onChange={(e) => setUnidad(e.target.value)}
        style={{ flex: "1 1 22%", padding: "10px", borderRadius: "5px", minWidth: "120px", boxSizing: 'border-box', backgroundColor: '#fff', color: '#333', height: '43px' }}
      >
        <option value="piezas">Piezas</option>
        <option value="kg">Kg</option>
        <option value="L">Litros</option>
      </select>
      {/* INPUT IVA */}
      <input
        type="number" placeholder="IVA %" value={iva} onChange={(e) => setIva(e.target.value)}
        style={{ flex: "1 1 22%", padding: "10px", borderRadius: "5px", minWidth: "120px", boxSizing: 'border-box', backgroundColor: '#fff', color: '#333' }}
      />
      {/* BOTÓN AGREGAR */}
      <button
        onClick={agregarCotizacion} disabled={!canAddCotizacion}
        style={{
          flex: "1 1 100%", // Botón ocupa todo el ancho en la última fila
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: canAddCotizacion ? "#007BFF" : "#6c757d",
          color: "white",
          border: "none",
          cursor: canAddCotizacion ? "pointer" : "not-allowed",
          minWidth: "120px",
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Agregar
      </button>
    </div>
  );
}

