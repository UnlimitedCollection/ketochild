export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export async function generateSignedUploadUrl(
  _objectName: string,
  _contentType: string,
): Promise<{ signedUrl: string; publicUrl: string }> {
  throw new Error("Object storage not configured");
}

export async function getObjectStream(_objectName: string): Promise<NodeJS.ReadableStream> {
  throw new ObjectNotFoundError();
}

export async function getPublicUrl(_objectName: string): Promise<string> {
  throw new ObjectNotFoundError();
}

export async function deleteObject(_objectName: string): Promise<void> {
  throw new Error("Object storage not configured");
}
