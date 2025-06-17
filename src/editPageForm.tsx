import { Button, TextControl, Spinner } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";

type EditPageFormType = {
  pageId: number;
  onCancel: () => void;
  onSaveFinished: () => void;
};

export const EditPageForm = ({
  pageId,
  onCancel,
  onSaveFinished,
}: EditPageFormType) => {
  const selectArgs = ["postType", "page", pageId] as [string, string, number];
  const { isSaving, hasEdits, lastError, page } = useSelect(
    (select) => ({
      isSaving: select(coreDataStore).isSavingEntityRecord(...selectArgs),
      hasEdits: select(coreDataStore).hasEditsForEntityRecord(...selectArgs),
      page: select(coreDataStore).getEditedEntityRecord(...selectArgs),
      lastError: select(coreDataStore).getLastEntitySaveError(...selectArgs),
    }),
    [pageId]
  );
  const { editEntityRecord } = useDispatch(coreDataStore);
  const handleChange = (title: string) =>
    editEntityRecord(...selectArgs, { title });
  const { saveEditedEntityRecord } = useDispatch(coreDataStore);
  const handleSave = async () => {
    const updatedRecord = await saveEditedEntityRecord(...selectArgs);
    if (updatedRecord) {
      onSaveFinished();
    }
  };

  return (
    <PageForm
      title={page && "title" in page ? page.title : ""}
      onChangeTitle={handleChange}
      hasEdits={hasEdits}
      lastError={lastError}
      isSaving={isSaving}
      onCancel={onCancel}
      onSave={handleSave}
    />
  );
};

type PageFormType = {
  title: string;
  onChangeTitle: (title: string) => void;
  hasEdits: boolean;
  lastError: {
    message: string;
  };
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export const PageForm = ({
  title,
  onChangeTitle,
  hasEdits,
  lastError,
  isSaving,
  onCancel,
  onSave,
}: PageFormType) => {
  return (
    <div className="my-gutenberg-form">
      <TextControl value={title} label="Page title:" onChange={onChangeTitle} />
      {lastError ? (
        <div className="form-error">Error: {lastError.message}</div>
      ) : (
        false
      )}
      <div className="form-buttons">
        <Button
          onClick={onSave}
          variant="primary"
          disabled={!hasEdits || isSaving}
        >
          {isSaving ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            "Save "
          )}
        </Button>
        <Button onClick={onCancel} variant="tertiary" disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditPageForm;
