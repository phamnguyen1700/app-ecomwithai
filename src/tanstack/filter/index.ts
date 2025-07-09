import { useQuery } from "@tanstack/react-query";
import { getBrands, getSkinTypes,getSkinConcerns, getIngredients } from "@/zustand/services/filter";
export function useFilterOptions() {
    const brandsQ     = useQuery({ queryKey: ["brands"],     queryFn: getBrands     });
    const skinTypesQ  = useQuery({ queryKey: ["skinTypes"],  queryFn: getSkinTypes  });
    const ingredientsQ= useQuery({ queryKey: ["ingredients"],queryFn: getIngredients});
    const concernsQ   = useQuery({ queryKey: ["concerns"],   queryFn: getSkinConcerns });
    return {
        brands:       brandsQ.data       ?? [],
        skinTypes:    skinTypesQ.data    ?? [],
        ingredients:  ingredientsQ.data  ?? [],
        skinConcerns: concernsQ.data     ?? [],  // ← expose
        isLoading:
          brandsQ.isLoading ||
          skinTypesQ.isLoading ||
          ingredientsQ.isLoading ||
          concernsQ.isLoading,
      };
    }