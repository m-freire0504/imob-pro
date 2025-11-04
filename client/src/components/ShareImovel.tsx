import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Instagram, Twitter, MessageCircle, Copy, Share2 } from "lucide-react";

interface ShareImovelProps {
  imovel: {
    id: number;
    titulo: string;
    tipo: string;
    preco?: number;
    endereco?: string;
    cidade?: string;
    descricao?: string;
    fotos?: Array<{ url: string }>;
  };
  cliente?: {
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
}

export function ShareImovel({ imovel, cliente }: ShareImovelProps) {
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateMessage = (platform: "whatsapp" | "instagram" | "twitter"): string => {
    const baseMessage = customMessage || `Confira este ${imovel.tipo} em ${imovel.cidade}!\n\n📍 ${imovel.endereco}\n💰 ${imovel.preco ? `R$ ${imovel.preco.toLocaleString("pt-BR")}` : "Consulte"}\n\n${imovel.descricao || ""}\n\nEntre em contato para mais informações!`;

    if (platform === "whatsapp") {
      return baseMessage;
    } else if (platform === "instagram") {
      return `${imovel.titulo}\n\n${baseMessage}\n\n#imóvel #${imovel.tipo} #${imovel.cidade?.toLowerCase().replace(/\s/g, "")} #imobiliaria`;
    } else if (platform === "twitter") {
      return `${imovel.titulo} em ${imovel.cidade}\n\n${baseMessage.substring(0, 200)}...\n\n#imóvel #${imovel.tipo}`;
    }

    return baseMessage;
  };

  const shareOnWhatsApp = () => {
    if (!cliente?.whatsapp) {
      toast.error("Número de WhatsApp não disponível");
      return;
    }

    const message = generateMessage("whatsapp");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cliente.whatsapp.replace(/\D/g, "")}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  const shareOnInstagram = () => {
    if (!cliente?.instagram) {
      toast.error("Instagram não disponível");
      return;
    }

    const message = generateMessage("instagram");
    const instagramUrl = `https://instagram.com/${cliente.instagram.replace("@", "")}`;
    window.open(instagramUrl, "_blank");
    toast.info("Copie a mensagem e envie via DM no Instagram");
    copyToClipboard(message);
  };

  const shareOnTwitter = () => {
    if (!cliente?.twitter) {
      toast.error("Twitter/X não disponível");
      return;
    }

    const message = generateMessage("twitter");
    const encodedMessage = encodeURIComponent(message);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    window.open(twitterUrl, "_blank");
    toast.success("Abrindo Twitter/X...");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Mensagem copiada!");
  };

  const copyWhatsAppMessage = () => {
    copyToClipboard(generateMessage("whatsapp"));
  };

  const copyInstagramMessage = () => {
    copyToClipboard(generateMessage("instagram"));
  };

  const copyTwitterMessage = () => {
    copyToClipboard(generateMessage("twitter"));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Compartilhar Imóvel
        </CardTitle>
        <CardDescription>Envie este imóvel para o cliente via redes sociais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mensagem Personalizada */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem Personalizada (Opcional)</label>
          <Textarea
            placeholder="Deixe em branco para usar a mensagem padrão..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Dica: Deixe em branco para gerar uma mensagem automática com os dados do imóvel
          </p>
        </div>

        {/* Opções de Compartilhamento */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Escolha o canal de compartilhamento:</h3>

          {/* WhatsApp */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">WhatsApp</span>
            </div>
            {cliente?.whatsapp ? (
              <div className="flex gap-2">
                <Button
                  onClick={shareOnWhatsApp}
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  Enviar no WhatsApp
                </Button>
                <Button
                  onClick={copyWhatsAppMessage}
                  variant="outline"
                  size="icon"
                  title="Copiar mensagem"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">WhatsApp não disponível para este cliente</p>
            )}
          </div>

          {/* Instagram */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="font-medium">Instagram</span>
            </div>
            {cliente?.instagram ? (
              <div className="flex gap-2">
                <Button
                  onClick={shareOnInstagram}
                  variant="default"
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                  disabled={isLoading}
                >
                  Abrir Instagram
                </Button>
                <Button
                  onClick={copyInstagramMessage}
                  variant="outline"
                  size="icon"
                  title="Copiar mensagem"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Instagram não disponível para este cliente</p>
            )}
          </div>

          {/* Twitter/X */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-500" />
              <span className="font-medium">X (Twitter)</span>
            </div>
            {cliente?.twitter ? (
              <div className="flex gap-2">
                <Button
                  onClick={shareOnTwitter}
                  variant="default"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Compartilhar no X
                </Button>
                <Button
                  onClick={copyTwitterMessage}
                  variant="outline"
                  size="icon"
                  title="Copiar mensagem"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">X (Twitter) não disponível para este cliente</p>
            )}
          </div>
        </div>

        {/* Informações do Imóvel */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-sm">Imóvel a Compartilhar:</h3>
          <p className="text-sm"><strong>{imovel.titulo}</strong></p>
          <p className="text-sm text-muted-foreground">{imovel.endereco}, {imovel.cidade}</p>
          {imovel.preco && (
            <p className="text-sm font-medium">R$ {imovel.preco.toLocaleString("pt-BR")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
