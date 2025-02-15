import './App.css';
import * as d3 from "d3";
import { useState, useEffect } from "react";
import LinePlot from './LinePlot';

function App() {
  const comprasFiles = [
    'data/compras/Compra_2019_01.csv',
    'data/compras/Compra_2019_02.csv',
    'data/compras/Compra_2019_03.csv',
    'data/compras/Compra_2019_04.csv',
    'data/compras/Compra_2019_05.csv',
    'data/compras/Compra_2019_06.csv'
  ];
  
  const vendasFiles = [
    'data/vendas/Venda_2019_01.csv',
    'data/vendas/Venda_2019_02.csv',
    'data/vendas/Venda_2019_03.csv',
    'data/vendas/Venda_2019_04.csv',
    'data/vendas/Venda_2019_05.csv',
    'data/vendas/Venda_2019_06.csv'
  ];
  
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
  
  const [comprasTotalBruto, setComprasTotalBruto] = useState([]);
  const [vendasTotalBruto, setVendasTotalBruto] = useState([]);

  const [comprasIcms, setComprasIcms] = useState([]);
  const [vendasIcms, setVendasIcms] = useState([]);

  const [comprasEstadosOrigem, setComprasEstadosOrigem] = useState([]);
  const [vendasEstadosOrigem, setVendasEstadosOrigem] = useState([]);

  const [comprasEstadosDestino, setComprasEstadosDestino] = useState([]);
  const [vendasEstadosDestino, setVendasEstadosDestino] = useState([]);

  useEffect(() => {
    async function loadData(files, setData, column) {
      try {
        const values = await Promise.all(files.map(async (file) => {
          const csvData = await d3.csv(file);
          const sumTotalBruto = csvData.reduce((acc, d) => acc + (+d[column] || 0), 0);
          return sumTotalBruto;
        }));
        setData(values);
      } catch (error) {
        console.error("Erro ao carregar os arquivos CSV:", error);
      }
    }

    loadData(comprasFiles, setComprasTotalBruto, "total_bruto");
    loadData(vendasFiles, setVendasTotalBruto, "total_bruto");
  }, []);
  
  return (
    <>
      <h2>Qual foi a evolução mensal do total bruto de compras e vendas?</h2>
      <LinePlot compras={comprasTotalBruto} vendas={vendasTotalBruto} valoresx={meses} />
    </>
  );
}

export default App;