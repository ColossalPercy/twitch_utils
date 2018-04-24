export const Home = {
    "These are test settings and currently do not work!": {},
    "Use the tabs above to change settings": {},
    "DRAGGING CURRENTLY DISABLED": {}
};

export const Chat = {
    "Moderator": {
        "mod-icon-purge": {
            type: "checkbox",
            default: true,
            name: "Moderator Purge Icon",
            desc: "Show a purge button in the moderation icons in chat"
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
    }
};
