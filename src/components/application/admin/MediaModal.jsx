import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import loading from "$/public/assets/images/loading.svg";
import axios from "axios";
import { ModalMediaBlock } from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import ButtonLoading from "../ButtonLoading";
const MediaModal = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  const [cols, setCols] = React.useState(6);

  React.useEffect(() => {
    const update = () => setCols(window.innerWidth < 1024 ? 3 : 6);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const fetchMedia = async (page) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=18&&deleteType=SD`,
    );
    return response;
  };
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["mediaModal"],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });
  const [previouslySelected, setPreviouslySelected] = useState([]);
  React.useEffect(() => {
    if (open) {
      setPreviouslySelected(selectedMedia);
    }
  }, [open]);
  const handleClear = () => {
    setSelectedMedia([]);
    setPreviouslySelected([]);
    showToast("success", "Media selection cleared.");
  };
  const handleSelect = () => {
    if (selectedMedia.length <= 0) {
      return showToast("error", "please Select a Media");
    }
    setPreviouslySelected(selectedMedia);
    setOpen(false);
  };
  const handleClose = () => {
    setSelectedMedia(previouslySelected);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {isPending ? (
            <div className="size-full flex justify-center items-center">
              <Image src={loading} alt="loading" height={80} width={80} />
            </div>
          ) : isError ? (
            <div className="size-full flex justify-center items-center">
              <span className="text-red-500">{error.message}</span>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: "8px",
                }}
              >
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData.map((media) => (
                      <div key={media._id}>
                        <ModalMediaBlock
                          key={media._id}
                          media={media}
                          selectedMedia={selectedMedia}
                          setSelectedMedia={setSelectedMedia}
                          isMultiple={isMultiple}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
          {hasNextPage ?
          <div className="flex justify-center py-5">
            <ButtonLoading
              type='button'
              onClick={()=>fetchNextPage()}
              loading={isFetching}
              text="Load More"
            /> 
          </div>
          :
          <p className="text-center py-5"> Nothing more to load
          </p>}
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
