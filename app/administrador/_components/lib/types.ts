export type Pagina =
	| "dashboard"
	| "atividade"
	| "projetos"
	| "produtos"
	| "emails"
	| "propostas"
	| "conteudo"
	| "clientes"
	| "usuarios"
	| "logs"
	| "config";

// Proposta
export type TipoStatusProposta =
	| "Rascunho"
	| "Em análise"
	| "Aprovada"
	| "Recusada";

export interface ItemProposta {
	id: string; // identificador único (para o .map() com key)
	desc: string; // descrição do serviço
	un: string; // unidade (ex: "projeto", "m²", "un")
	q: number; // quantidade
	val: number; // valor unitário em reais
}
export interface Proposta {
	id: string | number;
	numero: string;
	cliente: string;
	projeto: string;
	valor: number;
	status: TipoStatusProposta;
	data: string;
	vencimento: string;
	responsavel: string;
	itens: ItemProposta[];
}

// Projetos
export type TipoStatusProjetos = "Em projeto" | "Aprovação" | "Pré-projeto";
export type TipoCategoria = "Comercial" | "Residencial" | "Saúde";
export interface Projeto extends ItemEditavel {
	id: string; // mais específico que string | number
	categoria: TipoCategoria; // agora obrigatório e com union type
	cidade: string; // agora obrigatório
	cliente: string; // agora obrigatório
	prazo: string; // agora obrigatório
	area: string; // agora obrigatório
	status: TipoStatusProjetos; // mais específico que string
}

// Produtos
// Tipos auxiliares — extraídos da interface para reutilização
type TipoProduto = "Kit" | "Sistema" | "Equipamento" | "Componente";
type StatusProduto = "Aprovado" | "Protótipo" | "Desenvolvimento" | "Pesquisa";

export interface Produto extends ItemEditavel {
	id: string; // mais específico que string | number
	tipo: TipoProduto; // agora obrigatório e com union type
	sku: string; // agora obrigatório
	lancamento: string; // agora obrigatório
	preco: string; // agora obrigatório
	status: StatusProduto; // mais específico que string
}

export interface ItemEditavel {
	// ── Identidade ─────────────────────────────────────────────────────────
	// id é string em Projeto ("PRJ-001") e number em Produto (42)
	// O union type aceita ambos sem forçar um padrão único
	id: string | number;
	nome: string;

	// ── Galeria de fotos ────────────────────────────────────────────────────
	// Ambos os tipos têm upload de fotos — campos obrigatórios
	photos?: string[]; // array de URLs/base64
	fotos: number; // contador exibido no card
	capa?: string; // opcional: pode não ter foto de capa ainda

	// ── Status ──────────────────────────────────────────────────────────────
	// Ambos têm status, mas com valores diferentes (TipoStatus vs StatusProduto)
	// Usamos string aqui na base — cada tipo especializa com union type próprio
	status: string;

	// ── Campos de PRODUTO (isProd = true) ───────────────────────────────────
	sku?: string | number;
	tipo?: string;
	lancamento?: string;
	preco?: string;

	// ── Campos de PROJETO (isProd = false) ──────────────────────────────────
	categoria?: string;
	cidade?: string;
	cliente?: string;
	prazo?: string;
	area?: string;
}
