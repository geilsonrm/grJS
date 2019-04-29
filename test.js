const grJS = require('./index')

const clientes = new grJS() 

clientes.insert({nome: 'Paulo', profissao: 'Mecânico', sexo: 'M', filhos: []})
clientes.insert({nome: 'Ana', profissao: 'Costureira', sexo: 'F', filhos: []})
clientes.insert({nome: 'Marcos', profissao: 'Motorista', sexo: 'M', filhos: []})
clientes.insert({nome: 'Maria', profissao: 'Mecânico', sexo: 'F', filhos: []})
clientes.insert({nome: 'Maria', profissao: 'Administrador', sexo: 'F', filhos: []})
clientes.insert({nome: 'Carlos', profissao: 'Advogado', sexo: 'M', filhos: []})
 
console.log( clientes.find({where:{nome: 'Maria'}, attributes: ['profissao']}) ) 