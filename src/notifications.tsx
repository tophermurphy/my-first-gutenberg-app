import { Snackbar } from "@wordpress/components";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";

type Props = {
    id: string;
    content: string;
}

export const Notification = (props: Props) => {
  const { removeNotice } = useDispatch(noticesStore);
  const { id, content } = props

  return (
    <Snackbar className="components-editor-notices__snackbar" actions={[{onClick: () => removeNotice(id), label: "x"}]} >
        { content }
    </Snackbar>
  );
};

export default Notification;
