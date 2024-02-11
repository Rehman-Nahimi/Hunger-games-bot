import nodeHtmlToImage from "node-html-to-image";

// Creates Picture Buffers from an Array of Strings Representing an Image in HTML-Form.
export async function GetPictureBuffer(htmlStrings: string[]) {
  const buffers: Buffer[] = [];

  for (let i = 0; i < htmlStrings.length; i++) {
    const image = await nodeHtmlToImage({
      html: htmlStrings[i],
    });

    buffers.push(image as Buffer);
  }

  return buffers;
}

// Creates Picture Buffers from an Array of Strings Representing an Image in HTML-Form.
export async function GetPictureBufferSingle(htmlString: string) {
  const image = await nodeHtmlToImage({
    html: htmlString,
  });

  const buffer = image as Buffer;

  return buffer;
}
