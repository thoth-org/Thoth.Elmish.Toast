# API

## Usage

Any time you want to send a toast you need to follow these rules:

1. Create it and set its content using `Toast.message`
2. Pipe any number of [Builders](./#builder) you want
3. Use one of the [Triggers ](./#trigger)to set its [Status ](./#status)and send it

## Status

```fsharp
type Status =
    | Success
    | Warning
    | Error
    | Info
```

## Position

```fsharp
type Position =
    | BottomRight
    | BottomLeft
    | BottomCenter
    | TopRight
    | TopLeft
    | TopCenter
```

## Builder

| Function | Description |
| :--- | :--- |
| `Toast.message` | Create a toast and set the message content |
| `Toast.title` | Set the title content |
| `Toast.position` | Set the position |
| `Toast.icon` | Set the icon |
| `Toast.timeout` | Set the timeout in seconds |
| `Toast.noTimeout` | No timeout, make sure to add a close button or dismiss on click |
| `Toast.dismissOnClick` | Allow user to dismiss the toast by cliking on it |
| `Toast.withCloseButton` | Add a close button |

## Trigger

| Function | Description |
| :--- | :--- |
| `Toast.success` | Send the toast marked with Success status |
| `Toast.warning` | Send the toast marked with Warning status |
| `Toast.error` | Send the toast marked with Error status |
| `Toast.info` | Send the toast marked with Info status |

