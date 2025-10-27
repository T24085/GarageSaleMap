# Data Model

All models use ISO 8601 timestamps and UUID identifiers. The default persistence layer is MongoDB.

## User

```json
{
  "_id": "uuid",
  "username": "RangerOne",
  "displayName": "Sam",
  "avatarUrl": "https://example.com/avatar.png",
  "roles": ["player"],
  "createdAt": "2025-10-27T12:00:00Z"
}
```

## Game

```json
{
  "_id": "game-uuid",
  "name": "Friday Night Milsim",
  "ownerId": "uuid",
  "createdAt": "2025-10-27T12:00:00Z",
  "isRunning": true,
  "settings": {
    "locationBroadcastHz": 1,
    "mapBase": "openstreetmap"
  }
}
```

## Squad

```json
{
  "_id": "squad-uuid",
  "gameId": "game-uuid",
  "name": "Alpha",
  "color": "#FF0000",
  "members": ["user-uuid", "user2-uuid"],
  "createdAt": "2025-10-27T12:00:00Z"
}
```

## MapAnnotation

```json
{
  "_id": "annot-uuid",
  "gameId": "game-uuid",
  "type": "marker",
  "geometry": { "lat": 38.9, "lng": -95.2 },
  "properties": {
    "label": "Enemy CP",
    "createdBy": "user-uuid",
    "icon": "skull",
    "expiresAt": null,
    "createdAt": "2025-10-27T12:00:00Z"
  }
}
```

## ChatMessage

```json
{
  "_id": "message-uuid",
  "gameId": "game-uuid",
  "senderId": "user-uuid",
  "target": "squad",
  "toUserId": null,
  "text": "Enemy spotted north ridge",
  "createdAt": "2025-10-27T12:00:00Z"
}
```
