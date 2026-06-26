import { adminGraphql } from "./admin-auth.mjs";

/** filename.webp → { id, url } */
export async function loadFileIndex() {
  const byFilename = new Map();
  let cursor = null;

  for (;;) {
    const data = await adminGraphql(
      `query Files($cursor: String) {
        files(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            __typename
            ... on MediaImage { id alt image { url } }
            ... on GenericFile { id url }
          }
        }
      }`,
      { cursor },
    );

    for (const node of data.files.nodes) {
      const url = node.image?.url ?? node.url ?? "";
      if (!url || !node.id) continue;

      const entry = { id: node.id, url };
      const fromUrl = url.split("/").pop()?.split("?")[0] ?? "";
      if (fromUrl) byFilename.set(fromUrl, entry);

      if (node.alt) {
        byFilename.set(`${node.alt}.webp`, entry);
        byFilename.set(node.alt, entry);
      }
    }

    if (!data.files.pageInfo.hasNextPage) break;
    cursor = data.files.pageInfo.endCursor;
  }

  return byFilename;
}

export function fileEntry(index, filename) {
  if (!filename) return null;
  return (
    index.get(filename) ??
    index.get(filename.replace(/\.webp$/i, "")) ??
    null
  );
}
