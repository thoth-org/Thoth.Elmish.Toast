namespace Thoth.Elmish

module Toast =

    open System
    open Fable.React
    open Fable.React.Props
    open Fable.Core.JsInterop
    open Browser
    open Browser.Types
    open Elmish

    [<Fable.Core.Emit("module.hot")>]
    let private hotModule = obj()

    importSideEffects "./css/toast-base.css"
    importSideEffects "./css/toast-minimal.css"

    [<Literal>]
    let private EVENT_IDENTIFIER = "thoth_elmish_toast_notify_event"

    type Status =
        | Success
        | Warning
        | Error
        | Info

    type Position =
        | BottomRight
        | BottomLeft
        | BottomCenter
        | TopRight
        | TopLeft
        | TopCenter

    type Builder<'icon, 'msg> =
        {
            Message : string
            Title : string option
            Icon : 'icon option
            Position : Position
            Delay : TimeSpan option
            DismissOnClick : bool
            WithCloseButton : bool
        }

        static member Empty () =
            {
                Message = ""
                Title = None
                Icon = None
                Delay = Some (TimeSpan.FromSeconds 3.)
                Position = BottomLeft
                DismissOnClick = false
                WithCloseButton = false
            }

    type Toast<'icon> =
        {
            Guid : Guid
            Message : string
            Title : string option
            Icon : 'icon option
            Position : Position
            Delay : TimeSpan option
            Status : Status
            DismissOnClick : bool
            WithCloseButton : bool
        }

    /// <summary>
    /// Create a toast and set the message content
    /// </summary>
    /// <param name="msg">Message to display in the toast</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let message msg : Builder<'icon, 'msg> =
        { Builder<'icon, 'msg>.Empty()
            with Message = msg
        }

    /// <summary>
    /// Set the title content
    /// </summary>
    /// <param name="title">Title to display in the toast</param>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let title title (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            Title = Some title
        }

    /// <summary>
    /// Set the position
    /// </summary>
    /// <param name="pos">Position where the toast will be positionned</param>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let position pos (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            Position = pos
        }

    /// <summary>
    /// Set the icon
    /// </summary>
    /// <param name="icon">Icon which will be shown in the icon section of the toast</param>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let icon icon (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            Icon = Some icon
        }

    /// <summary>
    /// Set the timeout in seconds
    /// </summary>
    /// <param name="delay">Dely in second after which the toast will be removed</param>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let timeout delay (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            Delay = Some delay
        }

    /// <summary>
    /// No timeout, make sure to add close button or dismiss on click
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let noTimeout (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            Delay = None
        }

    /// <summary>
    /// Allow user to dismiss the toast by cliking on it
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let dismissOnClick (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            DismissOnClick = true
        }

    /// <summary>
    /// Add a close button
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let withCloseButton (builder : Builder<'icon, 'msg>) : Builder<'icon, 'msg> =
        { builder with
            WithCloseButton = true
        }

    let inline private triggerEvent<'icon, 'msg> (builder : Builder<'icon, 'msg>) status (dispatch : Dispatch<'msg>) =
        let value : option<Toast<'icon>> =
            Some {
                    Guid = Guid.NewGuid()
                    Message = builder.Message
                    Title = builder.Title
                    Icon = builder.Icon
                    Position = builder.Position
                    Delay = builder.Delay
                    Status = status
                    DismissOnClick = builder.DismissOnClick
                    WithCloseButton = builder.WithCloseButton
                }

        let detail =
            jsOptions<CustomEventInit<Toast<'icon>>>(fun o -> o.detail <- value)

        let event = CustomEvent.Create(EVENT_IDENTIFIER, detail)

        window.dispatchEvent(event)
        |> ignore


    /// <summary>
    /// Send the toast marked with Success status
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let success (builder : Builder<'icon, 'msg>) : Cmd<'msg> =
        [
            fun dispatch ->
                triggerEvent builder Success dispatch
        ]


    /// <summary>
    /// Send the toast marked with Warning status
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let warning (builder : Builder<'icon, 'msg>) : Cmd<'msg> =
        [
            fun dispatch ->
                triggerEvent builder Warning dispatch
        ]

    /// <summary>
    /// Send the toast marked with Error status
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let error (builder : Builder<'icon, 'msg>) : Cmd<'msg> =
        [
            fun dispatch ->
                triggerEvent builder Error dispatch
        ]

    /// <summary>
    /// Send the toast marked with Info status
    /// </summary>
    /// <param name="builder">Toast builder to which we want to apply the function</param>
    /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
    /// <typeparam name="'msg">The message type associated with this Toast builder</typeparam>
    /// <returns></returns>
    let info (builder : Builder<'icon, 'msg>) : Cmd<'msg> =
        [
            fun dispatch ->
                triggerEvent builder Info dispatch
        ]

    /// <summary>
    /// Interface used to customize the view
    /// </summary>
    type IRenderer<'icon> =

        /// <summary>
        /// Render the outer element of the toast
        /// </summary>
        /// <param name="content">This is the content of the toast</param>
        /// <param name="color">Class used to set the toast color</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract Toast : content : ReactElement list -> color : string -> ReactElement

        /// <summary>
        /// Render the close button of the toast
        /// </summary>
        /// <param name="onClick">Event listener to attached</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract CloseButton : onClick : (MouseEvent -> unit) -> ReactElement

        /// <summary>
        /// Render the title of the toast
        /// </summary>
        /// <param name="text">Text to display</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract Title : text : string -> ReactElement

        /// <summary>
        /// Render the message of the toast
        /// </summary>
        /// <param name="text">Text to display</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract Message : text : string -> ReactElement


        /// <summary>
        /// Render the icon part
        /// </summary>
        /// <param name="icon">Icon to use</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract Icon : icon : 'icon -> ReactElement

        /// <summary>
        /// Render the simple layout (when no icon has been provided to the Toast)
        /// </summary>
        /// <param name="titleElement">React element representing the tile part of the toast</param>
        /// <param name="messageElement">React element representing the message part of the toast</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract SingleLayout :
            titleElement : ReactElement ->
            messageElement : ReactElement ->
            ReactElement


        /// <summary>
        /// Render the splitted layout (when toast has an Icon and Message)
        /// </summary>
        /// <param name="iconElement">React element representing the icon part of the toast</param>
        /// <param name="titleElement">React element representing the tile part of the toast</param>
        /// <param name="messageElement">React element representing the message part of the toast</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns></returns>
        abstract SplittedLayout :
            iconElement : ReactElement ->
            titleElement : ReactElement ->
            messageElement : ReactElement ->
            ReactElement

        /// <summary>
        /// Obtain the class associated with the Status
        /// </summary>
        /// <param name="status">Status value to convert</param>
        /// <typeparam name="'icon">The type of Icon used. For example, for FontAwesome you could use Icons represent using CSS string class or types icons using <c>Fa.I.FontAwesomeIcons</c></typeparam>
        /// <returns>The CSS class associated with the Status</returns>
        abstract StatusToColor : status : Status -> string

    [<RequireQualifiedAccess>]
    module Program =

        type Notifiable<'icon, 'msg> =
            | Add of Toast<'icon>
            | Remove of Toast<'icon>
            | UserMsg of 'msg
            | OnError of exn

        type Model<'icon, 'model> =
            {
                UserModel : 'model
                Toasts_BL : Toast<'icon> list
                Toasts_BC : Toast<'icon> list
                Toasts_BR : Toast<'icon> list
                Toasts_TL : Toast<'icon> list
                Toasts_TC : Toast<'icon> list
                Toasts_TR : Toast<'icon> list
            }

        let inline private removeToast guid =
            List.filter (fun item -> item.Guid <> guid )

        let private viewToastWrapper (classPosition : string) (render : IRenderer<_>) (toasts : Toast<_> list) dispatch =
            div [ Class ("toast-wrapper " + classPosition) ]
                ( toasts
                        |> List.map (fun n ->
                            let title =
                                Option.map
                                    render.Title
                                    n.Title

                            let dismissOnClick =
                                if n.DismissOnClick then
                                    "dismiss-on-click"
                                else
                                    ""

                            let containerClass =
                                String.concat " " [ "toast-container"
                                                    dismissOnClick
                                                    render.StatusToColor n.Status ]
                            let closeButton =
                                match n.WithCloseButton with
                                | true ->
                                    render.CloseButton (fun _ -> dispatch (Remove n))
                                    |> Some
                                | false -> None
                                |> ofOption

                            let layout =
                                match n.Icon with
                                | Some icon ->
                                    render.SplittedLayout
                                        (render.Icon icon)
                                        (ofOption title)
                                        (render.Message n.Message)
                                | None ->
                                    render.SingleLayout
                                        (ofOption title)
                                        (render.Message n.Message)

                            div [ yield ClassName containerClass :> IHTMLProp
                                  if n.DismissOnClick then
                                       yield OnClick (fun _ -> dispatch (Remove n)) :> IHTMLProp ]
                                [ render.Toast
                                    [ closeButton
                                      layout
                                    ]
                                    (render.StatusToColor n.Status) ]
                        ) )


        let private view  (render : IRenderer<_>) (model : Model<_, _>) dispatch =
            div [ Class "elmish-toast" ]
                [ viewToastWrapper "toast-wrapper-bottom-left" render model.Toasts_BL dispatch
                  viewToastWrapper "toast-wrapper-bottom-center" render model.Toasts_BC dispatch
                  viewToastWrapper "toast-wrapper-bottom-right" render model.Toasts_BR dispatch
                  viewToastWrapper "toast-wrapper-top-left" render model.Toasts_TL dispatch
                  viewToastWrapper "toast-wrapper-top-center" render model.Toasts_TC dispatch
                  viewToastWrapper "toast-wrapper-top-right" render model.Toasts_TR dispatch ]


        let private delayedCmd (notification : Toast<'icon>) =
            match notification.Delay with
            | Some delay ->
                promise {
                    do! Promise.sleep (int delay.TotalMilliseconds)
                    return notification
                }
            | None -> failwith "No delay attached to notification can't delayed it. `delayedCmd` should not have been called by the program"

        let withToast (renderer : IRenderer<'icon>) (program : Elmish.Program<'arg, 'model, 'msg, 'view >) =

            let mapUpdate update msg model =
                let newModel,cmd =
                    match msg with
                    | UserMsg msg ->
                        let newModel, cmd = update msg model.UserModel
                        { model with UserModel = newModel }, Cmd.map UserMsg cmd

                    | Add newToast ->
                        let cmd : Cmd<Notifiable<'icon, 'msg>>=
                            match newToast.Delay with
                            | Some _ -> Cmd.OfPromise.either delayedCmd newToast Remove !!OnError // TODO: Fix elmish
                            | None -> Cmd.none

                        match newToast.Position with
                        | BottomLeft -> { model with Toasts_BL = newToast::model.Toasts_BL }, cmd
                        | BottomCenter -> { model with Toasts_BC = newToast::model.Toasts_BC }, cmd
                        | BottomRight -> { model with Toasts_BR = newToast::model.Toasts_BR }, cmd
                        | TopLeft -> { model with Toasts_TL = newToast::model.Toasts_TL }, cmd
                        | TopCenter -> { model with Toasts_TC = newToast::model.Toasts_TC }, cmd
                        | TopRight -> { model with Toasts_TR = newToast::model.Toasts_TR }, cmd

                    | Remove toast ->
                        match toast.Position with
                        | BottomLeft -> { model with Toasts_BL = removeToast toast.Guid model.Toasts_BL }, Cmd.none
                        | BottomCenter -> { model with Toasts_BC = removeToast toast.Guid model.Toasts_BC }, Cmd.none
                        | BottomRight -> { model with Toasts_BR = removeToast toast.Guid model.Toasts_BR }, Cmd.none
                        | TopLeft -> { model with Toasts_TL = removeToast toast.Guid model.Toasts_TL }, Cmd.none
                        | TopCenter -> { model with Toasts_TC = removeToast toast.Guid model.Toasts_TC }, Cmd.none
                        | TopRight -> { model with Toasts_TR = removeToast toast.Guid model.Toasts_TR }, Cmd.none


                    | OnError error ->
                        console.error error.Message
                        model, Cmd.none

                newModel, cmd

            let createModel (model, cmd) =
                {
                    UserModel = model
                    Toasts_BL = []
                    Toasts_BC = []
                    Toasts_BR = []
                    Toasts_TL = []
                    Toasts_TC = []
                    Toasts_TR = []
                }
                , cmd

            let notificationEvent (dispatch : Elmish.Dispatch<Notifiable<'icon, 'msg>>) =
                // If HMR support is active, then we provide have a custom implementation.
                // This is needed to avoid:
                // - flickering (trigger several react renderer process)
                // - attaching several event listener to the same event
                #if DEBUG
                if not (isNull hotModule) then
                    if hotModule?status() <> "idle" then
                        window.removeEventListener(EVENT_IDENTIFIER, !!window?(EVENT_IDENTIFIER))

                    window?(EVENT_IDENTIFIER) <- fun (ev : Event) ->
                        let ev = ev :?> CustomEvent<Notifiable<'icon, 'msg>>
                        dispatch (Add (unbox ev.detail))

                    window.addEventListener(EVENT_IDENTIFIER, !!window?(EVENT_IDENTIFIER))
                else
                #endif
                    window.addEventListener(EVENT_IDENTIFIER, fun ev ->
                        let ev = ev :?> CustomEvent<Notifiable<'icon, 'msg>>
                        dispatch (Add (unbox ev.detail))
                    )

            let mapInit init =
                init >> (fun (model, cmd) ->
                            model, cmd |> Cmd.map UserMsg) >> createModel

            let mapSubscribe subscribe model =
                Cmd.batch [ [ notificationEvent ]
                            subscribe model.UserModel |> Cmd.map UserMsg ]

            let mapView view' model dispatch =
                fragment [ ]
                    [ view renderer model dispatch
                      view' model.UserModel (UserMsg >> dispatch) ]

            let mapSetState setState model dispatch =
                setState model.UserModel (UserMsg >> dispatch)

            Program.map mapInit mapUpdate mapView mapSetState mapSubscribe program

    /// <summary>
    /// Default implementation for the Toast renderer.
    ///
    /// <para>you are encourage to write your own implementation to match your application style</para>
    /// </summary>
    /// <returns></returns>
    let render =
        { new IRenderer<string> with

            member __.Toast children _ =
                div [ Class "toast" ]
                    children

            member __.CloseButton onClick =
                span [ Class "close-button"
                       OnClick onClick ]
                    [ ]

            member __.Title txt =
                span [ Class "toast-title" ]
                    [ str txt ]

            member __.Icon (icon : string) =
                div [ Class "toast-layout-icon" ]
                    [ i [ Class ("fa fa-2x " + icon) ]
                        [  ] ]

            member __.SingleLayout title message =
                div [ Class "toast-layout-content" ]
                    [ title; message ]

            member __.Message txt =
                span [ Class "toast-message" ]
                    [ str txt ]

            member __.SplittedLayout iconView title message =
                div [ Style [ Display DisplayOptions.Flex
                              Width "100%" ] ]
                    [ iconView
                      div [ Class "toast-layout-content" ]
                        [ title
                          message ] ]

            member __.StatusToColor status =
                match status with
                | Status.Success -> "is-success"
                | Status.Warning -> "is-warning"
                | Status.Error -> "is-error"
                | Status.Info -> "is-info"
        }
