export const Home = {
    "These are test settings and currently do not work!": {}
};

export const Chat = {
    "Moderator": {
        "mod-icon-purge": {
            type: "checkbox",
            default: true,
            name: "Moderator Purge Icon",
            desc: "Show a purge button in the moderation icons in chat"
        },
        "mod-icon-purge-type": {
            type: "select",
            name: "Purge Icon Type",
            desc: "Choose which icon to display to purge a user",
            options: ["Cross", "Trash"]
        },
        "mod-card-actions": {
            type: "checkbox",
            default: true,
            name: "Mod Card Actions",
            desc: "Add extra mod actions to the mod cards"
        },
        "mod-command-aliases": {
            type: "checkbox",
            default: true,
            name: "Mod Command Aliases",
            desc: "Enable usage of shortened mod commands: /b, /u, /t, /p"
        }
    },
    "User Card": {
        "user-card-age": {
            type: "checkbox",
            default: true,
            name: "User Created On Date",
            desc: "Show the account creation date in the user card"
        },
        "user-card-name": {
            type: "checkbox",
            default: true,
            name: "User Name History",
            desc: "Show the user name history in the user card"
        }
    },
    "Chat Hightlights": {
        "highlight-friends": {
            type: "checkbox",
            default: false,
            name: "Highlight Friends",
            desc: "Highlight when your friends message in chat with a purple background"
        },
        "highlight-vip": {
            type: "checkbox",
            default: false,
            name: "Highlight VIPs",
            desc: "Highlight when one of your VIPs message in chat with a green background"
        },
        "highlight-vip-list": {
            type: "textarea",
            height: 3,
            name: "Highlight VIP List",
            desc: "List of users that are considered VIPs. Seperate by comma (,)"
        }
    }
};

export const Aliases = {
    "Aliases" : {}
};
