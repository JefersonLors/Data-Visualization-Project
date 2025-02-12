import './App.css';
import * as d3 from "d3";
import { useState, useEffect } from "react";
import LinePlot from './LinePlot';

function App() {
  const compras = [
    'data/compras/Compra_2019_01.csv',
    'data/compras/Compra_2019_02.csv',
    'data/compras/Compra_2019_03.csv',
    'data/compras/Compra_2019_04.csv',
    'data/compras/Compra_2019_05.csv',
    'data/compras/Compra_2019_06.csv'
  ];
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
  
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const values = await Promise.all(compras.map(async (file) => {
          const csvData = await d3.csv(file);
          const sumIcms = csvData.reduce((acc, d) => acc + (+d.icms || 0), 0);
          return sumIcms;
        }));
        setData(values);
      } catch (error) {
        console.error("Erro ao carregar os arquivos CSV:", error);
      }
    }

    loadData();
    
  }, []);

  
  

  return (
    <>
      <h1>Gráfico de ICMS por Mês</h1>
      <LinePlot data={data} valoresx={meses} />
    </>
  );
}

export default App;
