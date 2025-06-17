import { Button, Modal, TextControl } from "@wordpress/components";
import { useState } from "@wordpress/element";
import EditPageForm from "./editPageForm";

export const PageEditButton = ({ pageId }: { pageId: number }) => {
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <Button onClick={openModal} variant="primary">
        Edit
      </Button>
      {isOpen && (
        <Modal onRequestClose={closeModal} title="Edit page">
          <EditPageForm
            pageId={pageId}
            onCancel={closeModal}
            onSaveFinished={closeModal}
          />
        </Modal>
      )}
    </>
  );
};

export default PageEditButton;
