import Modal from "./Modal";
import Button from "./Button";

/**
 * مودال تأكيد حذف عام - قابل لإعادة الاستخدام في أي صفحة
 *
 * مثال الاستخدام:
 * <DeleteConfirmModal
 *   isOpen={!!deleteTarget}
 *   onClose={() => setDeleteTarget(null)}
 *   onConfirm={handleConfirmDelete}
 *   loading={deleting}
 *   title="Delete Transaction"
 *   itemName={targetTransaction?.description}
 * />
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}) {
  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-trash text-red-500" />
          </div>

          <div>
            <p className="text-text-primary font-medium">{message}</p>

            {itemName && (
              <p className="text-text-muted text-sm mt-1 break-words">
                "{itemName}"
              </p>
            )}

            <p className="text-text-muted text-sm mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <i className="fa-solid fa-trash mr-2" />
                {confirmLabel}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
