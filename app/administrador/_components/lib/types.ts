// types.ts

import { Photo } from "@/lib/repositories/admin/photos-repository";

// ─── Páginas disponíveis no painel ────────────────────────────────────────
export type Pagina =
	| "dashboard"
	| "atividade"
	| "projetos"
	| "produtos"
	| "emails"
	| "conteudo"
	| "clientes"
	| "usuarios"
	| "logs"
	| "config";

// ─── Proposta ─────────────────────────────────────────────────────────────
export type TipoStatusProposta =
	| "Rascunho"
	| "Em análise"
	| "Aprovada"
	| "Recusada";

export interface ItemProposta {
	id: string;
	desc: string;
	un: string;
	q: number;
	val: number;
}

export interface Proposta {
	// [MUDANÇA] id era `string | number` sem necessidade real.
	// Todos os dados do SEED usam string ("p2308", "p2312"...).
	// Union types sem necessidade real propagam ambiguidade:
	// em toda comparação `p.id === open` você teria que lidar com os dois casos.
	// Regra: use o tipo mais restrito que ainda representa todos os seus dados.
	id: string;
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

// ─── Base compartilhada: ItemEditavel ─────────────────────────────────────
// [MUDANÇA] Interface separada em camadas — ISP aplicado.
//
// ANTES: ItemEditavel tinha sku?, tipo?, lancamento? (campos de Produto)
//        Isso significa que todo Projeto "conhecia" a existência de sku,
//        o TypeScript não reclamava se você escrevesse umProjeto.sku = "algo".
//
// DEPOIS: ItemEditavel só contém o que É VERDADE para qualquer item editável,
//         independente de ser Projeto ou Produto.
//
// Analogia: uma interface é um contrato. O contrato "ser editável" não inclui
// ter SKU — isso é o contrato específico "ser um produto".
export interface ItemEditavel {
	id: string; // [MUDANÇA] era `string | number` — Projeto sempre usou string
	nome: string;
	photos?: Photo[] | null; // URLs ou base64 das imagens
	capa?: string | null; // primeira imagem, usada como thumbnail
	status: string; // string aqui; cada subtipo especializa com union type
	visible: boolean;
}

// ─── Projetos ─────────────────────────────────────────────────────────────
export type TipoStatusProjetos =
	| "Pré-projeto"
	| "Em projeto"
	| "Aprovação"
	| "Aprovado";
export type TipoCategoria = "Comercial" | "Residencial" | "Saúde";

export interface Projeto extends ItemEditavel {
	// [MUDANÇA] Campos de Projeto ficam APENAS em Projeto, não mais na base.
	// `extends ItemEditavel` significa: "Projeto tem tudo que ItemEditavel tem,
	// MAIS os campos abaixo". É herança de interface.
	categoria: TipoCategoria;
	cidade: string;
	cliente: string;
	clienteId: string;
	prazo: string;
	area: string;
	status: TipoStatusProjetos; // especializa o `status: string` da base
}

// ─── Produtos ─────────────────────────────────────────────────────────────
export type TipoProduto = "Kit" | "Sistema" | "Equipamento" | "Componente";
export type StatusProduto =
	| "Aprovado"
	| "Protótipo"
	| "Desenvolvimento"
	| "Pesquisa";

// [MUDANÇA] TipoProduto e StatusProduto eram `type` privados (sem export).
// Como data.ts importa Produto e precisa dos tipos para `satisfies`,
// exportar aqui evita que data.ts precise redefinir os mesmos tipos.
export interface Produto extends ItemEditavel {
	// [MUDANÇA] sku, tipo, lancamento, preco saíram da base e vieram para cá.
	// Agora um Projeto não tem esses campos — como deve ser.
	tipo: TipoProduto;
	sku: string;
	lancamento: string;
	preco: string;
	status: StatusProduto; // especializa o `status: string` da base
}
