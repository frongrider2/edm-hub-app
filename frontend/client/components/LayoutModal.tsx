import AddTrackPlaylistModal from "@/components/modal/AddTrackPlaylistModal";
import CreatePlaylistModal from "@/components/modal/CreatePlaylistModal";
import Modal from "@/components/utility/Modal";
import { cn } from "@/lib/utils";
import { useModal } from "@/states/modal/hooks";
import { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function LayoutModal({ children, className }: LayoutProps) {
  const { modalState, closeModal, openModal } = useModal();

  useEffect(() => {
    const favTagSlugs = localStorage.getItem("favorite_tag_slugs");
    if (!favTagSlugs) {
      openModal({ id: "select-tags" });
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      {children}

      {/* <Modal
        isBox={true}
        isOpen={modalState["select-tags"]}
        onClose={() => {
          closeModal("select-tags");
        }}
        title="Select Favorite Tags"
      >
        <SelectTagsModal />
      </Modal> */}

      <Modal
        isBox={true}
        isOpen={modalState["create-playlist"]}
        onClose={() => {
          closeModal("create-playlist");
        }}
        title="Create playlist"
      >
        <CreatePlaylistModal />
      </Modal>

      <Modal
        isBox={true}
        isOpen={modalState["add-playlist"]}
        onClose={() => {
          closeModal("add-playlist");
        }}
        title="Add Track to Playlist"
      >
        <AddTrackPlaylistModal />
      </Modal>
    </div>
  );
}
