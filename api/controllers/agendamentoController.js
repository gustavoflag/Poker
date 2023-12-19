const mongoose = require('mongoose');
const Agendamento = mongoose.model('Agendamento');
const Local = mongoose.model('Local');

exports.listar = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({}).sort({ data: 1 });
    return res.json(agendamentos);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserir = async (req, res) => {
  try {
    var novoAgendamento = new Agendamento(req.body);
    const agendamento = await novoAgendamento.save();
    return res.json(agendamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.inserirAnoTodo = async (req, res) => {
  const localPadrao = await Local.findOne({ padrao: true });
  if (!localPadrao)
    return res.status(440).json({ errmsg: "Local padrao não encontrado" });

  for (let i = 0; i < 365; i++){
    const day = new Date(req.params.ano, 0, 1, 21, 30);
    day.setDate(day.getDate() + i)

    if (day.getDay() === 2){//Terça-feira
      var novoAgendamento = new Agendamento({
        data: day,
        status: 'ativo',
        local: localPadrao
      });

      novoAgendamento.save(function(err, agendamento) {
        if (err)
          return res.status(440).json(err);
      });
    }

    if (i === 364){
      return res.json({ message: 'Agendamentos criados' });
    }
  }
};

exports.consultar = async (req, res) => {
  try {
    if (req.params.agendamentoId === 'proximo'){
      const proximoAgendamento = await Agendamento.findOne({ data: { $gte: new Date() } }).sort({ data: 1 }).limit(1);
      return res.json(proximoAgendamento);
    }

    const agendamento = await Agendamento.findById(req.params.agendamentoId);
    return res.json(agendamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.listarProximos = async (req, res) => {
  let qtd = 5;
  if (req.params.qtd) {
    qtd = Number(req.params.qtd);
  }

  try {
    const agendamentos = await Agendamento.find({ data: { $gte: new Date() } }).sort({ data: 1 }).limit(qtd);
    return res.json(agendamentos);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.alterar = async (req, res) => {
  try {
    const agendamento = await Agendamento.findOneAndUpdate({_id: req.params.agendamentoId}, req.body, {new: true});
    return res.json(agendamento);
  } catch (err) {
    return res.status(440).json(err);
  }
};

exports.excluir = async (req, res) => {
  try {
    await Agendamento.remove({
      _id: req.params.agendamentoId
    });

    return res.json({ message: 'Agendamento excluído' });
  } catch (err) {
    return res.status(440).json(err);
  }
};
