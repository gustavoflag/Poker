function Retorno(data, error) {
  this.data = data;
  if (error){
    this.sucesso = false;
  } else {
    this.sucesso = true;
  }
  this.error = error;
}

Retorno.prototype.setData = function(data) {
    this.data = data;
};

Retorno.prototype.setError = function(error) {
    this.error = error;
};

module.exports = Retorno;
