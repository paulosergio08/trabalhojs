const express = require('express'); 
const cors = require('cors');
const models=require('./models');
const { DATE } = require('sequelize');
const { json } = require('express/lib/response');
const req = require('express/lib/request');

const {Sequelize} = require('./models');

const app=express();
app.use(cors());
app.use (express.json());
let cliente=models.cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/',function(req,res){
    res.send('Ola,Mundo!')
});

app.post('/servicos',async(req,res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error:false,
            message:"Servico criado com. sucesso!.,"
        })
    }).catch(function(error){
        return  res.status(400).json({
            error:true,
            message:"erro de conecção!.,"
        })
    });
});


app.post('/clientes',async(req,res)=>{
    await cliente.create(
        req.body
        ).then(function(){
            return res.json({
                error:false,
                message:"Servico criado com. sucesso!.,"
            })
        }).catch(function(error){
            return  res.status(400).json({
                error:true,
                message:"erro de conecção!.," 
            })
    }); 
});
app.post('/pedidos',async(req,res)=>{
    await pedido.create(
        req.body
        ).then(function(){
            return res.json({
                error:false,
                message:"Servico criado com. sucesso!..,"
            })
        }).catch(function(error){
            return  res.status(400).json({
                error:true,
                message:"erro de conecção!.,," 
            })
    });
});

app.post('/itempedidos',async(req,res)=>{
    await itempedido.create(
        req.body
        ).then(function(){
            return res.json({
                error:false,
                message:"Servico criado com. sucesso!..,"
            })
        }).catch(function(error){
            return  res.status(400).json({
                error:true,
                message:"erro de conecção!.,," 
            })
    });
});

app.get('/listaservicos',async(req,res)=>{
    await servico.findAll({
       // raw:true
       order:[['nome','DESC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});
app.get('/listaclientes',async(req,res)=>{
    await cliente.findAll({
        raw:true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get ('/ofertaservicos',async(req,res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
}); // serve para saber a quantidade de serviços pelo numero de id

app.get('/servico/:id',async(req,res)=>{
    await servico.findByPk(req.params.id)
    .then(serv=>{
        return res.json({
        error:false,
        serv
    });
}).catch(function(error){
    return res.status(400).json({
        error:true,
        message:"Erro no codigo!"
    });
    });
});//usado pra achar um so id 

// app.get('/atualizaservico',async(req,res)=>{
//     await servico.findByPk(2)
//     .then(serv =>{
//         serv.nome='HTML/CSS/JS';
//         serv.descricao ='PAGINA ESTATICAS e dinamicas ESTILIZADAS';
//         serv.save();

//         return res.json({serv});
//      });
// });
app.get('/pedidos/:id',async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    });
});

app.put('/atualizaservico',async(req, res)=>{
    await servico.update(req.body,{
        where:{id:req.body.id}
    }).then(function(){
       return res.json({
           error: false,
           message:"Serviço foi alterado com sucesso!"
       });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:"Erro na alteração do serviço."
        });
    });
});

app.put('/pedidos/:id/editaritem',async(req, res)=>{
    const item = {
        quantidade:req.body.quantidade,
        valor:req.body.valor
    }
    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error:true,
            message:'Pedido nao encontrado.'
        });
    };
    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error:true,
            message:'Serviço nao encontardo.'
        });
    };
    await itempedido.update(item,{
        where:Sequelize.and({servicoId:req.body.ServicoId},
            {PedidoId: req.params.id})
        }).then(function (itens){
            return res.json({
                error:false,
                message:"Pedido foi alterado com sucesso.",
                itens
            });
        }).catch(function(erro){
            return res.status(400).json({
                error:true,
                message:"Erro: nao foi possivel alterar."
            });
        });;
});
app.get('/excluircliente/:id',async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error:false,
            message: "Cliente excluido com sucesso."
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            messagem:"Erro ao tentar excluir."
        });
    });
});

let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo:http://localhost:3001');
})