import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MediaModal = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  const handleClear = () => {};
  const handleSelect = () => {};
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      // In MediaModal - pass size via style prop
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        style={{
          width: "80vw",
          maxWidth: "80vw",
          height: "90vh",
          maxHeight: "90vh",
        }}
        className="p-0 flex flex-col gap-0"
      >
        <DialogDescription className="hidden" />

        {/* Header */}
        <div className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-center">Media Selection</DialogTitle>
        </div>

        {/* Media Grid - takes all remaining space */}
        <div className="flex-1 overflow-auto p-4 min-h-0">
          {/* media content here */}
        </div>

        {/* Footer - pinned to bottom */}
        <div className="px-4 py-3 border-t shrink-0 flex items-center justify-between">
          <Button type="button" variant="destructive" onClick={handleClear}>
            Clear All
          </Button>
          <div className="flex gap-3">
            <Button type="button" onClick={handleSelect}>
              Select
            </Button>
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
