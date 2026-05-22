"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import {
	motion,
	AnimatePresence,
	LayoutGroup,
	type Variants,
} from "framer-motion";
import { ImageCarousel } from "@/components/ui/image-carousel";
import {
	findImagesByTitle,
	findLocationByTitle,
	findClientByTitle,
} from "@/lib/repositories/images-repository";
import { ProjectGroup } from "@/lib/repositories/images-repository";

interface FlatProject {
	title: string;
	category: string;
	client: string;
}

const json_projects = [
	{
		cliente: "Lojas Renner",
		imagens: [
			{
				subtitulo: "RENNER Shopping Iguatemi Porto Alegre, RS",
				query_busca: "loja renner RENNER Shopping Iguatemi Porto Alegre",
				urls_imagens: [
					"https://www.silvanatoazza.com.br/cms/_files/general/2253308dfa.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "RENNER Shopping BH Belo Horizonte, MG",
				query_busca: "loja renner RENNER Shopping BH Belo Horizonte",
				urls_imagens: [
					"https://storage.googleapis.com/ancarx-stores-images-prd/001SG000007rABrYAM.jpeg",
				],
				localization: "Belo Horizonte, MG",
			},
			{
				subtitulo: "RENNER Tramandaí Tramandaí, RS",
				query_busca: "loja renner RENNER Tramandaí",
				urls_imagens: [
					"https://jplitoral.com.br/wp-content/uploads/2019/11/Renner_01.jpeg",
				],
				localization: "Tramandaí, RS",
			},
		],
	},
	{
		cliente: "Grupo Plaenge",
		imagens: [
			{
				subtitulo: "Rodin Curitiba, PR",
				query_busca: "Rodin Curitiba fachada",
				urls_imagens: [
					"https://www.plaenge.com.br/upload/imagens/dad624e2-dfca-4987-b0bf-7207a73c554b.jpg",
					"https://static.revistahaus.com.br/revistahaus/2021/09/28142545/PL-CTBA-RODIN-ACESSO02.jpg",
					"https://blog.plaenge.com.br/wp-content/uploads/2021/09/PL_CTBA_RODIN_APTO01_TERRACO01.jpg",
				],
				localization: "Curitiba, PR",
			},
			{
				subtitulo: "Signature Curitiba, PR",
				query_busca: "Signature Curitiba fachada",
				urls_imagens: [
					"https://blog.plaenge.com.br/wp-content/uploads/2021/11/PL_CTBA_BERG_FACHNOT03.jpg",
					"https://betaimages.lopes.com.br/realestate/sml/REB453832/2_Curitiba_Ecoville_Signature_Fachada_1.2.jpg",
					"https://betaimages.lopes.com.br/realestate/sml/REB453832/1_Curitiba_Ecoville_Signature_Fachada_1.jpg",
				],
				localization: "Curitiba, PR",
			},
			{
				subtitulo: "Orbitale Porto Alegre, RS",
				query_busca: "Orbitale Porto Alegre fachada",
				urls_imagens: [
					"https://blog.plaenge.com.br/wp-content/uploads/2024/01/1aedc6d4-ff08-4d9d-bea8-113cfcfe.webp",
					"https://ronaldorezende.com.br/app/uploads/2023/01/01-6-1440x915.jpg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Grupo Carrefour",
		imagens: [
			{
				subtitulo: "BIG Torres Curitiba, PR",
				query_busca: "supermercado BIG Torres Curitiba",
				urls_imagens: [
					"https://media.gazetadopovo.com.br/2019/10/10101422/big-3-960x540.jpg",
				],
				localization: "Curitiba, PR",
			},
			{
				subtitulo: "BIG Bauru Bauru, SP",
				query_busca: "supermercado BIG Bauru",
				urls_imagens: [
					"https://sampi.net.br/dir-arquivo-imagem/2020/11/485a846403aed4bd365f79e9b52fb7d5.jpg",
					"https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1322395727943815",
				],
				localization: "Bauru, SP",
			},
			{
				subtitulo: "Sam's Club Blumenau Blumenau, SC",
				query_busca: "Sam's Club Blumenau fachada",
				urls_imagens: [
					"https://www.noticenter.com.br/noticias/609192be743b7.jpg",
				],
				localization: "Blumenau, SC",
			},
		],
	},
	{
		cliente: "Melnick",
		imagens: [
			{
				subtitulo: "Vida Viva Linked Porto Alegre, RS",
				query_busca: "Vida Viva Linked Porto Alegre fachada",
				urls_imagens: [
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/04/13124256/09-min-2-1.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Carlos Gomes Square Porto Alegre, RS",
				query_busca: "Carlos Gomes Square Porto Alegre fachada",
				urls_imagens: [
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/04/28162833/DJI_20250512180934_0645_D-HDR.jpg",
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/04/28162726/CFF3260-HDR.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Botanique Residences Porto Alegre, RS",
				query_busca: "Botanique Residences Porto Alegre fachada",
				urls_imagens: [
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/03/09152136/DJI_20241108053416_0550_D-HDR.webp",
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/03/09151921/CFF1685-scaled.webp",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Grand Park Lindóia Porto Alegre, RS",
				query_busca: "Grand Park Lindóia Porto Alegre fachada",
				urls_imagens: [
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2022/03/08142937/fachada_comercial-min-1.jpeg",
					"https://www.melnick.com.br/wp-content/uploads/2022/03/18-4.jpg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Lojas Petz",
		imagens: [
			{
				subtitulo: "Petz Gravataí Gravataí, RS",
				query_busca: "petz loja Petz Gravataí",
				urls_imagens: ["https://images.petz.com.br/fotos/1665257701473.jpg"],
				localization: "Gravataí, RS",
			},
			{
				subtitulo: "Petz Taguatinga Brasília, DF",
				query_busca: "petz loja Petz Taguatinga Brasília",
				urls_imagens: ["https://images.petz.com.br/fotos/1663591615451.jpg"],
				localization: "Brasília, DF",
			},
			{
				subtitulo: "Petz Jockey Club Curitiba, PR",
				query_busca: "petz loja Petz Jockey Club Curitiba",
				urls_imagens: [
					"https://jockeyplaza.com.br/wp-content/uploads/2023/03/IMG_45221.webp",
				],
				localization: "Curitiba, PR",
			},
			{
				subtitulo: "Petz São Luis São Luis, MA",
				query_busca: "petz loja Petz São Luis",
				urls_imagens: ["https://images.petz.com.br/fotos/1667259912536.jpg"],
				localization: "São Luis, MA",
			},
			{
				subtitulo: "Petz Rio Grande Rio Grande, RS",
				query_busca: "petz loja Petz Rio Grande",
				urls_imagens: ["https://images.petz.com.br/fotos/1664555140375.jpg"],
				localization: "Rio Grande, RS",
			},
		],
	},
	{
		cliente: "Cyrela",
		imagens: [
			{
				subtitulo: "Nova Olaria Porto Alegre, RS",
				query_busca: "Nova Olaria Porto Alegre fachada",
				urls_imagens: [
					"https://www.cyrela.com.br/sites/default/files/styles/webp/public/2023-08/OLA_06_Fachada_Residencial_A_EF_v2.jpg.webp?itok=ENfvBx0i",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "The Arch Porto Alegre, RS",
				query_busca: "The Arch Porto Alegre fachada",
				urls_imagens: [
					"https://cdn.imoview.com.br/lajeado/Imoveis/16101/or4nm-the-arch-fachada-aerea-2-1757448701.jpg?1757448702",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Prime Altos do Germânia Porto Alegre, RS",
				query_busca: "Prime Altos do Germânia Porto Alegre fachada",
				urls_imagens: [
					"https://betaimages.lopes.com.br/realestate/sml/REB281032/1-Fachada.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Cyrela by Pininfarina Porto Alegre, RS",
				query_busca: "Cyrela by Pininfarina Porto Alegre fachada",
				urls_imagens: [
					"https://pininfarinaportoalegre.cyrela.com.br/assets/imgs/arquivos/galeria/PININFARINA%20-%20Fachada%20Noturna.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "DOC Castelo Batel Curitiba, PR",
				query_busca: "DOC Castelo Batel Curitiba fachada",
				urls_imagens: [
					"https://www.cyrela.com.br/sites/default/files/2023-06/original-27-02-2020-16-38-32-230657-doc-castelo-batel.jpg",
					"https://www.cyrela.com.br/sites/default/files/styles/webp/public/2023-06/original-27-02-2020-16-38-32-886903-doc-castelo-batel.jpg.webp?itok=aIeWPFNL",
					"https://bsa.com.br/uploads/ddef1e26331269ec68d408d20d43f7e11598647157-.jpg?w=382&h=267&q=90",
				],
				localization: "Curitiba, PR",
			},
			{
				subtitulo: "Garden Haus + Tree Haus Porto Alegre, RS",
				query_busca: "Garden Haus + Tree Porto Alegre fachada",
				urls_imagens: [
					"https://www.cyrela.com.br/sites/default/files/2023-10/Design%20sem%20nome%20%2848%29.png",
					"https://www.cyrela.com.br/sites/default/files/2023-10/Design%20sem%20nome%20%2845%29.png",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Hospital Moinhos de Vento",
		imagens: [
			{
				subtitulo: "Complexo Hospitalar Moinhos de Vento Porto Alegre, RS",
				query_busca:
					"hospital Complexo Hospitalar Moinhos de Vento (Projeto do Bloco 16, Banco Sangue; reformas e adequações nos 12, C, ruas internas, emergência, CTI Adulto, entre outros.) Porto Alegre",
				urls_imagens: [
					"https://www.hospitalmoinhos.org.br/media/c9e0cfee-c901-4158-a487-e36cbffdf6ec.png",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo:
					"Clínica Moinhos de Vento Linked Teresópolis Porto Alegre, RS",
				query_busca:
					"hospital Clínica Moinhos de Vento Linked Teresópolis Porto Alegre",
				urls_imagens: [
					"https://wordpress-melnick.s3.sa-east-1.amazonaws.com/wp-content/uploads/2023/08/29112148/108-1024x572.jpg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Multiplan",
		imagens: [
			{
				subtitulo: "Barra Shopping Sul Porto Alegre, RS",
				query_busca: "Barra Shopping Sul Porto Alegre fachada",
				urls_imagens: [
					"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/a1/c8/a6/barrashoppingsul.jpg?w=1200&h=-1&s=1",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Diamond Tower + Résidence du Lac Porto Alegre, RS",
				query_busca: "Diamond Tower + Résidence du Lac Porto Alegre fachada",
				urls_imagens: [
					"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj30CAmtsPil0i-C4FYKssB5Q8XRqWsfTlC0Ho6XFnJS4v7viJSRMcLun8UO-8mlViaZK0JvxOnQcNm_MyFoFhnaWtDquVkeGR4KZIXH1IyN9u6b93akYdo5cVJnWfmnVQpFmsR7104f8oc/s1600/Fachada+Diamond+01.jpg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Wagnerpar",
		imagens: [
			{
				subtitulo: "Enseada Lagos Xangri-lá, RS",
				query_busca: "Enseada Lagos Xangri-lá fachada",
				urls_imagens: [
					"https://i.ytimg.com/vi/EZHeOFPnbF4/sddefault.jpg?v=64d67004",
				],
				localization: "Xangri-lá, RS",
			},
			{
				subtitulo: "Lagos São Gonçalo Pelotas, RS",
				query_busca: "Lagos São Gonçalo Pelotas fachada",
				urls_imagens: [
					"https://idealizacidades.com.br//laravel/public/storage/projects/June2019/Fv6aq7TM8ejEQXWSeg7o.jpg",
				],
				localization: "Pelotas, RS",
			},
			{
				subtitulo: "Rivieira Xangri-lá, RS",
				query_busca: "Rivieira Xangri-lá fachada",
				urls_imagens: [
					"https://www.eleganceimoveis.com.br/fotos/800x600/iQJKs_461064c2e5b9f0e3b.webp?token=Ynk2eE45cm9KZkNSR3MvSjJCL3pReGRyZjIzQlNodllzNFp5MG85V1lLeTM1c0F5WlFvSUlZeXVVaHQyWFI5cjZnU1JEYitDS0ZaZ3l3VTRoWkZPUTV4eFg1clVFRTRLWnVDV0g3b09TZ0o1UGpPR2xBMWFrQjJ1cWlsUXg3N28=",
				],
				localization: "Xangri-lá, RS",
			},
		],
	},
	{
		cliente: "Maiojama",
		imagens: [
			{
				subtitulo: "Trend24 Porto Alegre, RS",
				query_busca: "Trend24 Porto Alegre fachada",
				urls_imagens: [
					"https://eduardobecker.com/wp-content/uploads/2020/12/01_Trend-24-Maiojama.jpg",
					"https://eduardobecker.com/wp-content/uploads/2020/12/02_Trend-24-Maiojama.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "MW Porto Alegre, RS",
				query_busca: "MW Porto Alegre fachada",
				urls_imagens: [
					"https://www.verabernardes.com.br/fotos/g/iP63bV63h035t6f_449136436f3f91149a.webp?token=Ym5Fb09SSTVuMmpFSVVLYTVyNUp5Uk1ad2dQYXBNS1V2a08rOEpHOEFlTFRpdlNnaFNlTGZwTEtCTnVjQUxhbGx3ZnVUQTRQUlhEMTJ4ejdJWEVoRzk4dGVOc0pBZmhXTVpmcGJYNkQ4bUxTcnN1NzhubkYxZkhRNER1M0tLdnE=",
					"https://www.passowimoveis.com.br/vista.imobi/fotos/19816/i1ei00z643DOY_19816628f99b832771.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Ares Soledade Porto Alegre, RS",
				query_busca: "Ares Soledade Porto Alegre fachada",
				urls_imagens: [
					"https://www.maiojama.com.br/static/website/new/img/ares/galeria/1.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Parador 2447 Porto Alegre, RS",
				query_busca: "Parador 2447 Porto Alegre fachada",
				urls_imagens: [
					"https://www.maiojama.com.br/static/website/new/img/parador/parador_01.png",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Anita Residences Porto Alegre, RS",
				query_busca: "Anita Residences Porto Alegre fachada fachada",
				urls_imagens: [
					"https://piacini.com.br/wp-content/uploads/2022/01/WhatsApp-Image-2023-01-09-at-12.29.54.jpeg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "ABF Developments",
		imagens: [
			{
				subtitulo: "Alfa Residences Porto Alegre, RS",
				query_busca: "Alfa Residences Porto Alegre fachada",
				urls_imagens: [
					"https://static.wixstatic.com/media/1998d6_05596c26b0d246c2bf26adca0932eafe~mv2.jpg/v1/fill/w_2500,h_1049,al_c/1998d6_05596c26b0d246c2bf26adca0932eafe~mv2.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Magno Três Figueiras Porto Alegre, RS",
				query_busca: "Magno Três Figueiras Porto Alegre fachada",
				urls_imagens: [
					"https://www.modernaidade.com.br/wp-content/uploads/2024/12/FACHADA-scaled.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "4D Complex Porto Alegre, RS",
				query_busca: "4D Complex Porto Alegre fachada",
				urls_imagens: [
					"https://ronaldorezende.com.br/app/uploads/2023/04/ABF_TAMANDARE_FACHADA_VOLUNTARIOS_FINAL_CMYK-1440x915.jpg",
					"https://portoimagem.wordpress.com/wp-content/uploads/2023/06/abf_tamandare_fachada_almirante_final-scaled-1.jpg",
					"https://vitaaltopadrao.com.br/wp-content/uploads/2022/01/Boulevard-4d-complex.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Magno Moinhos Porto Alegre, RS",
				query_busca: "hospital Magno Moinhos Porto Alegre",
				urls_imagens: [
					"https://static.wixstatic.com/media/1998d6_2337d197adaa4aeb9f28463fb05ee6a7~mv2.jpg/v1/fill/w_2500,h_2084,al_c/1998d6_2337d197adaa4aeb9f28463fb05ee6a7~mv2.jpg",
					"https://vitaaltopadrao.com.br/wp-content/uploads/2022/04/Magno-moinhos-fachada-1-1-scaled.jpg",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Hola Sunset Lofts Porto Alegre, RS",
				query_busca: "Hola Sunset Lofts Porto Alegre fachada",
				urls_imagens: [
					"https://www.arquiteturanacional.com.br/images/uploads/posts/desktop/gnd-02-fachada-a-ef_1756923846.jpg",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
	{
		cliente: "Grupo Isdra",
		imagens: [
			{
				subtitulo: "Master Hotel Holiday Inn Porto Alegre, RS",
				query_busca: "Master Hotel Holiday Inn Porto Alegre fachada",
				urls_imagens: [
					"https://images.trvl-media.com/lodging/1000000/480000/477300/477253/1014c80a.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
				],
				localization: "Porto Alegre, RS",
			},
			{
				subtitulo: "Master Express Cidade Baixa Porto Alegre, RS",
				query_busca: "Master Express Cidade Baixa Porto Alegre fachada",
				urls_imagens: [
					"https://images.trvl-media.com/lodging/9000000/8130000/8120200/8120186/5fe37123.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
				],
				localization: "Porto Alegre, RS",
			},
		],
	},
];

function setCategory(projects: FlatProject[]): Set<string> {
	return new Set(["Todos", ...projects.map((p) => p.category)]);
}

const cardVariants: Variants = {
	initial: { opacity: 0, y: 16, scale: 0.97 },
	animate: (index: number) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.3,
			delay: Math.min(index, 8) * 0.04,
			ease: "easeOut" as const,
		},
	}),
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.15, ease: "easeIn" as const },
	},
};

export default function ProjetosPage() {
	const [activeCategory, setActiveCategory] = useState("Todos");

	const flatProjects: FlatProject[] = useMemo(
		() =>
			(json_projects as ProjectGroup[]).flatMap((group) =>
				group.imagens.map((img) => ({
					title: img.subtitulo,
					category: group.cliente,
					client: group.cliente,
				})),
			),
		[],
	);

	const filteredProjects = useMemo(
		() =>
			activeCategory === "Todos"
				? flatProjects
				: flatProjects.filter((p) => p.category === activeCategory),
		[activeCategory, flatProjects],
	);

	return (
		<>
			<Header />
			<main className="pt-20">
				{/* Hero */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-3xl text-center">
							<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
								<span className="h-px w-8 bg-primary" />
								Projetos
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Nossos Projetos
							</h1>
						</div>
					</div>
				</section>

				{/* Filtros */}
				<section className="py-8 border-b border-border">
					<div className="mx-auto max-w-7xl lg:px-8">
						<div className="grid grid-cols-2 gap-2 px-6 md:flex md:flex-wrap md:justify-center md:px-0">
							{Array.from(setCategory(flatProjects)).map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
										activeCategory === category
											? "bg-primary text-primary-foreground scale-105"
											: "bg-muted text-muted-foreground hover:bg-muted/80"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</section>

				{/* Lista de Projetos */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<LayoutGroup>
							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								<AnimatePresence mode="popLayout">
									{filteredProjects.map((project, index) => (
										<motion.div
											key={project.title}
											custom={index}
											variants={cardVariants}
											initial="initial"
											animate="animate"
											exit="exit"
											layout="position"
											className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
										>
											<div className="relative">
												<ImageCarousel
													title={project.title}
													images={findImagesByTitle(project.title)}
													priority={index === 0}
													loading={index > 0 && index < 6 ? "eager" : "lazy"}
												/>
												<div className="absolute top-4 left-4">
													<span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
														{project.category}
													</span>
												</div>
											</div>

											<div className="p-6">
												<h3 className="text-lg font-semibold text-foreground">
													{project.title}
												</h3>

												{/* [MUDANÇA] Empresa + Localização — dois itens agora.
												 *
												 * [CONCEITO] Condicional com && (short-circuit evaluation):
												 * `{valor && <Componente />}` só renderiza <Componente />
												 * se `valor` for truthy. É a forma idiomática em React
												 * de renderização condicional sem else.
												 * Equivale a: if (valor) return <Componente />
												 */}
												<div className="flex flex-col gap-1.5 mt-2">
													{/* Empresa — acima da localização */}
													{findClientByTitle(project.title) && (
														<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
															<Building2 className="h-4 w-4 flex-shrink-0 text-primary/60" />
															{findClientByTitle(project.title)}
														</span>
													)}

													{/* Localização */}
													<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
														<MapPin className="h-4 w-4 flex-shrink-0" />
														{findLocationByTitle(project.title) ||
															"Localização desconhecida"}
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						</LayoutGroup>
					</div>
				</section>

				{/* CTA */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center max-w-2xl mx-auto">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Quer ver seu projeto aqui?
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Entre em contato conosco para discutir como podemos transformar
								sua visão em realidade.
							</p>
							<Button size="lg" className="mt-8" asChild>
								<Link href="/contato">
									Iniciar Projeto
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
