import { createRoot, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { store as noticesStore } from "@wordpress/notices";
import { Spinner, SearchControl, Button } from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import PageEditButton from "./pageEditButton";
import CreatePageButton from "./createPageButton";
import DeletePageButton from "./createDeleteButton";
import Notifications from "./notifications";

function MyFirstApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const { pages, hasResolved } = useSelect(
    (select) => {
      const query: { search?: string } = {};
      if (searchTerm) {
        query.search = searchTerm;
      }
      const selectorArgs = ["postType", "page", query] as [
        string,
        string,
        object
      ];
      return {
        pages: select(coreDataStore).getEntityRecords(...selectorArgs),
        hasResolved: (select(coreDataStore) as any).hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        ),
      };
    },
    [searchTerm]
  );
  const notices = useSelect((select) => select(noticesStore).getNotices(), []);
  const snackbarNotices = notices.filter(({ type }) => type === "snackbar");

  return (
    <div>
      <div className="list-controls">
        <SearchControl onChange={setSearchTerm} value={searchTerm} />
        <CreatePageButton />
      </div>

      <PageList pages={pages} hasResolved={hasResolved} />
      {snackbarNotices.length ? (
        <div style={{ marginTop: "80px" }}>
          {snackbarNotices.map(({ id, content }) => (
            <Notifications id={id} content={content} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PageList({
  pages,
  hasResolved,
}: {
  pages: any[] | null;
  hasResolved: boolean;
}) {
  if (!pages || !pages?.length) {
    return <div>No results</div>;
  }
  if (!hasResolved) {
    return <Spinner />;
  }

  return (
    <table className="wp-list-table widefat fixed striped table-view-list">
      <thead>
        <tr>
          <th>Title</th>
          <td style={{ width: 120 }}>Actions</td>
        </tr>
      </thead>
      <tbody>
        {pages.map((page: any) => {
          return (
            <tr key={page.id} className="page-row">
              <td>{decodeEntities(page.title.rendered)}</td>
              <td>
                <div className="form-buttons">
                  <PageEditButton pageId={page.id} />
                  <DeletePageButton pageId={page.id} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

window.addEventListener(
  "load",
  function () {
    const domNode = document.querySelector("#my-first-gutenberg-app");
    if (domNode) {
      const root = createRoot(domNode);
      root.render(<MyFirstApp />);
    }
  },
  false
);
