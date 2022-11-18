import { Button } from "@features/ui";

interface IProps {
  content: string;
  onDelete: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function DeleteModal({ content, onDelete, onCancel, onClose }: IProps) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      <p className="text-sm">{content}</p>
      <div className="flex gap-x-4">
        <Button buttonStyle="danger" onClick={handleDelete}>
          delete
        </Button>
        <Button buttonStyle="secondary" onClick={onCancel}>
          cancel
        </Button>
      </div>
    </>
  );
}
