import { Button } from "@features/ui";

interface IProps {
  content: string;
  loading: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteModal({ content, loading, onDelete, onClose }: IProps) {
  return (
    <>
      <p className="text-sm">{content}</p>
      <div className="flex gap-x-4">
        <Button
          buttonStyle="danger"
          onClick={onDelete}
          disabled={loading}
          loading={loading}
        >
          delete
        </Button>
        <Button buttonStyle="secondary" onClick={onClose}>
          cancel
        </Button>
      </div>
    </>
  );
}
