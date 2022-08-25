import { nanoid } from "nanoid";
import chunk from "lodash.chunk";

const generateArray = (len, count) =>
  Array.from({ length: len }, () => nanoid(count));

function generateUrl({ interactionCount, env, splitCount = 50 }) {
  const interactions = generateArray(interactionCount, 32);
  const splits = Math.ceil(interactions?.length / splitCount);

  const url = `${env}/cds/subscription/`;
  const user_ids = generateArray(splits, 24);
  const split_interactions = chunk(interactions, splitCount);

  const urls = user_ids.map((_, i) => {
    return `${url}${user_ids[i]}?interaction_ids=${split_interactions[i].join(
      ","
    )}`;
  });

  return {
    urls,
    user_ids,
    interactions,
  };
}

export default generateUrl;
