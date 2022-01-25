'use strict';
const {
  Model
} = require('sequelize');
const itempedido = require('./itempedido');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedido.belongsTo(models.cliente, {foreignKey:'clienteId', as :'clientes'});
      Pedido.belongsToMany(models.Servico,{
        foreignKey:'ServicoId',
        through:'ItemPedido',as:'servicos_ped'
      });
      Pedido.hasMany(models.ItemPedido,{foreignKey:'PedidoId',as:'item_pedidos'});
    }
  };
  Pedido.init({
    data: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Pedido',
  });
  return Pedido;
};