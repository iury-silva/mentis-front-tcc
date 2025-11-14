import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = false,
  maxVisiblePages = 5,
}) => {
  // Calcula quais páginas mostrar
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Mostra todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas com ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Sempre mostra primeira página
      pages.push(1);

      if (shouldShowLeftEllipsis) {
        pages.push("ellipsis");
      } else if (leftSiblingIndex === 2) {
        pages.push(2);
      }

      // Páginas do meio
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (shouldShowRightEllipsis) {
        pages.push("ellipsis");
      } else if (rightSiblingIndex === totalPages - 1) {
        pages.push(totalPages - 1);
      }

      // Sempre mostra última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        {/* Botão Primeira Página (opcional) */}
        {showFirstLast && currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={handleFirst}
              aria-label="Ir para primeira página"
              className="cursor-pointer"
            >
              <span className="hidden sm:block">Primeira</span>
              <span className="sm:hidden">««</span>
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Botão Anterior */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            aria-disabled={currentPage === 1}
            className={cn(
              "cursor-pointer",
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Números das páginas */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
                aria-label={`Ir para página ${page}`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Botão Próximo */}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            aria-disabled={currentPage === totalPages}
            className={cn(
              "cursor-pointer",
              currentPage === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Botão Última Página (opcional) */}
        {showFirstLast && currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              onClick={handleLast}
              aria-label="Ir para última página"
              className="cursor-pointer"
            >
              <span className="hidden sm:block">Última</span>
              <span className="sm:hidden">»»</span>
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
