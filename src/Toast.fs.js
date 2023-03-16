import { FSharpRef, Record, Union } from "../demo/src/fable_modules/fable-library.4.0.0/Types.js";
import { list_type, record_type, bool_type, class_type, option_type, string_type, union_type } from "../demo/src/fable_modules/fable-library.4.0.0/Reflection.js";
import { fromSeconds } from "../demo/src/fable_modules/fable-library.4.0.0/TimeSpan.js";
import { value as value_1, map as map_1, some } from "../demo/src/fable_modules/fable-library.4.0.0/Option.js";
import { newGuid } from "../demo/src/fable_modules/fable-library.4.0.0/Guid.js";
import { empty as empty_1, filter, cons, ofArray, map, singleton } from "../demo/src/fable_modules/fable-library.4.0.0/List.js";
import { DOMAttr, HTMLAttr } from "../demo/src/fable_modules/Fable.React.9.2.0/Fable.React.Props.fs.js";
import { join } from "../demo/src/fable_modules/fable-library.4.0.0/String.js";
import { defaultOf } from "../demo/src/fable_modules/Fable.React.9.2.0/../fable-library.4.0.0/Util.js";
import { empty, singleton as singleton_1, append, delay as delay_1, toList } from "../demo/src/fable_modules/fable-library.4.0.0/Seq.js";
import * as react from "react";
import { keyValueList } from "../demo/src/fable_modules/fable-library.4.0.0/MapUtil.js";
import { PromiseBuilder__Delay_62FBFDE1, PromiseBuilder__Run_212F1D4B } from "../demo/src/fable_modules/Fable.Promise.2.2.0/Promise.fs.js";
import { promise } from "../demo/src/fable_modules/Fable.Promise.2.2.0/PromiseImpl.fs.js";
import { Cmd_map, Cmd_OfPromise_either, Cmd_none } from "../demo/src/fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { Sub_map, Sub_batch } from "../demo/src/fable_modules/Fable.Elmish.4.0.0/sub.fs.js";
import { ProgramModule_map } from "../demo/src/fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import "./css/toast-base.css";
import "./css/toast-minimal.css";



export class Status extends Union {
    "constructor"(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Success", "Warning", "Error", "Info"];
    }
}

export function Status$reflection() {
    return union_type("Thoth.Elmish.Toast.Status", [], Status, () => [[], [], [], []]);
}

export class Position extends Union {
    "constructor"(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["BottomRight", "BottomLeft", "BottomCenter", "TopRight", "TopLeft", "TopCenter"];
    }
}

export function Position$reflection() {
    return union_type("Thoth.Elmish.Toast.Position", [], Position, () => [[], [], [], [], [], []]);
}

export class Builder$2 extends Record {
    "constructor"(Message, Title, Icon, Position, Delay, DismissOnClick, WithCloseButton) {
        super();
        this.Message = Message;
        this.Title = Title;
        this.Icon = Icon;
        this.Position = Position;
        this.Delay = Delay;
        this.DismissOnClick = DismissOnClick;
        this.WithCloseButton = WithCloseButton;
    }
}

export function Builder$2$reflection(gen0, gen1) {
    return record_type("Thoth.Elmish.Toast.Builder`2", [gen0, gen1], Builder$2, () => [["Message", string_type], ["Title", option_type(string_type)], ["Icon", option_type(gen0)], ["Position", Position$reflection()], ["Delay", option_type(class_type("System.TimeSpan"))], ["DismissOnClick", bool_type], ["WithCloseButton", bool_type]]);
}

export function Builder$2_Empty() {
    return new Builder$2("", void 0, void 0, new Position(1, []), fromSeconds(3), false, false);
}

export class Toast$1 extends Record {
    "constructor"(Guid, Message, Title, Icon, Position, Delay, Status, DismissOnClick, WithCloseButton) {
        super();
        this.Guid = Guid;
        this.Message = Message;
        this.Title = Title;
        this.Icon = Icon;
        this.Position = Position;
        this.Delay = Delay;
        this.Status = Status;
        this.DismissOnClick = DismissOnClick;
        this.WithCloseButton = WithCloseButton;
    }
}

export function Toast$1$reflection(gen0) {
    return record_type("Thoth.Elmish.Toast.Toast`1", [gen0], Toast$1, () => [["Guid", class_type("System.Guid")], ["Message", string_type], ["Title", option_type(string_type)], ["Icon", option_type(gen0)], ["Position", Position$reflection()], ["Delay", option_type(class_type("System.TimeSpan"))], ["Status", Status$reflection()], ["DismissOnClick", bool_type], ["WithCloseButton", bool_type]]);
}

export function message(msg) {
    const inputRecord = Builder$2_Empty();
    return new Builder$2(msg, inputRecord.Title, inputRecord.Icon, inputRecord.Position, inputRecord.Delay, inputRecord.DismissOnClick, inputRecord.WithCloseButton);
}

export function title(title_1, builder) {
    return new Builder$2(builder.Message, title_1, builder.Icon, builder.Position, builder.Delay, builder.DismissOnClick, builder.WithCloseButton);
}

export function position(pos, builder) {
    return new Builder$2(builder.Message, builder.Title, builder.Icon, pos, builder.Delay, builder.DismissOnClick, builder.WithCloseButton);
}

export function icon(icon_1, builder) {
    return new Builder$2(builder.Message, builder.Title, some(icon_1), builder.Position, builder.Delay, builder.DismissOnClick, builder.WithCloseButton);
}

export function timeout(delay, builder) {
    return new Builder$2(builder.Message, builder.Title, builder.Icon, builder.Position, delay, builder.DismissOnClick, builder.WithCloseButton);
}

export function noTimeout(builder) {
    return new Builder$2(builder.Message, builder.Title, builder.Icon, builder.Position, void 0, builder.DismissOnClick, builder.WithCloseButton);
}

export function dismissOnClick(builder) {
    return new Builder$2(builder.Message, builder.Title, builder.Icon, builder.Position, builder.Delay, true, builder.WithCloseButton);
}

export function withCloseButton(builder) {
    return new Builder$2(builder.Message, builder.Title, builder.Icon, builder.Position, builder.Delay, builder.DismissOnClick, true);
}

function triggerEvent(builder, status, dispatch) {
    const detail = {
        detail: new Toast$1(newGuid(), builder.Message, builder.Title, builder.Icon, builder.Position, builder.Delay, status, builder.DismissOnClick, builder.WithCloseButton),
    };
    const event = new CustomEvent("thoth_elmish_toast_notify_event", detail);
    window.dispatchEvent(event);
}

export function success(builder) {
    return singleton((dispatch) => {
        triggerEvent(builder, new Status(0, []), dispatch);
    });
}

export function warning(builder) {
    return singleton((dispatch) => {
        triggerEvent(builder, new Status(1, []), dispatch);
    });
}

export function error(builder) {
    return singleton((dispatch) => {
        triggerEvent(builder, new Status(2, []), dispatch);
    });
}

export function info(builder) {
    return singleton((dispatch) => {
        triggerEvent(builder, new Status(3, []), dispatch);
    });
}

export class Program_Notifiable$2 extends Union {
    "constructor"(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Add", "Remove", "UserMsg", "OnError"];
    }
}

export function Program_Notifiable$2$reflection(gen0, gen1) {
    return union_type("Thoth.Elmish.Toast.Program.Notifiable`2", [gen0, gen1], Program_Notifiable$2, () => [[["Item", Toast$1$reflection(gen0)]], [["Item", Toast$1$reflection(gen0)]], [["Item", gen1]], [["Item", class_type("System.Exception")]]]);
}

export class Program_Model$2 extends Record {
    "constructor"(UserModel, Toasts_BL, Toasts_BC, Toasts_BR, Toasts_TL, Toasts_TC, Toasts_TR) {
        super();
        this.UserModel = UserModel;
        this.Toasts_BL = Toasts_BL;
        this.Toasts_BC = Toasts_BC;
        this.Toasts_BR = Toasts_BR;
        this.Toasts_TL = Toasts_TL;
        this.Toasts_TC = Toasts_TC;
        this.Toasts_TR = Toasts_TR;
    }
}

export function Program_Model$2$reflection(gen0, gen1) {
    return record_type("Thoth.Elmish.Toast.Program.Model`2", [gen0, gen1], Program_Model$2, () => [["UserModel", gen1], ["Toasts_BL", list_type(Toast$1$reflection(gen0))], ["Toasts_BC", list_type(Toast$1$reflection(gen0))], ["Toasts_BR", list_type(Toast$1$reflection(gen0))], ["Toasts_TL", list_type(Toast$1$reflection(gen0))], ["Toasts_TC", list_type(Toast$1$reflection(gen0))], ["Toasts_TR", list_type(Toast$1$reflection(gen0))]]);
}

function Program_viewToastWrapper(classPosition, render_1, toasts, dispatch) {
    const props_2 = [new HTMLAttr(65, ["toast-wrapper " + classPosition])];
    const children_2 = map((n) => {
        let arg_8;
        const title_1 = map_1((arg) => render_1.Title(arg), n.Title);
        const dismissOnClick_1 = n.DismissOnClick ? "dismiss-on-click" : "";
        const containerClass = join(" ", ["toast-container", dismissOnClick_1, render_1.StatusToColor(n.Status)]);
        let closeButton;
        const o_1 = n.WithCloseButton ? render_1.CloseButton((_arg) => {
            dispatch(new Program_Notifiable$2(1, [n]));
        }) : (void 0);
        if (o_1 == null) {
            closeButton = defaultOf();
        }
        else {
            const o_1_1 = o_1;
            closeButton = o_1_1;
        }
        let layout;
        const matchValue_1 = n.Icon;
        if (matchValue_1 == null) {
            let arg_5;
            const o_3 = title_1;
            if (o_3 == null) {
                arg_5 = defaultOf();
            }
            else {
                const o_1_3 = o_3;
                arg_5 = o_1_3;
            }
            const arg_6 = render_1.Message(n.Message);
            layout = render_1.SingleLayout(arg_5, arg_6);
        }
        else {
            const icon_1 = value_1(matchValue_1);
            const arg_2 = render_1.Icon(icon_1);
            let arg_3;
            const o_2 = title_1;
            if (o_2 == null) {
                arg_3 = defaultOf();
            }
            else {
                const o_1_2 = o_2;
                arg_3 = o_1_2;
            }
            const arg_4 = render_1.Message(n.Message);
            layout = render_1.SplittedLayout(arg_2, arg_3, arg_4);
        }
        const props = toList(delay_1(() => append(singleton_1(new HTMLAttr(64, [containerClass])), delay_1(() => (n.DismissOnClick ? singleton_1(new DOMAttr(40, [(_arg_1) => {
            dispatch(new Program_Notifiable$2(1, [n]));
        }])) : empty())))));
        const children = [(arg_8 = render_1.StatusToColor(n.Status), render_1.Toast(ofArray([closeButton, layout]), arg_8))];
        return react.createElement("div", keyValueList(props, 1), ...children);
    }, toasts);
    return react.createElement("div", keyValueList(props_2, 1), ...children_2);
}

function Program_view(render_1, model, dispatch) {
    const children = [Program_viewToastWrapper("toast-wrapper-bottom-left", render_1, model.Toasts_BL, dispatch), Program_viewToastWrapper("toast-wrapper-bottom-center", render_1, model.Toasts_BC, dispatch), Program_viewToastWrapper("toast-wrapper-bottom-right", render_1, model.Toasts_BR, dispatch), Program_viewToastWrapper("toast-wrapper-top-left", render_1, model.Toasts_TL, dispatch), Program_viewToastWrapper("toast-wrapper-top-center", render_1, model.Toasts_TC, dispatch), Program_viewToastWrapper("toast-wrapper-top-right", render_1, model.Toasts_TR, dispatch)];
    return react.createElement("div", {
        className: "elmish-toast",
    }, ...children);
}

function Program_delayedCmd(notification) {
    const matchValue = notification.Delay;
    if (matchValue == null) {
        throw new Error("No delay attached to notification can\'t delayed it. `delayedCmd` should not have been called by the program");
    }
    else {
        const delay = matchValue;
        return PromiseBuilder__Run_212F1D4B(promise, PromiseBuilder__Delay_62FBFDE1(promise, () => ((new Promise(resolve => setTimeout(resolve, (~(~delay))))).then(() => (Promise.resolve(notification))))));
    }
}

export function Program_withToast(renderer, program) {
    const mapUpdate = (update, msg, model) => {
        let patternInput_1;
        switch (msg.tag) {
            case 0: {
                const newToast = msg.fields[0];
                const cmd_1 = (newToast.Delay == null) ? Cmd_none() : Cmd_OfPromise_either(Program_delayedCmd, newToast, (arg_1) => (new Program_Notifiable$2(1, [arg_1])), (arg_2) => (new Program_Notifiable$2(3, [arg_2])));
                const matchValue_1 = newToast.Position;
                switch (matchValue_1.tag) {
                    case 2: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, cons(newToast, model.Toasts_BC), model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), cmd_1];
                        break;
                    }
                    case 0: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, cons(newToast, model.Toasts_BR), model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), cmd_1];
                        break;
                    }
                    case 4: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, cons(newToast, model.Toasts_TL), model.Toasts_TC, model.Toasts_TR), cmd_1];
                        break;
                    }
                    case 5: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, cons(newToast, model.Toasts_TC), model.Toasts_TR), cmd_1];
                        break;
                    }
                    case 3: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, cons(newToast, model.Toasts_TR)), cmd_1];
                        break;
                    }
                    default: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, cons(newToast, model.Toasts_BL), model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), cmd_1];
                    }
                }
                break;
            }
            case 1: {
                const toast = msg.fields[0];
                const matchValue_2 = toast.Position;
                switch (matchValue_2.tag) {
                    case 2: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, ((list_1) => filter((item_1) => (item_1.Guid !== toast.Guid), list_1))(model.Toasts_BC), model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), Cmd_none()];
                        break;
                    }
                    case 0: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, ((list_2) => filter((item_2) => (item_2.Guid !== toast.Guid), list_2))(model.Toasts_BR), model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), Cmd_none()];
                        break;
                    }
                    case 4: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, ((list_3) => filter((item_3) => (item_3.Guid !== toast.Guid), list_3))(model.Toasts_TL), model.Toasts_TC, model.Toasts_TR), Cmd_none()];
                        break;
                    }
                    case 5: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, ((list_4) => filter((item_4) => (item_4.Guid !== toast.Guid), list_4))(model.Toasts_TC), model.Toasts_TR), Cmd_none()];
                        break;
                    }
                    case 3: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, ((list_5) => filter((item_5) => (item_5.Guid !== toast.Guid), list_5))(model.Toasts_TR)), Cmd_none()];
                        break;
                    }
                    default: {
                        patternInput_1 = [new Program_Model$2(model.UserModel, ((list) => filter((item) => (item.Guid !== toast.Guid), list))(model.Toasts_BL), model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), Cmd_none()];
                    }
                }
                break;
            }
            case 3: {
                const error_1 = msg.fields[0];
                console.error(some(error_1.message));
                patternInput_1 = [model, Cmd_none()];
                break;
            }
            default: {
                const msg_1 = msg.fields[0];
                const patternInput = update(msg_1)(model.UserModel);
                const newModel = patternInput[0];
                const cmd = patternInput[1];
                patternInput_1 = [new Program_Model$2(newModel, model.Toasts_BL, model.Toasts_BC, model.Toasts_BR, model.Toasts_TL, model.Toasts_TC, model.Toasts_TR), Cmd_map((arg) => (new Program_Notifiable$2(2, [arg])), cmd)];
            }
        }
        const newModel_1 = patternInput_1[0];
        const cmd_2 = patternInput_1[1];
        return [newModel_1, cmd_2];
    };
    const createModel = (tupledArg) => {
        const model_1 = tupledArg[0];
        const cmd_3 = tupledArg[1];
        return [new Program_Model$2(model_1, empty_1(), empty_1(), empty_1(), empty_1(), empty_1(), empty_1()), cmd_3];
    };
    const onNotificationRef = new FSharpRef((_arg) => {
        throw new Error("`onNotificationRef` has not been initialized.\nThis should not happen, please open an issue on Thoth.Elmish.Toast if the problem persist");
    });
    const notificationEvent = (dispatch) => {
        const onNotification = (ev) => {
            const ev_1 = ev;
            dispatch(new Program_Notifiable$2(0, [ev_1.detail]));
        };
        onNotificationRef.contents = onNotification;
        window.addEventListener("thoth_elmish_toast_notify_event", onNotificationRef.contents);
        return {
            Dispose() {
                window.removeEventListener("thoth_elmish_toast_notify_event", onNotificationRef.contents);
            },
        };
    };
    const mapInit = (init, arg_5) => {
        let tupledArg_1, model_2, cmd_4;
        return createModel((tupledArg_1 = init(arg_5), (model_2 = tupledArg_1[0], (cmd_4 = tupledArg_1[1], [model_2, Cmd_map((arg_3) => (new Program_Notifiable$2(2, [arg_3])), cmd_4)]))));
    };
    const mapSubscribe = (userSubscribe, model_3) => Sub_batch(ofArray([singleton([singleton("thoth_elmish_toast_notify_event"), notificationEvent]), Sub_map("ThothElmishToastUser", (arg_6) => (new Program_Notifiable$2(2, [arg_6])), userSubscribe(model_3.UserModel))]));
    const mapView = (view$0027, model_4, dispatch_1) => {
        const children = [Program_view(renderer, model_4, dispatch_1), view$0027(model_4.UserModel)((arg_8) => {
            dispatch_1(new Program_Notifiable$2(2, [arg_8]));
        })];
        return react.createElement(react.Fragment, {}, ...children);
    };
    const mapSetState = (setState, model_5, dispatch_2) => setState(model_5.UserModel)((arg_10) => dispatch_2(new Program_Notifiable$2(2, [arg_10])));
    const mapTermination = (tupledArg_2) => {
        const predicate_6 = tupledArg_2[0];
        const terminate = tupledArg_2[1];
        const predicate$0027 = (_arg_1) => {
            if (_arg_1.tag === 2) {
                const msg_2 = _arg_1.fields[0];
                return predicate_6(msg_2);
            }
            else {
                return false;
            }
        };
        const terminate$0027 = (model_6) => {
            window.removeEventListener("thoth_elmish_toast_notify_event", onNotificationRef.contents);
            return terminate(model_6.UserModel);
        };
        return [predicate$0027, terminate$0027];
    };
    return ProgramModule_map(mapInit, mapUpdate, mapView, mapSetState, mapSubscribe, mapTermination, program);
}

export const render = {
    Toast(children, _arg) {
        return react.createElement("div", {
            className: "toast",
        }, ...children);
    },
    CloseButton(onClick) {
        return react.createElement("span", {
            className: "close-button",
            onClick: onClick,
        });
    },
    Title(txt) {
        return react.createElement("span", {
            className: "toast-title",
        }, txt);
    },
    Icon(icon_1) {
        let props_6;
        const children_9 = [(props_6 = [new HTMLAttr(65, ["fa fa-2x " + icon_1])], react.createElement("i", keyValueList(props_6, 1)))];
        return react.createElement("div", {
            className: "toast-layout-icon",
        }, ...children_9);
    },
    SingleLayout(title_1, message_1) {
        return react.createElement("div", {
            className: "toast-layout-content",
        }, title_1, message_1);
    },
    Message(txt_1) {
        return react.createElement("span", {
            className: "toast-message",
        }, txt_1);
    },
    SplittedLayout(iconView, title_2, message_2) {
        const props_16 = [["style", {
            display: "flex",
            width: "100%",
        }]];
        const children_17 = [iconView, react.createElement("div", {
            className: "toast-layout-content",
        }, title_2, message_2)];
        return react.createElement("div", keyValueList(props_16, 1), ...children_17);
    },
    StatusToColor(status) {
        return (status.tag === 1) ? "is-warning" : ((status.tag === 2) ? "is-error" : ((status.tag === 3) ? "is-info" : "is-success"));
    },
};

