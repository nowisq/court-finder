"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourtForm } from "@/components/court/CourtForm";

interface RegisterCourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number | null;
  longitude: number | null;
  initialAddress?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RegisterCourtDialog = ({
  open,
  onOpenChange,
  latitude,
  longitude,
  initialAddress,
  onSuccess,
  onCancel,
}: RegisterCourtDialogProps) => {
  const canRenderForm = open && latitude != null && longitude != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새로운 농구장 등록</DialogTitle>
        </DialogHeader>
        {canRenderForm && (
          <div className="pt-2">
            <CourtForm
              latitude={latitude as number}
              longitude={longitude as number}
              initialAddress={initialAddress ?? undefined}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
