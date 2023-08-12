class CaixaDaLanchonete {
  formasPagamento = [
    { descricao: "dinheiro", ajuste: 0.95 },
    { descricao: "debito", ajuste: 1.0 },
    { descricao: "credito", ajuste: 1.03 },
  ];

  cardapio = [
    { codigo: "cafe", descricao: "Café", valor: 3.0 },
    {
      codigo: "chantily",
      descricao: "Chantily (extra do Café)",
      codigoPrincipal: "café",
      valor: 1.5,
    },
    {
      codigo: "suco",
      descricao: "Suco Natural",
      valor: 6.2,
    },
    {
      codigo: "sanduiche",
      descricao: "Sanduíche",
      valor: 6.5,
    },
    {
      codigo: "queijo",
      descricao: "Queijo (extra do Sanduíche)",
      codigoPrincipal: "sanduiche",
      valor: 2.0,
    },
    {
      codigo: "salgado",
      descricao: "Salgado",
      valor: 7.25,
    },
    {
      codigo: "combo1",
      descricao: "1 Suco e 1 Sanduíche",
      itensCombo: [
        {
          quantidade: 1,
          codigoItem: "suco",
        },
        {
          quantidade: 1,
          codigoItem: "sanduiche",
        },
      ],
      valor: 9.5,
    },
    {
      codigo: "combo2",
      descricao: "1 Café e 1 Sanduíche",
      itensCombo: [
        {
          quantidade: 1,
          codigoItem: "cafe",
        },
        {
          quantidade: 1,
          codigoItem: "sanduiche",
        },
      ],
      valor: 7.5,
    },
  ];

  calcularValorDaCompra(metodoDePagamento, itens) {
    try {
      const listaItens = this.formatarListaItens(itens);
      this.validarListaItens(listaItens);

      const carrinho = this.montarCarrinho(listaItens);
      this.validarCarrinho(carrinho);

      return this.calcularValorTotal(metodoDePagamento, carrinho);
    } catch (error) {
      return error;
    }
  }

  formatarListaItens(itens) {
    return itens.map((item) => {
      // const informacoesProduto = item.split(",", 2);
      const [codigo, quantidade] = item.split(",").map((part) => part.trim());

      return { codigo, quantidade: parseInt(quantidade) || 0 };
    });
  }

  validarListaItens(listaItens) {
    if (listaItens.length == 0) throw "Não há itens no carrinho de compra!";

    listaItens.forEach((itemLista) => {
      if (!this.cardapio.find((item) => item.codigo === itemLista.codigo))
        throw "Item inválido!";

      if (itemLista.quantidade <= 0) throw "Quantidade inválida!";
    });
  }

  montarCarrinho(listaItens) {
    return listaItens.map((item) => {
      const product = this.cardapio.find(
        (product) => product.codigo === item.codigo
      );
      return { ...product, quantidade: item.quantidade };
    });
  }

  validarCarrinho(carrinho) {
    carrinho.forEach((itemCarrinho) => {
      if (itemCarrinho.codigoPrincipal) {
        if (
          !carrinho.some(
            (item) =>
              !item.itensCombo && item.codigo === itemCarrinho.codigoPrincipal
          )
        )
          throw "Item extra não pode ser pedido sem o principal";
      }
    });
  }

  calcularValorTotal(metodoDePagamento, carrinho) {
    const valorTotal = carrinho.reduce((acumulador, item) => {
      return acumulador + item.valor * item.quantidade;
    }, 0);

    return this.calculaAjuste(metodoDePagamento, valorTotal);
  }

  calculaAjuste(metodoDePagamento, valorTotal) {
    this.validarMetodoPagamento(metodoDePagamento);

    const formaPagamento = this.formasPagamento.find(
      (formaPagamento) => formaPagamento.descricao === metodoDePagamento
    );

    const valorFinal = valorTotal * formaPagamento.ajuste;
    return `R$ ${valorFinal.toFixed(2).replace(".", ",")}`;
  }

  validarMetodoPagamento(metodoDePagamento) {
    if (
      !this.formasPagamento.find(
        (formaPagamento) => formaPagamento.descricao === metodoDePagamento
      )
    )
      throw "Forma de pagamento inválida!";
  }
}

export { CaixaDaLanchonete };
