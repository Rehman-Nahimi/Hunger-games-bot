import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export function CreateRoundMessage(buffers: Buffer[], roundNumber: number) {
  //Creates Arrays of the Size of the Buffer.
  const exampleEmbeds: EmbedBuilder[] = new Array<EmbedBuilder>(buffers.length);
  const myAttachments: AttachmentBuilder[] = new Array<AttachmentBuilder>(
    buffers.length
  );

  //Creates Attachment Objects for each buffer and saves them in the Arrays.
  for (let i = 0; i < buffers.length; i++) {
    const exampleEmbed = new EmbedBuilder()
      .setTitle(`Round ${roundNumber}`)
      .setColor(0x0099ff);

    const myAttachment = new AttachmentBuilder(buffers[i], {
      name: `GameBuffer_${i}.png`,
    });
    exampleEmbed.setImage(`attachment://${myAttachment.name}`);

    //push to the array examplesEmbeds
    exampleEmbeds[i] = exampleEmbed;
    //push to the array myAttachments
    myAttachments[i] = myAttachment;
  }

  //Create the Result Object.
  const result = {
    content: "Game Image",
    embeds: exampleEmbeds,
    files: myAttachments,
  };

  return result;
}

export function CreateDieMessage(buffers: Buffer[]) {
  //Creates Arrays of the Size of the Buffer.
  const exampleEmbeds: EmbedBuilder[] = new Array<EmbedBuilder>(buffers.length);
  const myAttachments: AttachmentBuilder[] = new Array<AttachmentBuilder>(
    buffers.length
  );

  //Creates Attachment Objects for each buffer and saves them in the Arrays.
  for (let i = 0; i < buffers.length; i++) {
    const exampleEmbed = new EmbedBuilder()
      .setTitle("Round ")
      .setColor(0xff0000);

    const myAttachment = new AttachmentBuilder(buffers[i], {
      name: `DieBuffer_${i}.png`,
    });
    exampleEmbed.setImage(`attachment://${myAttachment.name}`);

    //push to the array examplesEmbeds
    exampleEmbeds[i] = exampleEmbed;
    //push to the array myAttachments
    myAttachments[i] = myAttachment;
  }

  //Create the Result Object.
  const result = {
    content: "Die Images",
    embeds: exampleEmbeds,
    files: myAttachments,
  };

  return result;
}
