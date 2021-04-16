# How to use?

Add the `Thoth.Elmish.Toast` dependency to your project

{% tabs %}
{% tab title=".NET CLI" %}
```text
dotnet add package Thoth.Elmish.Toast
```
{% endtab %}

{% tab title="Paket CLI" %}
```
paket add Thoth.Elmish.Toast
```
{% endtab %}
{% endtabs %}

Attach the toast system to your Elmish program

```fsharp
open Elmish
open Thoth.Elmish

Program.mkProgram init update view
|> Toast.Program.withToast Toast.render
|> Program.run
```

You can now send `Toast` from any command in your program.

```fsharp
open Thoth.Elmish

let update msg model =
    match msg with
    | DemoInfo ->
        model, Toast.message "I am toast of type Info"
                |> Toast.title "Info"
                |> Toast.info
```

