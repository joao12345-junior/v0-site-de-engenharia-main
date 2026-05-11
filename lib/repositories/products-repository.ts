// lib/repositories/products-repository.ts
import productsData from "@/public/JSON/produtos/products2.json";

export interface ServicoOptare {
	titulo: string;
	categorias: Record<string, string[]>;
}

export const LABELS_SUBCATEGORIA: Record<string, string> = {
	hidrossanitarios: "Hidrossanitários",
	eletricos: "Elétricos",
	gas: "Gás",
	seguranca_contra_incendio: "Prevenção de Incêndios",
	personalizacao_comercial_residencial: "Personalizações",
	aprovacoes_regularizacoes: "Aprovações e Regularizações",
	vistorias_atendimentos: "Vistorias",
	sustentabilidade_reuso: "Sustentabilidade",
	extensao_redes_publicas: "Extensão de Redes",
	automacao_protecao: "Automação e SPDA",
	estudos_tecnicos: "Estudos Técnicos",
	modelagem_bim_cad: "Modelagem BIM/CAD",
	analises_criticas: "Análises Críticas",
	laudos_levantamentos: "Laudos e Levantamentos",
	hidraulica: "Hidráulica",
	eletrica: "Elétrica",
};

// [CORREÇÃO] Dupla asserção: productsData → unknown → ServicoOptare[]
//
// Por que é necessário:
// O TypeScript infere tipos ultra-específicos ao importar JSON.
// Propriedades ausentes em alguns objetos ficam marcadas como `undefined`,
// o que conflita com Record<string, string[]> (que exige string[], não undefined).
//
// A asserção via unknown diz:
// 1. "trate como unknown" → abre mão da inferência automática
// 2. "trate como ServicoOptare[]" → assume a responsabilidade pelo tipo
//
// É seguro aqui porque sabemos que o JSON é compatível com a interface em runtime.
// Use com moderação — sempre documente o motivo quando usar dupla asserção.
export const servicos: ServicoOptare[] =
	productsData as unknown as ServicoOptare[];
