import { Button } from "@wordpress/components";
import { store as coreDataStore } from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";
import { Spinner } from "@wordpress/components";
import { store as noticesStore } from "@wordpress/notices";

export const DeletePageButton = ({ pageId }: { pageId: number | string }) => {
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
  const { deleteEntityRecord } = useDispatch(coreDataStore);
  const getLastEntityDeleteError = useSelect(
    (select) => select(coreDataStore).getLastEntityDeleteError,
    [pageId]
  );

  const { isDeleting } = useSelect(
    (select) => ({
      isDeleting: select(coreDataStore).isDeletingEntityRecord(
        "postType",
        "page",
        pageId
      ),
    }),
    [pageId]
  );

  const handleClick = async () => {
    const success = await deleteEntityRecord("postType", "page", pageId, {});
    if (success) {
      createSuccessNotice("The page was deleted!", { type: "snackbar" });
    } else {
      const lastError = getLastEntityDeleteError("postType", "page", pageId);
      const message = lastError?.message || "I am error.";
      createErrorNotice(message, { type: "snackbar" });
    }
  };

  return (
    <Button variant="primary" onClick={handleClick} disabled={isDeleting}>
      {isDeleting ? (
        <>
          <Spinner />
          Deleting...
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );
};

export default DeletePageButton;
