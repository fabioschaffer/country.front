Aplicação web para listar e editar países.

Arquitetura:

- Utilização da biblioteca React.js (17.0.2).
- Aplicação criada via create-react-app.
- Utilização do pacote react-router-dom (5.2.0) para navegação entre componentes.
- Configuração das variáveis de ambiente centralizada no arquivo .env.
- Utilizada a API Graph Countries para obtenção dos dados dos países.

Backend:

- Utilizado o backend country.back (https://github.com/fabioschaffer/country.back) para salvar as edições feitas nos países.

Publicação:

- Aplicação está publicada no Azure em http://countryapplication.azurewebsites.net.

Ambiente de desenvolvimento:

- Foi utilizado o Microsoft Visual Studio Code (1.54.3).

Executar a aplicação:

- Para executar a aplicação, abrir a pasta no Visual Studio Code.
- Caso deseje rodar o backend localmente, alterar o endpoint no arquivo .env, chave REACT_APP_EDIT_URL.
- Executar o comando 'npm start'. Necessário ter o NodeJs instalado.
