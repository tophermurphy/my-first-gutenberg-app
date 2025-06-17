import { useDispatch, useSelect } from "@wordpress/data";
import { Button, Modal} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { PageForm } from "./editPageForm";
import { store as coreDataStore } from "@wordpress/core-data";

type CreatePageFormProps = {
  onCancel: () => void;
  onSaveFinished: () => void;
};

export const CreatePageButton = () => {

  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="primary">
        Create a new Page
      </Button>
      {isOpen && (
        <Modal onRequestClose={closeModal} title="Create a new Page">
          <CreatePageForm onCancel={closeModal} onSaveFinished={closeModal} />
        </Modal>
      )}
    </>
  );
};

const CreatePageForm = ({ onCancel, onSaveFinished }: CreatePageFormProps) => {
  const [title, setTitle] = useState("");
  const handleChange = (title: string) => setTitle(title);
  const { saveEntityRecord } = useDispatch(coreDataStore);
  const handleSave = async () => {
    const savedRecord = await saveEntityRecord("postType", "page", { title, status: 'publish' });
    if (savedRecord) {
      onSaveFinished();
    }
  };
  const { lastError, isSaving } = useSelect(
    (select) => ({
      //@ts-expect-error Type for .getLastEntitySaveErrror not there
      lastError: select(coreDataStore).getLastEntitySaveError(
        "postType",
        "page"
      ),
      //@ts-expect-error Type for .isSavingEntityRecord not there
      isSaving: select(coreDataStore).isSavingEntityRecord("postType", "page"),
    }),
    []
  );

  return (
    <PageForm
      title={title}
      onChangeTitle={handleChange}
      hasEdits={!!title}
      onCancel={onCancel}
      onSave={handleSave}
      lastError={lastError}
      isSaving={isSaving}
    />
  );
};

export default CreatePageButton;
