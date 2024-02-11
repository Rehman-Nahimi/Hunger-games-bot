import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { Player } from "../../types/Player";
import { client } from "../..";
import { CreateWinnerHTML } from "./HtmlFactory";
import { GetPictureBufferSingle } from "./PictureFactory";

export function CreateRoundMessage(buffers: Buffer[], roundNumber: number) {
  const myAttachments = CreateMessageAttachments(
    buffers,
    `Round ${roundNumber}`
  );

  //Create the Result Object.
  const result = {
    content: "Game Image",
    embeds: myAttachments[0],
    files: myAttachments[1],
  };

  return result;
}

export function CreateDieMessage(buffers: Buffer[]) {
  const myAttachments = CreateMessageAttachments(
    buffers,
    "Death of Round",
    0xff0000
  );

  //Create the Result Object.
  const result = {
    content: "Die Images",
    embeds: myAttachments[0],
    files: myAttachments[1],
  };

  return result;
}

export  function CreateEndMessage(buffer : Buffer) {
  const buffers: Buffer[] = [];
  buffers.push(buffer);

  const myAttachments = CreateMessageAttachments(
    buffers,
    "The WINNER",
    0x1abc9c
  );

  //Create the Result Object.
  const result = {
    content: "The Winner",
    embeds: myAttachments[0],
    files: myAttachments[1],
  };
  return result;
}

function CreateMessageAttachments(
  buffers: Buffer[],
  title: string,
  embedColor = 0x0099ff
): [EmbedBuilder[], AttachmentBuilder[]] {
  //
  const exampleEmbeds: EmbedBuilder[] = new Array<EmbedBuilder>(buffers.length);
  const myAttachments: AttachmentBuilder[] = new Array<AttachmentBuilder>(
    buffers.length
  );

  //Creates Attachment Objects for each buffer and saves them in the Arrays.
  for (let i = 0; i < buffers.length; i++) {
    const exampleEmbed = new EmbedBuilder()
      .setTitle(title)
      .setColor(embedColor)
      .setTimestamp()
      .setFooter({
        text: "Hosted by Hunger games bot",
        iconURL: `${client.user?.avatarURL()}`,
      });

    const myAttachment = new AttachmentBuilder(buffers[i], {
      name: `${title.replace(/\s/g, "")}_${i}.png`,
    });
    exampleEmbed.setImage(`attachment://${myAttachment.name}`);

    //push to the array examplesEmbeds
    exampleEmbeds[i] = exampleEmbed;
    //push to the array myAttachments
    myAttachments[i] = myAttachment;
  }

  return [exampleEmbeds, myAttachments];
}

