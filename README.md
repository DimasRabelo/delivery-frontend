🚚 DeliveryTech Frontend 💻
Este repositório contém a aplicação Single Page Application (SPA) desenvolvida em React e TypeScript. 
Seu objetivo principal é servir como a interface de usuário completa e o cliente de testes para a API de Delivery (o repositório delivery-api).

A aplicação está em desenvolvimento, mas já inclui a estrutura de autenticação e roteamento necessária para clientes, restaurantes e entregadores.

🚀 Tecnologias Utilizadas
Framework: React (v18+)

Linguagem: TypeScript

Roteamento: React Router DOM (v6+)

Gerenciamento de Estado/Sessão: React Context API (Auth, Carrinho, Contador de Pedidos)

Servidor Web no Container: Nginx (para servir a aplicação e roteamento SPA)

Comunicação: fetch ou Axios para consumir endpoints REST (API).

🛠️ Como Iniciar o Ambiente Completo (API + Frontend)
Para que esta aplicação React funcione, ela requer o serviço de Backend (delivery-api) em execução. A maneira mais fácil de iniciar a stack completa é usando o Docker Compose, que está configurado no repositório da API.

1. Estrutura de Pastas Necessária
É CRÍTICO que o repositório da API e este repositório do Frontend estejam no mesmo diretório de nível superior.

/seu_diretorio_de_projetos/
├── delivery-api/        <-- Contém o Docker Compose
└── delivery-frontend/   <-- ESTE REPOSITÓRIO (Contém o Dockerfile do React)
2. Clonagem e Inicialização
Siga estes passos para iniciar o ambiente multi-contêiner:

Clone os Repositórios: (Execute na pasta /seu_diretorio_de_projetos/):

Bash

git clone [https://docs.github.com/pt/rest delivery-api](https://github.com/DimasRabelo/delivery-api.git)

git clone https://www.teses.usp.br/ delivery-frontend
Inicie os Serviços: Vá para a pasta da API e inicie a orquestração.

Bash

cd delivery-api
docker compose up --build -d
Resultado: O Docker Compose construirá a API Java, o Frontend React/Nginx, iniciará o MySQL e o Redis. A aplicação estará acessível em: http://localhost.

🧭 Roteamento e Funcionalidades (SPA)
A aplicação utiliza roteamento baseado em permissões (Role-Based Access Control - RBAC) e está configurada para lidar com os desafios típicos de Single Page Applications (SPA).

1. Roteamento de Perfil
O projeto usa Guards de Rota para direcionar os usuários para suas áreas específicas imediatamente após o login:

/entregador/painel: Protegida via EntregadorRoute.

/admin/pedidos: Protegida via RestauranteRoute.

/meus-pedidos, /meu-perfil, etc.: Protegidas via ProtectedRoute (apenas logado).

2. Correção UX (Botão Voltar/F5)
Para garantir uma navegação fluida para usuários logados, a rota principal (/) utiliza o componente RoleRoute. Este componente:

Impede o Redirecionamento: Resolve problemas de recarregamento (F5) e o botão Voltar que levavam o usuário logado para a Home Page do cliente.

Redireciona: Se o usuário é um Entregador ou Restaurante, ele é imediatamente redirecionado para seu painel de acesso (/entregador/painel ou /admin/pedidos), garantindo que a Home Page (vista na imagem) só seja acessada por clientes ou usuários deslogados.

⚙️ Estrutura do Projeto (TypeScript/React)
Esta é a estrutura de pastas do projeto (utilize esta seção para referência rápida):

Plaintext

📦src
 ┣ 📂components      <-- Componentes reutilizáveis e as Guardas de Rota (RoleRoute, ProtectedRoute)
 ┣ 📂context         <-- Provedores de estado global (Auth, Cart, PedidoCount)
 ┣ 📂hooks           <-- Hooks customizados (useAuth, useCart)
 ┣ 📂pages           <-- Componentes de página (rotas)
 ┣ 📜App.tsx         <-- Configuração central de rotas
 ┣ 📜main.tsx        <-- Inicialização do React (inclui BrowserRouter)
 ┗ 📜...
