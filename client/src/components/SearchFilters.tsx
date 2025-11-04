import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

export interface FilterOptions {
  searchText?: string;
  tipo?: string;
  status?: string;
  cidade?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  quartos?: number;
  suites?: number;
  vagas?: number;
}

interface SearchFiltersProps {
  onFilter: (filters: FilterOptions) => void;
  onClear?: () => void;
}

export function SearchFilters({ onFilter, onClear }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (text: string) => {
    const newFilters = { ...filters, searchText: text };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClear?.();
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar e Filtrar
        </CardTitle>
        <CardDescription>Encontre imóveis com filtros avançados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Busca Rápida */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar por endereço, título ou descrição</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar..."
              className="pl-10"
              value={filters.searchText || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={filters.tipo || ""}
              onValueChange={(value) => handleFilterChange("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="cobertura">Cobertura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="alugado">Alugado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cidade</label>
            <Input
              placeholder="Digite a cidade"
              value={filters.cidade || ""}
              onChange={(e) => handleFilterChange("cidade", e.target.value)}
            />
          </div>
        </div>

        {/* Botão para Mostrar/Esconder Filtros Avançados */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          {showAdvanced ? "Ocultar Filtros Avançados" : "Mostrar Filtros Avançados"}
        </Button>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t">
            {/* Preço */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Faixa de Preço</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Mínimo</label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Máximo</label>
                  <Input
                    type="number"
                    placeholder="R$ 999.999"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Área */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Faixa de Área (m²)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Mínima</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minArea || ""}
                    onChange={(e) =>
                      handleFilterChange("minArea", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Máxima</label>
                  <Input
                    type="number"
                    placeholder="999"
                    value={filters.maxArea || ""}
                    onChange={(e) =>
                      handleFilterChange("maxArea", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Características</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Quartos</label>
                  <Select
                    value={filters.quartos?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("quartos", value ? parseInt(value) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Suítes</label>
                  <Select
                    value={filters.suites?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("suites", value ? parseInt(value) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Vagas</label>
                  <Select
                    value={filters.vagas?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("vagas", value ? parseInt(value) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
