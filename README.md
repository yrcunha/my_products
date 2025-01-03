## My Products

---

### Sumário

- [Arquitetura](__docs__/ARCHITECTURE.md)
  - [Modelagem de Dados](__docs__/DATA_MODELING.md)
  - [Definições de Testes](__docs__/DEFINITION_FOR_TESTS.md)

---

O sistema tem como objetivo gerenciar as informações dos clientes e seus produtos favoritos, desempenhando um papel
crucial nas ações de marketing da empresa. Ele será projetado para lidar com um grande volume de requisições de forma
eficiente e escalável.

Será possível gerenciar os dados dos clientes, bem como a lista de produtos favoritos de cada um. Para garantir a
integridade dos dados, somente produtos existentes na base de dados da empresa poderão ser adicionados à lista de
favoritos dos clientes. Além disso, o sistema permitirá que os clientes avaliem os produtos, e essas avaliações serão
utilizadas para otimizar as ações de marketing e melhorar a experiência do cliente.

### Instruções para compilar e executar o projeto em ambiente de desenvolvimento:

- _script_ para instalar dependências

```shell
  npm ci # Este comando instala as dependências de forma limpa, removendo o node_modules e reinstalando com base no package-lock.json
```

- _script_ para iniciar projeto

```shell
  npm run dev # Este comando está no package.json ele sobe todos os serviços necessário e interrompe caso a aplicação tenha algum erro
```

- _script_ para testes

```shell
  npm run test # Este comando está no package.json ele, também, sobe todos os serviços necessário e interrompe caso a aplicação tenha algum erro. Necessário para os testes de integração
```

### Instruções utilizar o postman para requisições:

caminho do arquivo: [postman](__docs__/my_products.json)

Após será necessário importar a `collection` e fazer as requisições necessárias. Sendo que os usuários padrão do
sistemas implementados na subida da aplicação são:

- usuário `admin`

```json
{
  "email": "labs@gmail.com",
  "password": "labs123"
}
```

- usuário `client`

```json
{
  "email": "sbal@gmail.com",
  "password": "labs123"
}
```
