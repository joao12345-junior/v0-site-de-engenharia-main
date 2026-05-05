import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";

interface ImageCarouselProps {
	title: string;
	images: string[];
	fallbackIcon?: React.ReactNode;
	sizes?: string;
}

export function ImageCarousel({
	title,
	images,
	fallbackIcon,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!images || images.length === 0) {
		return (
			<div className="aspect-video bg-muted flex items-center justify-center">
				{fallbackIcon ?? <Building2 className="h-16 w-16 text-primary/30" />}
			</div>
		);
	}

	const handlePrev = () =>
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

	const handleNext = () =>
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

	return (
		<div className="aspect-video relative overflow-hidden bg-muted">
			<Image
				src={images[currentIndex]}
				alt={`${title} - Imagem ${currentIndex + 1}`}
				fill
				className="object-cover"
				priority={currentIndex === 0}
				sizes={sizes}
			/>
			{images.length > 1 && (
				<>
					<button
						onClick={handlePrev}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
						aria-label="Imagem anterior"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						onClick={handleNext}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
						aria-label="Próxima imagem"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === currentIndex ? "bg-white" : "bg-white/50"
								}`}
								aria-label={`Imagem ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
