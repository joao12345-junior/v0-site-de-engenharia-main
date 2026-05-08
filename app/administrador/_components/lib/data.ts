import { Proposta, TipoCategoria } from "./types";
import { Projeto } from "./types";
import { Produto } from "./types";
import rawProjects from "@/public/JSON/projetos/projects.json";

interface ImagesBruta {
	subtitulo: string;
	urls_imagens: string[];
	localization: string;
}
interface ClienteBruto {
	cliente: string;
	imagens: ImagesBruta[];
}
const CategoriasPorCliente: Record<string, TipoCategoria> = {
	Cyrela: "Residencial",
	"Grupo Plaenge": "Residencial",
	Maiojama: "Residencial",
	"Hospital Moinhos de Vento": "Saúde",
	"Grupo Carrefour": "Comercial",
	"Lojas Renner": "Comercial",
	// adicione outros conforme necessário...
};

function mapearProjetosDoJson(): Projeto[] {
	return (rawProjects as ClienteBruto[]).flatMap((clienteBruto) =>
		clienteBruto.imagens.map((imagem, indice): Projeto => {
			// Extraímos a cidade do campo localization (ex: "Porto Alegre, RS")
			const cidade = imagem.localization ?? "-";

			// Lookup no dicionário - se não encontrar, usa "Comercial" como padrão
			const categoria: TipoCategoria =
				CategoriasPorCliente[clienteBruto.cliente] ?? "Comercial";

			return {
				// Geramos um id único combinando cliente + índice
				id: `proj-${clienteBruto.cliente.toLowerCase().replace(/\s+/g, "-")}-${indice}`,
				nome: imagem.subtitulo,
				cliente: clienteBruto.cliente.slice(),
				cidade,
				categoria,
				status: "Em projeto", // valor padrão — JSON não tem essa info
				prazo: "—", // valor padrão — JSON não tem essa info
				area: "—", // valor padrão — JSON não tem essa info
				fotos: imagem.urls_imagens.length,
				capa: imagem.urls_imagens[0], // primeira imagem como capa
				photos: imagem.urls_imagens, // todas as imagens
			};
		}),
	);
}

// Mock data — Optare admin
export const SEED = (() => {
	const projetosFuturos = mapearProjetosDoJson() satisfies Projeto[];
	const produtosFuturos = [
		{
			id: "pr1",
			nome: "OPT-HID 02 · Kit Hidrossanitário Modular",
			tipo: "Kit",
			lancamento: "2026-08",
			status: "Protótipo",
			preco: "sob consulta",
			sku: "OPT-HID-02",
			fotos: 0,
		},
		{
			id: "pr2",
			nome: "OPT-SPDA Pro · Sistema Para-raios",
			tipo: "Sistema",
			lancamento: "2026-11",
			status: "Aprovado",
			preco: "R$ 12.900",
			sku: "OPT-SPDA-PRO",
			fotos: 0,
		},
		{
			id: "pr3",
			nome: "OPT-GAS Smart · Medição inteligente",
			tipo: "Equipamento",
			lancamento: "2027-Q1",
			status: "Pesquisa",
			preco: "—",
			sku: "OPT-GAS-S",
			fotos: 0,
		},
		{
			id: "pr4",
			nome: "OPT-INC Sprinkler Compacto",
			tipo: "Componente",
			lancamento: "2026-10",
			status: "Protótipo",
			preco: "R$ 480",
			sku: "OPT-INC-SP",
			fotos: 0,
		},
	] satisfies Produto[];
	const emails = [
		{
			id: "e1",
			from: "Carlos Mendes",
			email: "carlos@cyrela.com.br",
			subject: "Revisão do projeto Torre Belvedere — pavimento 18",
			preview:
				"Bom dia Marcelo, segue em anexo a revisão solicitada para o pavimento 18. Precisamos discutir as prumadas...",
			body: "Bom dia Marcelo,\n\nSegue em anexo a revisão solicitada para o pavimento 18 da Torre Belvedere. Precisamos discutir as prumadas hidráulicas que ficaram conflitando com a estrutura na sala de máquinas.\n\nPodemos agendar uma reunião na próxima quarta?\n\nAbraço,\nCarlos Mendes\nDir. Operações — Cyrela",
			date: "14:32",
			dateFull: "2026-05-07 14:32",
			read: false,
			starred: true,
			folder: "inbox",
			labels: ["Cyrela", "Urgente"],
		},
		{
			id: "e2",
			from: "Fernanda Lima",
			email: "fernanda@plaenge.com.br",
			subject: "Proposta #2308 — aprovada",
			preview:
				"Olá equipe, a proposta foi aprovada pela diretoria. Podem dar andamento ao contrato.",
			body: "Olá equipe,\n\nA proposta foi aprovada pela diretoria. Podem dar andamento ao contrato.\n\nObrigada.\nFernanda",
			date: "13:08",
			dateFull: "2026-05-07 13:08",
			read: false,
			starred: false,
			folder: "inbox",
			labels: ["Plaenge"],
		},
		{
			id: "e3",
			from: "Roberto Silva",
			email: "roberto@hospitalmoinhos.org.br",
			subject: "Visita técnica — MedPlex Sul",
			preview:
				"Marcelo, podemos confirmar a visita técnica para a próxima sexta?",
			body: "Marcelo,\n\nPodemos confirmar a visita técnica para a próxima sexta, às 9h, no terreno?\n\nRoberto",
			date: "11:45",
			dateFull: "2026-05-07 11:45",
			read: true,
			starred: false,
			folder: "inbox",
			labels: ["Saúde"],
		},
		{
			id: "e4",
			from: "Bruna Tavares",
			email: "bruna@melnick.com.br",
			subject: "re: Detalhamento elétrico — bloco C",
			preview: "Recebido. Vou enviar para o eng. responsável e retorno...",
			body: "Recebido. Vou enviar para o eng. responsável e retorno até quinta com o feedback.\n\nObrigada,\nBruna",
			date: "Ontem",
			dateFull: "2026-05-06 17:20",
			read: true,
			starred: false,
			folder: "inbox",
			labels: ["Melnick"],
		},
		{
			id: "e5",
			from: "noreply@receita.gov.br",
			email: "noreply@receita.gov.br",
			subject: "Confirmação de envio — DCTF abril/2026",
			preview:
				"Sua declaração foi recebida com sucesso. Protocolo 8829-2026...",
			body: "Sua declaração foi recebida com sucesso.\nProtocolo 8829-2026-AABF.",
			date: "Ontem",
			dateFull: "2026-05-06 09:02",
			read: true,
			starred: false,
			folder: "inbox",
			labels: [],
		},
		{
			id: "e6",
			from: "Marcelo Berny",
			email: "marcelo@optare.com.br",
			subject: "Proposta enviada — BIG Torres expansão",
			preview:
				"Encaminhando a proposta com os ajustes pedidos. Aguardo retorno até sexta.",
			body: "",
			date: "2 dias",
			dateFull: "2026-05-05",
			read: true,
			starred: false,
			folder: "enviados",
			labels: ["BIG"],
		},
		{
			id: "e7",
			from: "Rascunho",
			email: "",
			subject: "Orçamento expansão Carrefour",
			preview: "Prezado Sr. ...",
			body: "Prezado Sr. ",
			date: "3 dias",
			dateFull: "2026-05-04",
			read: true,
			starred: false,
			folder: "rascunhos",
			labels: [],
		},
	];
	const propostas = [
		{
			id: "p2308",
			numero: "#2308",
			cliente: "Grupo Plaenge",
			projeto: "Torre Belvedere",
			valor: 184500,
			status: "Aprovada",
			data: "2026-04-20",
			vencimento: "2026-05-20",
			responsavel: "Marcelo Berny",
			itens: [],
		},
		{
			id: "p2312",
			numero: "#2312",
			cliente: "Lojas Renner",
			projeto: "Renner Iguatemi POA II",
			valor: 76200,
			status: "Em análise",
			data: "2026-04-28",
			vencimento: "2026-05-28",
			responsavel: "Márcio Trolli",
			itens: [],
		},
		{
			id: "p2315",
			numero: "#2315",
			cliente: "Hospital Moinhos",
			projeto: "MedPlex Sul",
			valor: 412000,
			status: "Em análise",
			data: "2026-05-02",
			vencimento: "2026-06-02",
			responsavel: "Marcelo Berny",
			itens: [],
		},
		{
			id: "p2316",
			numero: "#2316",
			cliente: "Carrefour",
			projeto: "Distrito C",
			valor: 98400,
			status: "Rascunho",
			data: "2026-05-04",
			vencimento: "—",
			responsavel: "Márcio Trolli",
			itens: [],
		},
		{
			id: "p2298",
			numero: "#2298",
			cliente: "Cyrela",
			projeto: "Rodin",
			valor: 156800,
			status: "Aprovada",
			data: "2026-03-15",
			vencimento: "2026-04-15",
			responsavel: "Marcelo Berny",
			itens: [],
		},
		{
			id: "p2301",
			numero: "#2301",
			cliente: "Maiojama",
			projeto: "Atlântida Beach Club",
			valor: 88300,
			status: "Recusada",
			data: "2026-03-22",
			vencimento: "2026-04-22",
			responsavel: "Márcio Trolli",
			itens: [],
		},
	] satisfies Proposta[];
	const clientes = [
		{
			id: "c1",
			nome: "Lojas Renner",
			setor: "Varejo",
			projetos: 8,
			contato: "compras@renner.com.br",
		},
		{
			id: "c2",
			nome: "Grupo Plaenge",
			setor: "Construção",
			projetos: 12,
			contato: "engenharia@plaenge.com.br",
		},
		{
			id: "c3",
			nome: "Grupo Carrefour",
			setor: "Varejo",
			projetos: 5,
			contato: "projetos@carrefour.com.br",
		},
		{
			id: "c4",
			nome: "Melnick",
			setor: "Construção",
			projetos: 6,
			contato: "obras@melnick.com.br",
		},
		{
			id: "c5",
			nome: "Lojas Petz",
			setor: "Varejo",
			projetos: 3,
			contato: "expansao@petz.com.br",
		},
		{
			id: "c6",
			nome: "Cyrela",
			setor: "Construção",
			projetos: 9,
			contato: "engenharia@cyrela.com.br",
		},
		{
			id: "c7",
			nome: "Hospital Moinhos de Vento",
			setor: "Saúde",
			projetos: 2,
			contato: "infra@hmv.org.br",
		},
		{
			id: "c8",
			nome: "Multiplan",
			setor: "Shopping",
			projetos: 4,
			contato: "projetos@multiplan.com.br",
		},
	];
	const usuarios = [
		{
			id: "u1",
			nome: "Marcelo Berny",
			email: "marcelo@optare.com.br",
			cargo: "Sócio · Engenheiro Civil",
			perfil: "admin",
			ativo: true,
			ultimo: "agora",
		},
		{
			id: "u2",
			nome: "Márcio Trolli",
			email: "marcio@optare.com.br",
			cargo: "Sócio · Engenheiro Civil",
			perfil: "admin",
			ativo: true,
			ultimo: "há 12min",
		},
		{
			id: "u3",
			nome: "Letícia Hoffmann",
			email: "leticia@optare.com.br",
			cargo: "Coord. Projetos",
			perfil: "editor",
			ativo: true,
			ultimo: "há 1h",
		},
		{
			id: "u4",
			nome: "Diego Almeida",
			email: "diego@optare.com.br",
			cargo: "Eng. Hidrossanitário",
			perfil: "editor",
			ativo: true,
			ultimo: "há 3h",
		},
		{
			id: "u5",
			nome: "Paula Reis",
			email: "paula@optare.com.br",
			cargo: "Administrativo",
			perfil: "visualizador",
			ativo: true,
			ultimo: "ontem",
		},
		{
			id: "u6",
			nome: "Felipe Costa",
			email: "felipe@optare.com.br",
			cargo: "Eng. Elétrico (estagiário)",
			perfil: "visualizador",
			ativo: false,
			ultimo: "há 14d",
		},
	];
	const logs = [
		{
			id: 1,
			hora: "14:32",
			user: "Marcelo Berny",
			acao: "Visualizou e-mail de Carlos Mendes",
			tipo: "email",
		},
		{
			id: 2,
			hora: "14:18",
			user: "Letícia Hoffmann",
			acao: "Adicionou foto ao projeto Torre Belvedere",
			tipo: "upload",
		},
		{
			id: 3,
			hora: "13:55",
			user: "Márcio Trolli",
			acao: "Aprovou proposta #2308 — Plaenge",
			tipo: "proposta",
		},
		{
			id: 4,
			hora: "13:08",
			user: "Sistema",
			acao: "Backup diário concluído (2.4 GB)",
			tipo: "sistema",
		},
		{
			id: 5,
			hora: "12:40",
			user: "Diego Almeida",
			acao: "Editou descrição do produto OPT-HID 02",
			tipo: "produto",
		},
		{
			id: 6,
			hora: "11:45",
			user: "Marcelo Berny",
			acao: "Criou rascunho de proposta #2316",
			tipo: "proposta",
		},
		{
			id: 7,
			hora: "11:02",
			user: "Letícia Hoffmann",
			acao: 'Publicou alteração na seção "Sobre Nós"',
			tipo: "conteudo",
		},
		{
			id: 8,
			hora: "10:18",
			user: "Sistema",
			acao: "Login: Marcelo Berny (192.168.0.45)",
			tipo: "auth",
		},
		{
			id: 9,
			hora: "09:30",
			user: "Paula Reis",
			acao: "Exportou relatório de propostas (CSV)",
			tipo: "sistema",
		},
	];
	const conteudo = [
		{
			id: "cn1",
			secao: "Home — Hero",
			titulo: "Uma Nova Opção em Projetos Complementares",
			atualizado: "2026-04-12",
			autor: "Letícia H.",
		},
		{
			id: "cn2",
			secao: "Sobre Nós",
			titulo: "Missão, Visão e Valores",
			atualizado: "2026-03-22",
			autor: "Marcelo B.",
		},
		{
			id: "cn3",
			secao: "Serviços",
			titulo: "Projetos de Instalações",
			atualizado: "2026-02-08",
			autor: "Letícia H.",
		},
		{
			id: "cn4",
			secao: "Linha do Tempo",
			titulo: "Nossa História",
			atualizado: "2026-01-15",
			autor: "Marcelo B.",
		},
		{
			id: "cn5",
			secao: "Contato",
			titulo: "Endereço, e-mail e WhatsApp",
			atualizado: "2025-12-10",
			autor: "Paula R.",
		},
	];
	// 12 weeks of synthetic activity
	const atividade = Array.from({ length: 12 }, (_, i) => ({
		semana: "S" + (i + 1),
		// Apenas funções matemáticas puras — mesmo resultado sempre
		propostas:
			3 + Math.round(Math.abs(Math.sin(i * 0.7) * 2 + Math.sin(i * 1.3))),
		projetos: 1 + Math.round(Math.abs(Math.cos(i * 0.5) + Math.sin(i * 0.9))),
		emails:
			18 + Math.round(Math.abs(Math.sin(i * 0.4) * 8 + Math.cos(i * 0.6) * 5)),
	}));
	return {
		projetosFuturos,
		produtosFuturos,
		emails,
		propostas,
		clientes,
		usuarios,
		logs,
		conteudo,
		atividade,
	};
})();
