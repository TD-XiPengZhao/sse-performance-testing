import generateUrl from "./generateUrl";

function onSubscribeChange() {
  const user_id = "";
  const interactionIds = "";

  sseSdk = new SSESdk(
    `/cds/subscription/${user_id}?interaction_ids=${interactionIds.join(",")}`
  );

  sseSdk.subscribe((message) => {
    send(message.interaction_id, Events.onNewMessage, message);
  });
}

function send(key, event, payload) {
  emitter.emit(key, event, payload);
}

function destroy() {
  unsubscribeRtm();
  sseSdk?.unsubscribe();
  clearTimer();
}
