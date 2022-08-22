import { nanoid } from "nanoid";
import sign from "jwt-encode";
import chunk from "lodash.chunk";

const generateArray = (len, count) =>
  Array.from({ length: len }, () => nanoid(count));

function generateToken(user_id) {
  return sign(
    { user_id, account_id: "a4490fb4e2f94220874fe7f1fdd642b3" },
    "secret"
  );
}

function generateUrl({ interactionCount, env = "stg", splitCount = 50 }) {
  const interactions = generateArray(interactionCount, 32);
  const splits = Math.ceil(interactions?.length / splitCount);

  const user_ids = generateArray(splits, 24);
  const split_interactions = chunk(interactions, splitCount);

  const urls = user_ids.map((_, i) => {
    const token = generateToken(user_ids[i]);

    return `https://cds.meza.talkdesk${env}.com/cds/subscription/${
      user_ids[i]
    }?interaction_ids=${split_interactions[i].join(",")}&token=${token}`;
  });

  return {
    urls,
    user_ids,
  };
}

export default generateUrl;
