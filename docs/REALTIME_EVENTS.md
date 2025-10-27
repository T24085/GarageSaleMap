# Realtime Event Contract

All messages are JSON encoded and namespaced using Socket.IO. Clients must authenticate with a JWT before emitting application events.

## Client → Server events

| Event | Payload | Description |
| --- | --- | --- |
| `auth:token` | `{ token }` | Optional explicit auth message if headers are not available |
| `join_game` | `{ gameId, userId }` | Adds the socket to the game room |
| `leave_game` | `{ gameId, userId }` | Removes the socket from the room |
| `location_update` | `{ gameId, lat, lng, heading, speed, accuracy?, timestamp }` | Broadcasts the player's latest telemetry |
| `create_squad` | `{ gameId, squadId, name, color }` | Creates a squad |
| `join_squad` | `{ gameId, squadId, userId }` | Adds a player to a squad |
| `leave_squad` | `{ gameId, squadId, userId }` | Removes a player from a squad |
| `map_annot_create` | `{ gameId, annotation }` | Persists and broadcasts a new annotation |
| `map_annot_update` | `{ gameId, annotationId, patch }` | Updates an annotation |
| `map_annot_delete` | `{ gameId, annotationId }` | Deletes an annotation |
| `map_order` | `{ gameId, annotations }` | Bulk update ordering |
| `chat_message` | `{ gameId, target, text, toUserId? }` | Sends chat to the specified channel |
| `webrtc_offer` | `{ gameId, to, sdp }` | Forwards a WebRTC offer |
| `webrtc_answer` | `{ gameId, to, sdp }` | Forwards a WebRTC answer |
| `webrtc_candidate` | `{ gameId, to, candidate }` | ICE candidate passthrough |
| `voice_mute` | `{ gameId, muted }` | Toggle push-to-talk state |

## Server → Client events

| Event | Payload | Description |
| --- | --- | --- |
| `player_location` | `{ userId, lat, lng, heading, timestamp }` | Broadcast telemetry |
| `player_joined` | `{ userId }` | Notifies when a player joins |
| `player_left` | `{ userId }` | Notifies when a player leaves |
| `squad_update` | `{ squadId, members }` | Squad membership snapshot |
| `map_annot_created` | `{ annotation }` | Annotation created |
| `map_annot_updated` | `{ annotation }` | Annotation updated |
| `map_annot_deleted` | `{ annotationId }` | Annotation deleted |
| `chat_message` | `{ message }` | Chat broadcast |
| `webrtc_offer` | `{ from, sdp }` | Offer forwarded to peer |
| `webrtc_answer` | `{ from, sdp }` | Answer forwarded to peer |
| `webrtc_candidate` | `{ from, candidate }` | Candidate forwarded to peer |

Rate limiting and validation should occur server-side to prevent abuse.
