import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  validarCPF,
  validarCNPJ,
  validarCEP,
  formatarCPF,
  formatarCNPJ,
  formatarCEP,
  buscarEnderecoPorCEP,
} from "@/lib/validators";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FormInputValidadoProps {
  tipo: "cpf" | "cnpj" | "cep";
  value: string;
  onChange: (value: string) => void;
  onEnderecoEncontrado?: (endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FormInputValidado({
  tipo,
  value,
  onChange,
  onEnderecoEncontrado,
  placeholder,
  disabled,
}: FormInputValidadoProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  const getPlaceholder = () => {
    switch (tipo) {
      case "cpf":
        return placeholder || "000.000.000-00";
      case "cnpj":
        return placeholder || "00.000.000/0000-00";
      case "cep":
        return placeholder || "00000-000";
      default:
        return placeholder || "";
    }
  };

  const getLabel = () => {
    switch (tipo) {
      case "cpf":
        return "CPF";
      case "cnpj":
        return "CNPJ";
      case "cep":
        return "CEP";
      default:
        return "";
    }
  };

  const formatValue = (val: string) => {
    switch (tipo) {
      case "cpf":
        return formatarCPF(val);
      case "cnpj":
        return formatarCNPJ(val);
      case "cep":
        return formatarCEP(val);
      default:
        return val;
    }
  };

  const validateValue = (val: string) => {
    switch (tipo) {
      case "cpf":
        return validarCPF(val);
      case "cnpj":
        return validarCNPJ(val);
      case "cep":
        return validarCEP(val);
      default:
        return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setError("");
    setIsValid(null);
  };

  const handleValidate = async () => {
    if (!value) {
      setError("Campo obrigatório");
      setIsValid(false);
      return;
    }

    setIsValidating(true);

    try {
      if (validateValue(value)) {
        setIsValid(true);
        setError("");

        // Se for CEP, buscar endereço
        if (tipo === "cep") {
          const endereco = await buscarEnderecoPorCEP(value);
          if (endereco) {
            onEnderecoEncontrado?.(endereco);
          } else {
            setError("CEP não encontrado");
            setIsValid(false);
          }
        }
      } else {
        setIsValid(false);
        setError(`${getLabel()} inválido`);
      }
    } catch (err) {
      setIsValid(false);
      setError("Erro ao validar");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{getLabel()}</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={getPlaceholder()}
            disabled={disabled || isValidating}
            className={
              isValid === true
                ? "border-green-500"
                : isValid === false
                  ? "border-red-500"
                  : ""
            }
          />
          {isValid === true && (
            <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
          )}
          {isValid === false && (
            <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleValidate}
          disabled={disabled || isValidating || !value}
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Validar"
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
