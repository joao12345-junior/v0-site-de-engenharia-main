const formatadorBRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

// Criamos o formatador UMA VEZ fora da função para não recriar a cada chamada.
// Isso é uma micro-otimização de performance — padrão comum no mercado.
export const fmtBRL = (valor: number): string => formatadorBRL.format(valor);
