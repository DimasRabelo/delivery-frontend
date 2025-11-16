
<h1>🚚 DeliveryTech Frontend 💻</h1>



Este repositório contém a aplicação Single Page Application (SPA) desenvolvida em React e TypeScript. 

Seu objetivo principal é servir como a interface de usuário completa e o cliente de testes para a API de Delivery (o repositório delivery-api).

A aplicação está em desenvolvimento, mas já inclui a estrutura de autenticação e roteamento necessária para clientes, restaurantes e entregadores.


<h2>🚀 Tecnologias Utilizadas</h2>


Framework: React (v18+)

Linguagem: TypeScript

Roteamento: React Router DOM (v6+)

Gerenciamento de Estado/Sessão: React Context API (Auth, Carrinho, Contador de Pedidos)

Servidor Web no Container: Nginx (para servir a aplicação e roteamento SPA)

Comunicação: fetch ou Axios para consumir endpoints REST (API).


<h2>🛠️ Como Iniciar o Ambiente Completo (API + Frontend)</h2>


Para que esta aplicação React funcione, ela requer o serviço de Backend (delivery-api) em execução. A maneira mais fácil de iniciar a stack completa é usando o Docker Compose, que está configurado no repositório da API.

1. Estrutura de Pastas Necessária
   
É CRÍTICO que o repositório da API e este repositório do Frontend estejam no mesmo diretório de nível superior.
```
/seu_diretorio_de_projetos/
├── delivery-api/        <-- Contém o Docker Compose
└── delivery-frontend/   <-- ESTE REPOSITÓRIO (Contém o Dockerfile do React)
2. Clonagem e Inicialização

Siga estes passos para iniciar o ambiente multi-contêiner:

Clone os Repositórios: (Execute na pasta /seu_diretorio_de_projetos/):


# Execute na sua pasta raiz de projetos
git clone https://github.com/DimasRabelo/delivery-api.git
git clone https://github.com/DimasRabelo/delivery-frontend.git
```


Inicie os Serviços: Vá para a pasta da API e inicie a orquestração.

Bash

cd delivery-api
```
docker compose up
```

Resultado: O Docker Compose construirá a API Java, o Frontend React/Nginx, iniciará o MySQL e o Redis. A aplicação estará acessível em: http://localhost.


<h2>🧭 Roteamento e Funcionalidades (SPA)</h2>


A aplicação utiliza roteamento baseado em permissões (Role-Based Access Control - RBAC) e está configurada para lidar com os desafios típicos de Single Page Applications (SPA).

Roteamento de Perfil

O projeto usa Guards de Rota para direcionar os usuários para suas áreas específicas imediatamente após o login:

/entregador/painel: Protegida via EntregadorRoute.

/admin/pedidos: Protegida via RestauranteRoute.

/meus-pedidos, /meu-perfil, etc.: Protegidas via ProtectedRoute (apenas logado).

<h2>🔑 Dados de Acesso Padrão (Senha: 123456)</h2>

O ambiente Docker é inicializado com os seguintes usuários para testes e desenvolvimento.

O ambiente Docker é inicializado com os seguintes usuários para testes e desenvolvimento.

Inteligência de Login: Para todos os perfis, exceto Restaurante, a aplicação detecta automaticamente a Role após o login e redireciona o usuário para o painel correto (ADMIN, CLIENTE, ENTREGADOR). A autenticação do Restaurante é tratada em um endpoint/página separado para fins de segregação.

Nota: A senha padrão para todos os usuários listados abaixo é 123456 (armazenada via hash BCrypt).
```
| Usuário                        | E-mail                            Role |

| Administrador |             admin@delivery.com                   | ADMIN |
| Cliente|                     joao@email.com                      | CLIENTE |
| Cliente Secundário |        maria@email.com                      | CLIENTE |
| Restaurante Padrão |        pizza@palace.com                    | RESTAURANTE |
| Restaurante Secundário |     burger@king.com                    | RESTAURANTE |
| Entregador |                carlos@entrega.com                  | ENTREGADOR  |
```
⚠️ Observação: O Painel do Administrador (admin@delivery.com) ainda está em fase de implementação. Você conseguirá logar com sucesso, mas a página correspondente (a view) estará em branco ou incompleta.


<h2>⚙️ Estrutura do Projeto (TypeScript/React)</h2>

Esta é a estrutura de pastas do projeto (utilize esta seção para referência rápida):

Plaintext
```

📦src
 ┣ 📂components      <-- Componentes reutilizáveis e as Guardas de Rota (RoleRoute, ProtectedRoute)
 ┣ 📂context         <-- Provedores de estado global (Auth, Cart, PedidoCount)
 ┣ 📂hooks           <-- Hooks customizados (useAuth, useCart)
 ┣ 📂pages           <-- Componentes de página (rotas)
 ┣ 📜App.tsx         <-- Configuração central de rotas
 ┣ 📜main.tsx        <-- Inicialização do React (inclui BrowserRouter)
 ┗ 📜...
