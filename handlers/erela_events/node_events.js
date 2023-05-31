const stringlength = 69;
module.exports = (client) => {
    client.manager
        .on("nodeConnect", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Node connected: `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node connected: `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` { ${node.host} } `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.host} } `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        })
        .on("nodeCreate", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Node created: `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node created: `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` { ${node.host} } `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.host} } `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        })
        .on("nodeReconnect", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + `Node reconnecting: `.bold.brightYellow + " ".repeat(-2 + stringlength - ` ┃ `.length - `Node reconnected: `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + ` { ${node.host} } `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.host} } `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightYellow)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightYellow)
        })
        .on("nodeDisconnect", (node) => {
            //setTimeout(()=>{node.connect();}, 1000);
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + `Node disconnected: `.bold.brightMagenta + " ".repeat(-2 + stringlength - ` ┃ `.length - `Node reconnected: `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + ` { ${node.host} } `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.host} } `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightMagenta)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightMagenta)
        })
        .on("nodeError", (node, error) => {
            //setTimeout(()=>{node.connect();}, 1000);
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + `Node errored: `.bold.brightRed + " ".repeat(3 + stringlength - ` ┃ `.length - `Node reconnected: `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + ` { ${node.host} } `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.host} } `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightRed)
            if(error && error.toString().includes("ECONNREFUSED")) {
                console.error(`No Permissions to Connect to the Lavalink: ${node.options.host}\nPort: ${node.options.port}\nPassword: ${node.options.password}\n :: Maybe wrong password / Lavalink offline?`)
            } else if(error) {
                console.error(error);
            }
        })

};
/*
 * using moonlink.js
 * erela.js deprecated/not supported by new lavalinks
 * rip my 10 month work on the music system
 */