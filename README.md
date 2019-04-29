# grJS

Manipula objetos de um array como se fosse um CRUD, inserindo, alterando, deletando e consultando.

Este pacote foi testado no backend e frontend.

Ao inserir um item é criado automaticamente um ID sequencial, para desabilitar esse recurso definir no construtor {addID: false}

Eu criei este pacote pois buscava uma forma de manipular os dados mais facilmente antes de inserir no banco ou exibir no frontend.

Você também pode passar um array com resultado de uma consulta no banco ou request e manipular os dados.

Ideal para quem está aprendendo frontend e deseja criar um CRUD sem backend ou banco de dados.

####Instalação　

```javascript
npm install grjs
```

####Teste　

```javascript
const grJS = require('grjs')

// const clientes = new grJS({addID: false})  

const clientes = new grJS() // addID padrão é true. 

// Você pode inserir cada item individualmente.
clientes.insert({nome: 'Paulo', profissao: 'Mecânico', sexo: 'M', filhos: []})
clientes.insert({nome: 'Ana', profissao: 'Costureira', sexo: 'F', filhos: []})
clientes.insert({nome: 'Marcos', profissao: 'Motorista', sexo: 'M', filhos: []})
clientes.insert({nome: 'Maria', profissao: 'Mecânico', sexo: 'F', filhos: []})
clientes.insert({nome: 'Maria', profissao: 'Administrador', sexo: 'F', filhos: []})
clientes.insert({nome: 'Carlos', profissao: 'Advogado', sexo: 'M', filhos: []})

// Ou inserir um array de itens.
clientes.insert([
    {nome: 'Patricia', profissao: 'Motorista', sexo: 'F', filhos: []},
    {nome: 'Renata', profissao: 'Contador', sexo: 'F', filhos: []}
])

// Buscar por todos os itens.
console.log( clientes.find() )

// O resultado será atribuído um id automaticamente.
[
    {"id":0,"nome":"Paulo","profissao":"Mecânico","sexo":"M","filhos":[]},
    {"id":1,"nome":"Ana","profissao":"Costureira","sexo":"F","filhos":[]},
    {"id":2,"nome":"Marcos","profissao":"Motorista","sexo":"M","filhos":[]},
    {"id":3,"nome":"Maria","profissao":"Mecânico","sexo":"F","filhos":[]},
    {"id":4,"nome":"Maria","profissao":"Administrador","sexo":"F","filhos":[]},
    {"id":5,"nome":"Carlos","profissao":"Advogado","sexo":"M","filhos":[]},
    {"id":6,"nome":"Patricia","profissao":"Motorista","sexo":"F","filhos":[]},
    {"id":7,"nome":"Renata","profissao":"Contador","sexo":"F","filhos":[]}
]

// Filtra por ID
console.log( clientes.find(3) )

[
    {"id":3,"nome":"Maria","profissao":"Mecânico","sexo":"F","filhos":[]}
]

// Filtra por ID e oculta ID no retorno.
console.log( clientes.find(3, {id: false})  )  

[
    {"nome":"Maria","profissao":"Mecânico","sexo":"F","filhos":[]}
]

// Filtra por um array de ID
console.log( clientes.find([3,5]) )

[
    {"id":3,"nome":"Maria","profissao":"Mecânico","sexo":"F","filhos":[]},
    {"id":5,"nome":"Carlos","profissao":"Advogado","sexo":"M","filhos":[]},
]

// Filtra por um atributo do item.
console.log( clientes.find({sexo: 'F'}) )

[
    {"id":1,"nome":"Ana","profissao":"Costureira","sexo":"F","filhos":[]},
    {"id":3,"nome":"Maria","profissao":"Mecânico","sexo":"F","filhos":[]},
    {"id":4,"nome":"Maria","profissao":"Administrador","sexo":"F","filhos":[]},
    {"id":6,"nome":"Patricia","profissao":"Motorista","sexo":"F","filhos":[]},
    {"id":7,"nome":"Renata","profissao":"Contador","sexo":"F","filhos":[]}
]

// Filtra por um ou mais atributos dos itens.
console.log( clientes.find({sexo: 'F', profissao: 'Administrador'}) )

[
    {"id":4,"nome":"Maria","profissao":"Administrador","sexo":"F","filhos":[]},
]
```
Os métodos Update e Delete podem utilizar os mesmos critérios de busca dos exemplos anteriores.

```javascript

// Update retorna um objeto com todos os registros antes e depois de alterado.
clientes.update({ nome: 'Carlos' }, { nome: 'Carlos Luiz', idade: 30 })

{
    before: [
        { id: 5, nome: 'Carlos', profissao: 'Advogado', sexo: 'M', filhos: [] }
    ],
    after: [
        { id: 5, nome: 'Carlos Luiz', profissao: 'Advogado', sexo: 'M', filhos: [], idade: 30 }
    ]
}

// Retorna registros Deletados.
clientes.delete({ sexo: 'F', profissao: 'Administrador' })
[
    {"id":4,"nome":"Maria","profissao":"Administrador","sexo":"F","filhos":[]},
]


// Remove itens do retorno, mas não deleta do array principal.
clientes.exclude({ sexo: 'F'})

[
    {"id":0,"nome":"Paulo","profissao":"Mecânico","sexo":"M","filhos":[]},
    {"id":2,"nome":"Marcos","profissao":"Motorista","sexo":"M","filhos":[]},
    {"id":5,"nome":"Carlos","profissao":"Advogado","sexo":"M","filhos":[]},
]


// Concatena resultado da busca com itens do segundo parâmetro, não altera no array principal.
clientes.include({ nome: 'Ana'}, [{nome: 'Bethe', profissao: 'Vendedor', sexo: 'F'}])

[
    {"id":1,"nome":"Ana","profissao":"Costureira","sexo":"F","filhos":[]},
    { nome: 'Bethe', profissao: 'Vendedor', sexo: 'F' }
]


// Retorna quantidade de itens no array.
clientes.count

8

// Realiza um merge entre os arrays 
clientes.merge('nome', veiculos, {mandatory: 1})



// Retorna os nomes dos atributos e os tipos.
clientes.getSchema()

{ id: 'number', nome: 'string', profissao: 'string', sexo: 'string', filhos: 'array' }
```