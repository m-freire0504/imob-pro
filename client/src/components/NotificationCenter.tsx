import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso" | "info";
  data: Date;
  lida: boolean;
  acao?: {
    titulo: string;
    url: string;
  };
}

interface NotificationCenterProps {
  notificacoes?: Notification[];
  onNotificationRead?: (id: string) => void;
  onNotificationDelete?: (id: string) => void;
}

export function NotificationCenter({
  notificacoes = [],
  onNotificationRead,
  onNotificationDelete,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notificacoes);

  useEffect(() => {
    setNotifications(notificacoes);
  }, [notificacoes]);

  const naoLidas = notifications.filter((n) => !n.lida).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
    onNotificationRead?.(id);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onNotificationDelete?.(id);
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "sucesso":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "erro":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "aviso":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case "sucesso":
        return "bg-green-50";
      case "erro":
        return "bg-red-50";
      case "aviso":
        return "bg-yellow-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  const formatarData = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - new Date(data).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return "Agora";
    if (minutos < 60) return `${minutos}m atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;

    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
            {naoLidas}
          </Badge>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto shadow-lg z-50">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Notificações</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border ${getBgColor(notif.tipo)} ${
                    !notif.lida ? "border-l-4 border-l-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium text-sm">{notif.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notif.mensagem}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 flex-shrink-0"
                          onClick={() => handleDelete(notif.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatarData(notif.data)}
                        </span>

                        {!notif.lida && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            Marcar como lida
                          </Button>
                        )}

                        {notif.acao && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              window.location.href = notif.acao!.url;
                            }}
                          >
                            {notif.acao.titulo}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Hook para gerenciar notificações
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    titulo: string,
    mensagem: string,
    tipo: "sucesso" | "erro" | "aviso" | "info" = "info",
    acao?: { titulo: string; url: string }
  ) => {
    const id = `notif-${Date.now()}`;
    const notif: Notification = {
      id,
      titulo,
      mensagem,
      tipo,
      data: new Date(),
      lida: false,
      acao,
    };

    setNotifications((prev) => [notif, ...prev]);

    // Auto-remover após 5 segundos se for sucesso
    if (tipo === "sucesso") {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
  };
}
