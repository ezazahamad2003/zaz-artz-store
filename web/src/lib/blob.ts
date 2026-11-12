import { BlobServiceClient } from "@azure/storage-blob";

function service() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) return null;
  return BlobServiceClient.fromConnectionString(conn);
}

export const blobConfigured = () => Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING);

/**
 * Upload bytes to a public container and return the URL.
 * Falls back to a data: URL when storage is not configured (local dev).
 */
export async function uploadBlob(
  container: "designs" | "uploads" | "products",
  name: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  const svc = service();
  if (!svc) {
    return `data:${contentType};base64,${data.toString("base64")}`;
  }
  const cc = svc.getContainerClient(container);
  await cc.createIfNotExists({ access: "blob" });
  const blob = cc.getBlockBlobClient(name);
  await blob.uploadData(data, {
    blobHTTPHeaders: { blobContentType: contentType, blobCacheControl: "public, max-age=31536000" },
  });
  return blob.url;
}

export function dataUrlToBuffer(dataUrl: string) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!m) throw new Error("Not a base64 data URL");
  return { contentType: m[1], buffer: Buffer.from(m[2], "base64") };
}
