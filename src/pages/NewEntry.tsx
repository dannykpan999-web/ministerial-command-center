import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FileUpload, type UploadedFile } from '@/components/documents/FileUpload';
import { documentsApi, type CreateDocumentDto } from '@/lib/api/documents.api';
import { useCreateDocument } from '@/hooks/useDocuments';
import { entitiesApi } from '@/lib/api/entities.api';
import { usersApi } from '@/lib/api/users.api';
import { Loader2, FileText } from 'lucide-react';

const documentTypes = [
  'Oficio',
  'Memorando',
  'Circular',
  'Resolución',
  'Decreto',
  'Informe',
  'Solicitud',
  'Carta',
  'Acuerdo',
  'Otro'
];

export default function NewEntry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createDocument = useCreateDocument();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    direction: 'IN' as 'IN' | 'OUT',
    classification: 'EXTERNAL' as 'INTERNAL' | 'EXTERNAL',
    sender: '',
    channel: '',
    entityId: '',
    responsibleId: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    content: '',
    receivedAt: new Date().toISOString().split('T')[0],
  });

  // Fetch entities (departments)
  const { data: entities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Por favor ingrese el título del documento');
      return;
    }
    if (!formData.type) {
      toast.error('Por favor seleccione el tipo de documento');
      return;
    }
    if (!formData.entityId) {
      toast.error('Por favor seleccione un departamento');
      return;
    }
    if (!formData.responsibleId) {
      toast.error('Por favor asigne un responsable');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Creando documento...');

      // Create document
      const createDto: CreateDocumentDto = {
        title: formData.title,
        type: formData.type,
        direction: formData.direction,
        classification: formData.classification,
        origin: formData.sender || undefined,
        channel: formData.channel || undefined,
        entityId: formData.entityId,
        responsibleId: formData.responsibleId,
        priority: formData.priority,
        content: formData.content || undefined,
        receivedAt: formData.receivedAt ? new Date(formData.receivedAt) : undefined,
      };

      const document = await createDocument.mutateAsync(createDto);

      // Upload files if any
      if (uploadedFiles.length > 0) {
        const filesToUpload = uploadedFiles
          .filter((f) => f.file)
          .map((f) => f.file!);

        if (filesToUpload.length > 0) {
          await documentsApi.uploadFiles(document.id, filesToUpload);
        }
      }

      toast.dismiss();

      // Wait for all document queries to refetch before navigating
      await queryClient.refetchQueries({ queryKey: ['documents'] });

      // Navigate to inbox
      navigate('/inbox');
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast.dismiss();
      toast.error('Error al crear documento: ' + (error.response?.data?.message || error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <PageHeader
        title="Nuevo Documento"
        description="Complete el formulario para crear un nuevo documento"
        icon={FileText}
      />

      <form onSubmit={handleSubmit} className="mt-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Asunto / Título del Documento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: Solicitud de información presupuestaria"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Type and Direction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo de Documento <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.direction}
                  onValueChange={(value: 'IN' | 'OUT') => setFormData({ ...formData, direction: value })}
                >
                  <SelectTrigger id="direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrante (INCOMING)</SelectItem>
                    <SelectItem value="OUT">Saliente (OUTGOING)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sender and Channel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Remitente / Procedencia</Label>
                <Input
                  id="sender"
                  placeholder="Ej: Ministerio de Educación"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Canal de Recepción</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => setFormData({ ...formData, channel: value })}
                >
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Seleccione canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
                    <SelectItem value="Plataforma digital">Plataforma digital</SelectItem>
                    <SelectItem value="Mensajería física">Mensajería física</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Fax">Fax</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department and Responsible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity">
                  Departamento / Entidad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.entityId}
                  onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                >
                  <SelectTrigger id="entity">
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity: any) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">
                  Responsable <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.responsibleId}
                  onValueChange={(value) => setFormData({ ...formData, responsibleId: value })}
                >
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Seleccione responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} - {u.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority, Classification, and Received Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baja</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification">Clasificación</Label>
                <Select
                  value={formData.classification}
                  onValueChange={(value: any) => setFormData({ ...formData, classification: value })}
                >
                  <SelectTrigger id="classification">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNAL">Interna</SelectItem>
                    <SelectItem value="EXTERNAL">Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivedAt">Fecha de Recepción</Label>
                <Input
                  id="receivedAt"
                  type="date"
                  value={formData.receivedAt}
                  onChange={(e) => setFormData({ ...formData, receivedAt: e.target.value })}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenido / Descripción</Label>
              <Textarea
                id="content"
                placeholder="Descripción del documento..."
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Archivos Adjuntos</Label>
              <FileUpload
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={10}
                maxSize={50 * 1024 * 1024} // 50MB
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Documento
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
