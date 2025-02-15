import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(176, 183, 190);
  height: auto;
  width: 100vw;
`;

export const MainContent = styled.div`
  padding: 3%;
  width: 60%;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  background-color: #194a7a;
  color: white;
  border-radius: 8px;
  align-items: center;
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const Card = styled.div`
  background-color: ${(props) => props.bgColor || '#ffffff'};
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const ChartCardBarPlot = styled.div`
  background: rgba(128, 133, 148, 0.1);
  grid-row: ${(props) =>
    props.gridRow || 'auto'}; // Linha definida por parâmetro
  grid-column: ${(props) =>
    props.gridColumn || 'auto'}; // Coluna definida por parâmetro
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
export const ChartCardVerticalBarPlot = styled.div`
  background: rgba(128, 133, 148, 0.1);
  grid-row: ${(props) =>
    props.gridRow || 'auto'}; // Linha definida por parâmetro
  grid-column: ${(props) =>
    props.gridColumn || 'auto'}; // Coluna definida por parâmetro
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(219, 60, 60, 0.1);
`;
export const ChartCardLinePlot = styled.div`
  background: rgba(128, 133, 148, 0.1);
  grid-row: ${(props) =>
    props.gridRow || 'auto'}; // Linha definida por parâmetro
  grid-column: ${(props) =>
    props.gridColumn || 'auto'}; // Coluna definida por parâmetro
  padding: 20px;
  padding-right: 90px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(180, 2, 100, 0.1);
`;

export const ChartCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(400px, 1fr));
  grid-template-rows: repeat(4, minmax(150px, auto));
  gap: 20px;
  background: white;
  padding: 20px;
  align-items: stretch;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Title = styled.h1`
  font-family:
    'Lucida' Grande,
    sans-serif;
  text-align: center;
  font-size: 50px;
`;

export const TitleQuestion = styled.h6`
  margin: 0px;
  font-family:
    'Lucida' Grande,
    sans-serif;
  text-align: center;
  font-size: 30px;
`;
