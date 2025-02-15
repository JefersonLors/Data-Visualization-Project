import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import './App.css';

import VerticalBarPlot from './Componentes/graficos/BarrasVerticais/VerticalBarPlot';
import LinePlot from './Componentes/graficos/Linhas/LinePlot';

function App() {
  const comprasFiles = [
    'data/compras/Compra_2019_01.csv',
    'data/compras/Compra_2019_02.csv',
    'data/compras/Compra_2019_03.csv',
    'data/compras/Compra_2019_04.csv',
    'data/compras/Compra_2019_05.csv',
    'data/compras/Compra_2019_06.csv',
  ];

  const vendasFiles = [
    'data/vendas/Venda_2019_01.csv',
    'data/vendas/Venda_2019_02.csv',
    'data/vendas/Venda_2019_03.csv',
    'data/vendas/Venda_2019_04.csv',
    'data/vendas/Venda_2019_05.csv',
    'data/vendas/Venda_2019_06.csv',
  ];
  //const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

  const [comprasTotalBruto, setComprasTotalBruto] = useState([]);
  const [vendasTotalBruto, setVendasTotalBruto] = useState([]);
  const [comprasIcms, setComprasIcms] = useState([]);
  const [vendasIcms, setVendasIcms] = useState([]);
  // const [comprasEstadosOrigem, setComprasEstadosOrigem] = useState([]);
  // const [vendasEstadosOrigem, setVendasEstadosOrigem] = useState([]);
  // const [comprasEstadosDestino, setComprasEstadosDestino] = useState([]);
  // const [vendasEstadosDestino, setVendasEstadosDestino] = useState([]);
  const [estadosICMS, setEstadosICMS] = useState([]);

  useEffect(() => {
    // Função para carregar os arquivos CSV
    async function loadCSVFiles(files) {
      const csvDataArray = await Promise.all(files.map((file) => d3.csv(file)));
      return csvDataArray;
    }

    // Função para calcular a soma
    async function sumData(csvData, column) {
      const sumTotalBruto = csvData.reduce(
        (acc, d) => acc + (+d[column] || 0),
        0
      );
      return sumTotalBruto;
    }

    // Função para acumular ICMS e estados
    function accumulateICMSAndStates(csvData, tipo) {
      let estados = {};
      let icmsTotal = 0;

      csvData.forEach((d) => {
        const estadoOrigem =
          tipo === 'compras' ? d.estado_origem : d.estado_destino;
        const icms = +d.icms || 0;

        // Acumula o ICMS e o estado de origem/destino
        if (!estados[estadoOrigem]) {
          estados[estadoOrigem] = { count: 0, icmsTotal: 0 };
        }
        estados[estadoOrigem].count += 1;
        estados[estadoOrigem].icmsTotal += icms;
        icmsTotal += icms;
      });

      return { estados, icmsTotal };
    }

    // Função principal para carregar e armazenar os dados
    async function loadData() {
      try {
        // Carregar os arquivos de compras e vendas uma vez
        const compraData = await loadCSVFiles(comprasFiles);
        const vendaData = await loadCSVFiles(vendasFiles);

        // Calcular os totais brutos para cada arquivo de compras e vendas
        const totaisBrutosCompras = await Promise.all(
          compraData.map((data) => sumData(data, 'total_bruto'))
        );
        const totaisBrutosVendas = await Promise.all(
          vendaData.map((data) => sumData(data, 'total_bruto'))
        );

        // Acumular ICMS e estados para compras e vendas
        const comprasEstados = [];
        const vendasEstados = [];
        let comprasICMSTotal = 0;
        let vendasICMSTotal = 0;

        compraData.forEach((data) => {
          const { estados, icmsTotal } = accumulateICMSAndStates(
            data,
            'compras'
          );
          comprasEstados.push(estados);
          comprasICMSTotal += icmsTotal;
        });

        vendaData.forEach((data) => {
          const { estados, icmsTotal } = accumulateICMSAndStates(
            data,
            'vendas'
          );
          vendasEstados.push(estados);
          vendasICMSTotal += icmsTotal;
        });

        // Combina os estados das compras e vendas
        const combinedEstados = {};
        comprasEstados.forEach((estados) => {
          Object.keys(estados).forEach((estado) => {
            if (!combinedEstados[estado]) {
              combinedEstados[estado] = {
                compras: 0,
                vendas: 0,
                icmsCompras: 0,
                icmsVendas: 0,
              };
            }
            combinedEstados[estado].compras += estados[estado].count;
            combinedEstados[estado].icmsCompras += estados[estado].icmsTotal;
          });
        });

        vendasEstados.forEach((estados) => {
          Object.keys(estados).forEach((estado) => {
            if (!combinedEstados[estado]) {
              combinedEstados[estado] = {
                compras: 0,
                vendas: 0,
                icmsCompras: 0,
                icmsVendas: 0,
              };
            }
            combinedEstados[estado].vendas += estados[estado].count;
            combinedEstados[estado].icmsVendas += estados[estado].icmsTotal;
          });
        });

        // Ordenar os estados por compras e vendas (ou ICMS) em ordem decrescente
        const sortedEstados = Object.keys(combinedEstados)
          .map((estado) => ({
            estado,
            ...combinedEstados[estado],
          }))
          .sort(
            (a, b) =>
              b.icmsCompras + b.icmsVendas - (a.icmsCompras + a.icmsVendas)
          );

        // Limitar o número de estados, caso necessário
        const limit = 10; // Você pode passar esse valor para controlar o limite de estados
        const limitedEstados = sortedEstados.slice(0, limit);

        // Atualizar estados e totais
        setComprasTotalBruto(totaisBrutosCompras);
        setVendasTotalBruto(totaisBrutosVendas);
        setComprasIcms(comprasICMSTotal);
        setVendasIcms(vendasICMSTotal);
        setEstadosICMS(limitedEstados);
      } catch (error) {
        console.error('Erro ao carregar os arquivos CSV:', error);
      }
    }

    loadData(); // Chama a função para carregar os dados
  }, []);

  return (
    <>
      <h2>Qual foi a evolução mensal do total bruto de compras e vendas?</h2>
      <LinePlot
        compras={comprasTotalBruto}
        vendas={vendasTotalBruto}
        valoresx={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho']}
      />
      <h2>
        Qual a distribuição do ICMS entre os diferentes estados nas compras e
        vendas?
      </h2>
      <VerticalBarPlot data={estadosICMS} />
    </>
  );
}

export default App;
