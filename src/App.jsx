import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContainer,
  ChartCardBarPlot,
  ChartCardContainer,
  ChartCardVerticalBarPlot,
  ChartCardPizzaPlot,
  DashboardContainer,
  Header,
  MainContent,
  Title,
  TitleQuestion,
} from './styles';

import VerticalBarPlot from './Componentes/graficos/BarrasVerticais/VerticalBarPlot';
import LinePlot from './Componentes/graficos/Linhas/LinePlot';
import PizzaPlot from './Componentes/graficos/Pizza/PizzaPlot';
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
  const [cnaesFrequentes, setCnaesFrequentes] = useState([]);
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

        const limit = 10; // Você pode passar esse valor para controlar o limite de estados
        const limitedEstados = sortedEstados.slice(0, limit);

        
        const allCompras = compraData.flat();
        const totalCompras = allCompras.length;
        const comprasCnaesCount = {};

        allCompras.forEach(d => {
          const cnae = d.cnae;
          const descricao = d.descricao_cnae; // Supondo que a coluna existe
          
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

        // Processar CNAEs frequentes para vendas
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

        // Calcula a soma das porcentagens dos top 5 CNAEs
        const top5 = cnaesArray.slice(0, 5);
        const somaTop5 = top5.reduce((acc, curr) => acc + curr.porcentagem, 0);
        
        // Calcula o restante da porcentagem (Outros)
        const outros = {
          cnae: null,
          descricao: "Outros",
          porcentagem: Number((100 - somaTop5).toFixed(2))
        };

        const cnaesFrequentes = [...top5, outros];

        setComprasTotalBruto(totaisBrutosCompras);
        setVendasTotalBruto(totaisBrutosVendas);
        setEstadosICMS(limitedEstados);
        setCnaesFrequentes(cnaesFrequentes);

      } catch (error) {
        console.error('Erro ao carregar os arquivos CSV:', error);
      }
    }

    loadData(); // Chama a função para carregar os dados
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
          <ChartCardBarPlot gridRow="1 / 1" gridColumn="2 / 3">
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
          </ChartCardBarPlot>
          <ChartCardPizzaPlot gridRow="2 / 2" gridColumn="1/3">
            <TitleQuestion>
            Quais são os CNAEs mais comuns em compras e vendas no estado da Bahia?
            </TitleQuestion>
            <PizzaPlot data={cnaesFrequentes} height={300} width={1000} />
          </ChartCardPizzaPlot>
        </ChartCardContainer>
      </MainContent>
    </DashboardContainer>
  );
}

export default App;
