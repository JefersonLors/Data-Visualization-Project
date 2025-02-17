import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContainer,
  ChartCardBarPlot,
  ChartCardLinePlot,
  ChartCardContainer,
  ChartCardVerticalBarPlot,
  ChartCardScatterPlot,
  ChartCardPizzaPlot,
  DashboardContainer,
  Header,
  MainContent,
  Title,
  TitleQuestion,
} from './styles';

import VerticalBarPlot from './Componentes/graficos/BarrasVerticais/VerticalBarPlot';
import HorizontalBarPlot from './Componentes/graficos/BarrasHorizontais/HorizontalBarPlot';
import LinePlot from './Componentes/graficos/Linhas/LinePlot';
import PizzaPlot from './Componentes/graficos/Pizza/PizzaPlot';
import ScatterPlot from './Componentes/graficos/Dispersão/ScatterPlot';


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

  const [comprasTotalBruto, setComprasTotalBruto] = useState([]);
  const [vendasTotalBruto, setVendasTotalBruto] = useState([]);
  const [cnaesFrequentes, setCnaesFrequentes] = useState([]);
  const [estadosICMS, setEstadosICMS] = useState([]);
  const [municipiosICMS, setMunicipiosICMS] = useState([]);
  const [topMunicipiosVendasECompras, setTopMunicipiosVendasECompras] = useState([]);

  useEffect(() => {
    async function loadCSVFiles(files) {
      const csvDataArray = await Promise.all(files.map((file) => d3.csv(file)));
      return csvDataArray;
    }

    async function sumData(csvData, column) {
      const sumTotalBruto = csvData.reduce(
        (acc, d) => acc + (+d[column] || 0),
        0
      );
      return sumTotalBruto;
    }

    function accumulateICMSAndStates(csvData, tipo) {
      let estados = {};
      let icmsTotal = 0;

      csvData.forEach((d) => {
        const estadoOrigem =
          tipo === 'compras' ? d.estado_origem : d.estado_destino;
        const icms = +d.icms || 0;

        if (!estados[estadoOrigem]) {
          estados[estadoOrigem] = { count: 0, icmsTotal: 0 };
        }
        estados[estadoOrigem].count += 1;
        estados[estadoOrigem].icmsTotal += icms;
        icmsTotal += icms;
      });

      return { estados, icmsTotal };
    }

    async function loadData() {
      try {
        const compraData = await loadCSVFiles(comprasFiles);
        const vendaData = await loadCSVFiles(vendasFiles);

        const totaisBrutosCompras = await Promise.all(
          compraData.map((data) => sumData(data, 'total_bruto'))
        );
        const totaisBrutosVendas = await Promise.all(
          vendaData.map((data) => sumData(data, 'total_bruto'))
        );

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

        const sortedEstados = Object.keys(combinedEstados)
          .map((estado) => ({
            estado,
            ...combinedEstados[estado],
          }))
          .sort(
            (a, b) =>
              b.icmsCompras + b.icmsVendas - (a.icmsCompras + a.icmsVendas)
          );

        const limit = 10; 
        const limitedEstados = sortedEstados.slice(0, limit);

        
        const allCompras = compraData.flat();
        const totalCompras = allCompras.length;
        const comprasCnaesCount = {};

        allCompras.forEach(d => {
          const cnae = d.cnae;
          const descricao = d.descricao_cnae;
          if (cnae) {
            if (!comprasCnaesCount[cnae]) {
              comprasCnaesCount[cnae] = {
                count: 0,
                descricao: descricao || "Descrição não disponível",
              };
            }
            comprasCnaesCount[cnae].count++;
          }
        });

        const comprasCnaesArray = Object.entries(comprasCnaesCount)
          .map(([cnae, dados]) => ({
            cnae,
            descricao: dados.descricao,
            porcentagem: Number(((dados.count / totalCompras) * 100).toFixed(2))
          }))
          .sort((a, b) => b.porcentagem - a.porcentagem)
          .slice(0, 5);

        const allVendas = vendaData.flat();
        const totalVendas = allVendas.length;
        const vendasCnaesCount = {};

        allVendas.forEach(d => {
          const cnae = d.cnae;
          const descricao = d.descricao_cnae;
          
          if (cnae) {
            if (!vendasCnaesCount[cnae]) {
              vendasCnaesCount[cnae] = {
                count: 0,
                descricao: descricao || "Descrição não disponível",
              };
            }
            vendasCnaesCount[cnae].count++;
          }
        });

        const vendasCnaesArray = Object.entries(vendasCnaesCount)
          .map(([cnae, dados]) => ({
            cnae,
            descricao: dados.descricao,
            porcentagem: Number(((dados.count / totalVendas) * 100).toFixed(2))
          }))
          .sort((a, b) => b.porcentagem - a.porcentagem)
          .slice(0, 5);

        
        const cnaesArray = [...comprasCnaesArray, ...vendasCnaesArray];

        const top5 = cnaesArray.slice(0, 5);
        const somaTop5 = top5.reduce((acc, curr) => acc + curr.porcentagem, 0);
        
        const outros = {
          cnae: null,
          descricao: "Outros",
          porcentagem: Number((100 - somaTop5).toFixed(2))
        };

        const cnaesFrequentes = [...top5, outros];

        let combinedMunicipios = {}; 

        async function fetchMunicipioNome(codigoIBGE) {
          try {
            const response = await fetch(
              `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${codigoIBGE}?orderBy=nome`
            );
            if (!response.ok) throw new Error(`Erro ao buscar município ${codigoIBGE}`);
        
            const data = await response.json();
            return data.nome;
          } catch (error) {
            console.error(`Erro ao obter nome do município ${codigoIBGE}:`, error);
            return codigoIBGE;
          }
        }
        
        function accumulateICMSByMunicipality(csvData) {
          let municipios = {};
        
          csvData.forEach((d) => {
            const municipioOrigem = d.codigo_ibge_municipio_origem;
            const municipioDestino = d.codigo_ibge_municipio_destino;
            const icms = +d.icms || 0;
        
            if (municipioOrigem) {
              if (!municipios[municipioOrigem]) {
                municipios[municipioOrigem] = 0;
              }
              municipios[municipioOrigem] += icms;
            }
        
            if (municipioDestino) {
              if (!municipios[municipioDestino]) {
                municipios[municipioDestino] = 0;
              }
              municipios[municipioDestino] += icms;
            }
          });
        
          return municipios;
        }
        
        [compraData, vendaData].forEach((dataSet) => {
          dataSet.forEach((data) => {
            const municipios = accumulateICMSByMunicipality(data);
        
            Object.keys(municipios).forEach((municipio) => {
              if (!combinedMunicipios[municipio]) {
                combinedMunicipios[municipio] = 0;
              }
              combinedMunicipios[municipio] += municipios[municipio];
            });
          });
        });
        
        async function convertAndSetMunicipios() {
          const sortedMunicipios = Object.keys(combinedMunicipios)
            .map((municipio) => ({
              codigoIBGE: municipio,
              icmsTotal: combinedMunicipios[municipio],
            }))
            .sort((a, b) => b.icmsTotal - a.icmsTotal);
        
          const topMunicipios = sortedMunicipios.slice(0, 10);
        
          const municipiosComNomes = await Promise.all(
            topMunicipios.map(async ({ codigoIBGE, icmsTotal }) => {
              const nome = await fetchMunicipioNome(codigoIBGE);
              return { municipio: nome, icmsTotal };
            })
          );
        
          setMunicipiosICMS(municipiosComNomes);
        }
        
        const Compras = compraData.flat();
        const Vendas = vendaData.flat();

        const municipiosTotais = {};

        Compras.forEach(d => {
          const municipio = d.codigo_ibge_municipio_destino;
          const totalBruto = +d.total_bruto || 0;
          if (municipio) {
            if (!municipiosTotais[municipio]) {
              municipiosTotais[municipio] = { compras: 0, vendas: 0 };
            }
            municipiosTotais[municipio].compras += totalBruto;
          }
        });

        Vendas.forEach(d => {
          const municipio = d.codigo_ibge_municipio_origem; 
          const totalBruto = +d.total_bruto || 0;
          if (municipio) {
            if (!municipiosTotais[municipio]) {
              municipiosTotais[municipio] = { compras: 0, vendas: 0 };
            }
            municipiosTotais[municipio].vendas += totalBruto;
          }
        });

        const municipiosArray = Object.entries(municipiosTotais).map(([codigo, totais]) => ({
          codigo,
          compras: totais.compras,
          vendas: totais.vendas,
        }));

        const topVendas = [...municipiosArray]
          .sort((a, b) => b.vendas - a.vendas)

        const topCompras = [...municipiosArray]
          .sort((a, b) => b.compras - a.compras)

        const combinedTopMunicipios = [...topVendas, ...topCompras];

        const municipiosUnicos = Array.from(
          new Map(combinedTopMunicipios.map(item => [item.codigo, item])).values()
        );

        const municipiosComNomes = await Promise.all(
          municipiosUnicos.map(async (municipio) => {
            const nome = await fetchMunicipioNome(municipio.codigo);
            return {
              ...municipio,
              nome,
            };
          })
        );

        setTopMunicipiosVendasECompras(municipiosComNomes);


        convertAndSetMunicipios();
        setComprasTotalBruto(totaisBrutosCompras);
        setVendasTotalBruto(totaisBrutosVendas);
        setEstadosICMS(limitedEstados);
        setCnaesFrequentes(cnaesFrequentes);

      } catch (error) {
        console.error('Erro ao carregar os arquivos CSV:', error);
      }
    }

    loadData(); 
  }, []);

  return (
    <DashboardContainer>
      <MainContent>
        <Header>
          <Title>Relatório de Notas Fiscais 2019.1</Title>
        </Header>
        <CardContainer>
          <Card bgColor="#7593af">150 Orders</Card>
          <Card bgColor="#7593af">53% Bounce Rate</Card>
          <Card bgColor="#7593af">44 User Registrations</Card>
          <Card bgColor="#7593af">65 Unique Visitors</Card>
        </CardContainer>
        <ChartCardContainer>
          <ChartCardVerticalBarPlot gridRow="1 / 1" gridColumn="1 / 2">
            <TitleQuestion>
              Qual a distribuição do ICMS entre os diferentes estados nas
              compras e vendas?
            </TitleQuestion>
            <VerticalBarPlot data={estadosICMS} height={300} width={450} />
          </ChartCardVerticalBarPlot>
          <ChartCardLinePlot gridRow="1 / 1" gridColumn="2 / 3">
            <TitleQuestion>
              Qual foi a evolução mensal do total bruto de compras e vendas?
            </TitleQuestion>
            <LinePlot
              compras={comprasTotalBruto}
              vendas={vendasTotalBruto}
              valoresx={[
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
              ]}
              height={300}
              width={500}
            />
          </ChartCardLinePlot>
          <ChartCardPizzaPlot gridRow="2 / 2" gridColumn="1/3">
            <TitleQuestion>
            Quais são os CNAEs mais comuns em compras e vendas no estado da Bahia?
            </TitleQuestion>
            <PizzaPlot data={cnaesFrequentes} height={300} width={1000} />
          </ChartCardPizzaPlot>
          <ChartCardBarPlot gridRow="3 / 3" gridColumn="1 / 2">
            <TitleQuestion>
            Qual os principais municípios na arrecadação de ICMS nas compras e vendas?
            </TitleQuestion>
            <HorizontalBarPlot data={municipiosICMS} height={300} width={450} />
          </ChartCardBarPlot>
          <ChartCardScatterPlot gridRow="3 / 3" gridColumn="2 / 2">
            <TitleQuestion>
            Os municípios que mais vendem são os que mais compram?
            </TitleQuestion>
            <ScatterPlot data={topMunicipiosVendasECompras} height={300} width={450} />
          </ChartCardScatterPlot>
        </ChartCardContainer>
      </MainContent>
    </DashboardContainer>
  );
}

export default App;
