import os
import pandas as pd

data_dir = "data/"  # Caminho do diretório de origem
compras_dir = "data/compras/"  # Diretório para 'Compras'
vendas_dir = "data/vendas/"    # Diretório para 'Vendas'

# Cria as pastas se não existirem
os.makedirs(compras_dir, exist_ok=True)
os.makedirs(vendas_dir, exist_ok=True)

# Definir os cabeçalhos que você deseja alocar para os arquivos CSV
headers = [
    "mes_referencia", "estado_origem", "codigo_ibge_municipio_origem", 
    "estado_destino", "codigo_ibge_municipio_destino", "cnae", "descricao_cnae",
    "ncm", "cfop", "total_bruto", "icms"
]

# Percorre todas as pastas e arquivos dentro do diretório
for root, dirs, files in os.walk(data_dir):
    for file in files:
        if file.endswith(".txt"):  # Processa apenas arquivos .txt
            file_path = os.path.join(root, file)  # Caminho completo do arquivo
            df = pd.read_csv(file_path, delimiter="\t", header=None)

            # Aloca os cabeçalhos ao DataFrame
            df.columns = headers

            # Remove a extensão .txt e adiciona .csv
            base_name = os.path.splitext(file)[0]  # Retorna o nome sem a extensão
            csv_file_name = base_name + ".csv"     # Novo nome com .csv

            # Condição para determinar a pasta (exemplo: baseado no nome do arquivo)
            if "compra" in file.lower():  # Se "compra" estiver no nome do arquivo
                new_path = os.path.join(compras_dir, csv_file_name)
            else:  # Caso contrário, envia para "Vendas"
                new_path = os.path.join(vendas_dir, csv_file_name)

            # Salva o arquivo na pasta correta
            df.to_csv(new_path, index=False, header=True)
            
            print(f"Convertido: {file_path} -> {new_path}")
