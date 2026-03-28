import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemOrderButtonsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  moveUpTestId: string;
  moveDownTestId: string;
}

export function ItemOrderButtons({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  moveUpTestId,
  moveDownTestId,
}: ItemOrderButtonsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="p-1"
        data-testid={moveUpTestId}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="p-1"
        data-testid={moveDownTestId}
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
    </>
  );
}
