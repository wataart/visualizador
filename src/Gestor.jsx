import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- CAMBIOS EN LAS IMPORTACIONES ---
// Apuntan a la carpeta 'dbs/' y tienen extensión
import { dataPrecios, dataPlazas, getProductCodeByDescri } from "./dbs/dbP.ts"; 
import { dataClientes, getUniqueClientNames } from "./dbs/db.ts";      
import { dataAlmacenes } from "./dbs/dbA.ts";                         
import { dataExistencias } from "./dbs/dbE.ts"; 
// ------------------------------------

import CotizacionForm from "./components/CotizacionForm.jsx";
import CotizacionTable from "./components/CotizacionTable.jsx";

export default function Gestor() {
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [unidad, setUnidad] = useState("piezas");
  const [iva, setIva] = useState(16);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [plaza, setPlaza] = useState("");
  const [sugerenciasPlaza, setSugerenciasPlaza] = useState([]);
  const [cliente, setCliente] = useState("");
  const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
  const [almacen, setAlmacen] = useState("");
  const [sugerenciasAlmacen, setSugerenciasAlmacen] = useState([]);
  
  // --- ¡NUEVO! ESTADO PARA EXISTENCIA ---
  const [existencia, setExistencia] = useState(null); 

  // Identificar el ID de la plaza seleccionada
  const selectedPlazaId = dataPlazas.find(
    (p) => p.NOM_PLAZA && p.NOM_PLAZA.toLowerCase() === plaza.toLowerCase()
  )?.PLAZA || null; 

  // --- LÓGICA DE PERSISTENCIA ---
  useEffect(() => {
    const data = localStorage.getItem("cotizaciones");
    if (data) {
        try { setCotizaciones(JSON.parse(data)); } catch (error) { console.error("Error al cargar cotizaciones:", error); localStorage.removeItem("cotizaciones"); }
    }
    const savedPlaza = localStorage.getItem("plaza"); if (savedPlaza) setPlaza(savedPlaza);
    const savedCliente = localStorage.getItem("cliente"); if (savedCliente) setCliente(savedCliente);
    const savedAlmacen = localStorage.getItem("almacen"); if (savedAlmacen) setAlmacen(savedAlmacen);
    if(dataClientes && typeof getUniqueClientNames === 'function') { setSugerenciasCliente(getUniqueClientNames()); }
  }, []); 

  useEffect(() => { localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones)); }, [cotizaciones]);
  useEffect(() => { localStorage.setItem("plaza", plaza); }, [plaza]);
  useEffect(() => { localStorage.setItem("cliente", cliente); }, [cliente]);
  useEffect(() => { localStorage.setItem("almacen", almacen); }, [almacen]);
  
  // --- LÓGICA DE FILTRADO DE ALMACÉN ---
  useEffect(() => {
    let almacenesFiltrados = [];
    if (selectedPlazaId && dataAlmacenes) {
      almacenesFiltrados = dataAlmacenes.filter(a => a.PLAZA === selectedPlazaId);
      if (selectedPlazaId === "01") {
         const plazasCuliacan = ["00", "04", "27", "97", "99"];
         const almacenesAdicionales = dataAlmacenes.filter(a => plazasCuliacan.includes(a.PLAZA));
         const almacenesUnicos = new Map();
         [...almacenesFiltrados, ...almacenesAdicionales].forEach(a => {
            if (a && a.NOM_ALM && !almacenesUnicos.has(a.NOM_ALM)) { almacenesUnicos.set(a.NOM_ALM, a); }
         });
         almacenesFiltrados = Array.from(almacenesUnicos.values());
      }
    }
    setSugerenciasAlmacen(almacenesFiltrados);
    const almacenSigueValido = almacenesFiltrados.some(a => a.NOM_ALM === almacen);
    if (!almacenSigueValido) { setAlmacen(almacenesFiltrados.length === 1 ? almacenesFiltrados[0].NOM_ALM : ""); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlazaId, dataAlmacenes]); // Añadido dataAlmacenes como dependencia

  // --- ¡NUEVO! LÓGICA PARA BUSCAR EXISTENCIA ---
  useEffect(() => {
    const codArt = (typeof getProductCodeByDescri === 'function') ? getProductCodeByDescri(producto) : null;
    const almacenSeleccionado = dataAlmacenes.find(a => a.NOM_ALM === almacen);
    const codAlm = almacenSeleccionado ? almacenSeleccionado.COD_ALM : null;

    let stockEncontrado = null; 
    if (codArt && codAlm && dataExistencias) {
        const existenciaData = dataExistencias.find(ex => ex.COD_ALM === codAlm && ex.COD_ART === codArt);
        if (existenciaData) {
            stockEncontrado = parseFloat(existenciaData.EXISTENCIA).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 3 
            });
        }
    }
    setExistencia(stockEncontrado); 
    
  }, [producto, almacen, dataAlmacenes, dataExistencias]); // Añadidas dependencias

  // --- VALIDACIONES ---
  const isPlazaValid = dataPlazas.some((p) => p.NOM_PLAZA && p.NOM_PLAZA.toLowerCase() === plaza.toLowerCase());
  const isClientValid = dataClientes.some((c) => c.NOM_CTE && c.NOM_CTE.toLowerCase() === cliente.toLowerCase());
  const isAlmacenValid = almacen && sugerenciasAlmacen.some(a => a.NOM_ALM === almacen);
  const canAddCotizacion = producto && precio && parseFloat(cantidad) > 0 && isPlazaValid && isClientValid && isAlmacenValid;

  // --- HANDLERS ---
  const handleChangeCliente = (e) => {
    const valor = e.target.value;
    setCliente(valor);
    if (valor.length > 0 && typeof getUniqueClientNames === 'function') {
      const allNames = getUniqueClientNames();
      const filtrados = allNames.filter((c) => 
        c.NOM_CTE && c.NOM_CTE.toLowerCase().includes(valor.toLowerCase())
      );
      setSugerenciasCliente(filtrados);
    } else if (typeof getUniqueClientNames === 'function') {
      setSugerenciasCliente(getUniqueClientNames());
    }
  };

  const handleSelectCliente = (nombreCliente) => {
    setCliente(nombreCliente);
    setSugerenciasCliente([]);
    if (producto) {
      handleSelectProducto(producto, nombreCliente);
    }
  };

  const handleChangePlaza = (e) => {
    const valor = e.target.value;
    setPlaza(valor);
    if (valor.length > 0) {
      const filtrados = dataPlazas.filter((p) => 
        p.NOM_PLAZA && p.NOM_PLAZA.toLowerCase().includes(valor.toLowerCase())
      );
      setSugerenciasPlaza(filtrados);
    } else {
      setSugerenciasPlaza([]);
    }
  };

  const handleSelectPlaza = (nombrePlaza) => {
    setPlaza(nombrePlaza);
    setSugerenciasPlaza([]);
    if (producto) {
        const newPlazaId = dataPlazas.find(p => p.NOM_PLAZA && p.NOM_PLAZA.toLowerCase() === nombrePlaza.toLowerCase())?.PLAZA || "01";
        handleSelectProducto(producto, cliente, newPlazaId);
    }
  };

  const handleChangeProducto = (e) => {
    const valor = e.target.value;
    setProducto(valor);
    if (valor.length > 0) {
      const nombresUnicos = new Set();
      const filtradosConRepetidos = dataPrecios.filter((p) => 
        p.DESCRI && p.DESCRI.toLowerCase().includes(valor.toLowerCase())
      );
      const sugerenciasUnicas = filtradosConRepetidos.filter(p => {
          if (p && p.DESCRI && !nombresUnicos.has(p.DESCRI)) {
              nombresUnicos.add(p.DESCRI);
              return true;
          }
          return false;
      }).map(p => ({ DESCRI: p.DESCRI }));
      setSugerencias(sugerenciasUnicas);
    } else {
      setSugerencias([]);
    }
  };

  const getBasePrice = (nombre, plazaId) => {
    const nombreLower = nombre.toLowerCase();
    let productoConPrecio = dataPrecios.find((p) => 
      p.DESCRI && p.DESCRI.toLowerCase() === nombreLower && 
      p.PLAZA === plazaId
    );
    if (!productoConPrecio && plazaId !== "01") {
      productoConPrecio = dataPrecios.find((p) => 
        p.DESCRI && p.DESCRI.toLowerCase() === nombreLower && 
        p.PLAZA === "01" 
      );
    }
    if (!productoConPrecio) {
      productoConPrecio = dataPrecios.find((p) => 
        p.DESCRI && p.DESCRI.toLowerCase() === nombreLower
      );
    }
    return productoConPrecio ? parseFloat(productoConPrecio.PVTA_V1) : null;
  }

  const handleSelectProducto = (nombre, currentCliente = cliente, currentPlazaId = selectedPlazaId) => {
    setProducto(nombre);
    setSugerencias([]);
    const basePrice = getBasePrice(nombre, currentPlazaId);
    if (basePrice === null) {
        setPrecio("");
        return;
    }
    let finalPrice = basePrice;
    const codArt = (typeof getProductCodeByDescri === 'function') ? getProductCodeByDescri(nombre) : null;
    const isCurrentClientValid = dataClientes.some(
        (c) => c.NOM_CTE && c.NOM_CTE.toLowerCase() === currentCliente.toLowerCase()
    );
    if (isCurrentClientValid && codArt) {
        const ventaHistorica = dataClientes.find(c => 
            c.NOM_CTE && c.NOM_CTE.toLowerCase() === currentCliente.toLowerCase() && 
            c.COD_ART === codArt
        );
        if (ventaHistorica) {
            const historicalPrice = parseFloat(ventaHistorica.PRECIO);
            finalPrice = Math.max(basePrice, historicalPrice);
        }
    }
    setPrecio(finalPrice.toFixed(2).toString());
  };
  
  const subtotalGeneral = cotizaciones.reduce((acc, c) => acc + (c.subtotal || 0), 0);
  const impuestosGenerales = cotizaciones.reduce((acc, c) => acc + (c.impuestos || 0), 0);
  const totalGeneral = cotizaciones.reduce((acc, c) => acc + (c.total || 0), 0);

  const agregarCotizacion = () => {
    if (!canAddCotizacion) return;
    const subtotal = parseFloat(precio) * parseFloat(cantidad);
    const impuestos = (subtotal * parseFloat(iva)) / 100;
    const total = subtotal + impuestos;
    const nueva = {
      COD_ART: Date.now(),
      DESCRI: producto,
      precio: parseFloat(precio),
      cantidad: parseFloat(cantidad),
      unidad,
      iva: parseFloat(iva),
      subtotal,
      impuestos,
      total,
      almacen: almacen, 
      existencia: existencia 
    };
    setCotizaciones([...cotizaciones, nueva]);
    setProducto(""); 
    setPrecio("");
    setCantidad("1");
    setUnidad("piezas");
  };

  const eliminarCotizacion = (COD_ART) => {
    setCotizaciones(cotizaciones.filter((c) => c.COD_ART !== COD_ART));
  };
  
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Cotización", 14, 20);
    doc.setFontSize(12);
    doc.text(`Plaza: ${plaza}`, 14, 25);
    doc.text(`Cliente: ${cliente}`, 14, 30);
    doc.text(`Almacén: ${almacen}`, 14, 35); 
    const columnas = ["Plaza", "Almacén", "Producto", "Existencia", "Cantidad", "Precio Unitario", "IVA %", "Total"]; 
    const filas = cotizaciones.map((c) => [
      plaza, 
      c.almacen, 
      c.DESCRI,
      c.existencia ?? 'N/A', 
      `${c.cantidad} ${c.unidad}`,
      `$${c.precio.toFixed(2)}`,
      `${c.iva}%`,
      `$${c.total.toFixed(2)}`,
    ]);
    autoTable(doc, { head: [columnas], body: filas, startY: 45 }); 
    const finalY = doc.lastAutoTable.finalY || 50;
    doc.text(`Subtotal: $${subtotalGeneral.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Impuestos (IVA): $${impuestosGenerales.toFixed(2)}`, 14, finalY + 20);
    doc.text(`TOTAL A PAGAR: $${totalGeneral.toFixed(2)}`, 14, finalY + 30);
    doc.save(`cotizacion_${plaza.replace(/\s/g, '_')}_${cliente.replace(/\s/g, '_')}.pdf`);
  };

  const exportarExcel = () => {
    const dataExport = cotizaciones.map((c) => ({
      Plaza: plaza,
      Almacén: c.almacen, 
      Cliente: cliente,
      Producto: c.DESCRI,
      Existencia: c.existencia ?? 'N/A', 
      Cantidad: `${c.cantidad} ${c.unidad}`,
      "Precio Unitario": c.precio,
      "IVA %": c.iva,
      Subtotal: c.subtotal,
      Impuestos: c.impuestos,
      Total: c.total,
    }));
    dataExport.push({ 
      Plaza: "TOTALES", Almacén: "", Cliente: "", Producto: "----", Existencia: "", 
      Cantidad: "", "Precio Unitario": "", "IVA %": "", Subtotal: subtotalGeneral, Impuestos: impuestosGenerales, Total: totalGeneral,
    });
    const hoja = XLSX.utils.json_to_sheet(dataExport);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Cotización");
    XLSX.writeFile(libro, `cotizacion_${plaza.replace(/\s/g, '_')}_${cliente.replace(/\s/g, '_')}.xlsx`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        backgroundColor: "#1e1e1e",
      }}
    >
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#222",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "800px",
          overflowY: 'auto', 
          maxHeight: '90vh' 
        }}
      >
        <h1 style={{ color: "white", marginBottom: "25px" }}>
          Gestor de Cotizaciones
        </h1>

        <CotizacionForm
          cliente={cliente}
          sugerenciasCliente={sugerenciasCliente}
          handleSelectCliente={handleSelectCliente}
          handleChangeCliente={handleChangeCliente}
          isClientValid={isClientValid}
          plaza={plaza}
          setPlaza={setPlaza}
          sugerenciasPlaza={sugerenciasPlaza}
          handleSelectPlaza={handleSelectPlaza}
          handleChangePlaza={handleChangePlaza}
          isPlazaValid={isPlazaValid}
          almacen={almacen}
          setAlmacen={setAlmacen}
          sugerenciasAlmacen={sugerenciasAlmacen}
          isAlmacenValid={isAlmacenValid}
          producto={producto}
          setProducto={setProducto}
          sugerencias={sugerencias}
          handleSelectProducto={handleSelectProducto}
          handleChangeProducto={handleChangeProducto}
          existencia={existencia} 
          precio={precio}
          setPrecio={setPrecio}
          cantidad={cantidad}
          setCantidad={setCantidad}
          unidad={unidad}
          setUnidad={setUnidad}
          iva={iva}
          setIva={setIva}
          agregarCotizacion={agregarCotizacion}
          canAddCotizacion={canAddCotizacion}
        />

        <CotizacionTable
          cotizaciones={cotizaciones}
          plaza={plaza}
          cliente={cliente} 
          almacen={almacen} 
          eliminarCotizacion={eliminarCotizacion}
          subtotalGeneral={subtotalGeneral}
          impuestosGenerales={impuestosGenerales}
          totalGeneral={totalGeneral}
          exportarPDF={exportarPDF}
          exportarExcel={exportarExcel}
        />
      </div>
    </div>
  );
}

