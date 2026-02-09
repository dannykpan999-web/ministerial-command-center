import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UpdateDocumentDto,
} from '@/lib/api/documents.api';
import { entitiesApi } from '@/lib/api/entities.api';
import { usersApi } from '@/lib/api/users.api';
import { useUpdateDocument } from '@/hooks/useDocuments';
import { Archive } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export function EditDocumentDialog({ open, onOpenChange, document }: EditDocumentDialogProps) {
  const updateDocument = useUpdateDocument();

  const [formData, setFormData] = useState<UpdateDocumentDto>({
    title: document.title,
    type: document.type,
    priority: document.priority,
    status: document.status,
    content: document.content || '',
    entityId: document.entityId,
    responsibleId: document.responsibleId,
  });

  // Fetch entities for dropdown
  const { data: entities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  // Fetch users for responsible dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  // Update form when document changes
  useEffect(() => {
    setFormData({
      title: document.title,
      type: document.type,
      priority: document.priority,
      status: document.status,
      content: document.content || '',
      entityId: document.entityId,
      responsibleId: document.responsibleId,
    });
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if document is archived
    if (document.status === 'ARCHIVED') {
      toast.error('No se pueden editar documentos archivados. Los documentos archivados son de solo lectura.');
      return;
    }

    // Validation
    if (!formData.title) {
      toast.error('Por favor ingrese el título del documento');
      return;
    }

    if (!formData.type) {
      toast.error('Por favor seleccione el tipo de documento');
      return;
    }

    updateDocument.mutate(
      { id: document.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !updateDocument.isPending) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => {
        if (updateDocument.isPending) e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
          <DialogDescription>
            Actualice los datos del documento #{document.correlativeNumber}
          </DialogDescription>
        </DialogHeader>

        {/* Archived Warning Banner */}
        {document.status === 'ARCHIVED' && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              <Archive className="h-4 w-4" />
              ⚠️ Documento Archivado - Solo Lectura
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Los documentos archivados no pueden ser modificados. Este formulario es solo para visualización.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Asunto del documento"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="OFICIO">Oficio</SelectItem>
                  <SelectItem value="MEMO">Memorando</SelectItem>
                  <SelectItem value="CIRCULAR">Circular</SelectItem>
                  <SelectItem value="CARTA">Carta</SelectItem>
                  <SelectItem value="INFORME">Informe</SelectItem>
                  <SelectItem value="DECRETO">Decreto</SelectItem>
                  <SelectItem value="RESOLUCION">Resolución</SelectItem>
                  <SelectItem value="OTRO">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority || 'MEDIUM'}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                  <SelectItem value="REJECTED">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity */}
            <div className="space-y-2">
              <Label htmlFor="entityId">Entidad</Label>
              <Select
                value={formData.entityId}
                onValueChange={(value) => setFormData({ ...formData, entityId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {entities.filter((e: any) => e.isActive).map((entity: any) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Responsible */}
            <div className="space-y-2">
              <Label htmlFor="responsibleId">Responsable</Label>
              <Select
                value={formData.responsibleId}
                onValueChange={(value) => setFormData({ ...formData, responsibleId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {users.filter((u: any) => u.isActive).map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="content">Contenido</Label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Contenido del documento..."
                minHeight="250px"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateDocument.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateDocument.isPending || document.status === 'ARCHIVED'}
            >
              {updateDocument.isPending ? 'Guardando...' : document.status === 'ARCHIVED' ? 'Solo Lectura' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
