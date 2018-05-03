const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

clean();
rl.question(green("Please enter the key to login: "), (answer) => {
    if(answer.toLowerCase() === "oof") return doOptions();
    else {
        clean();
        waitForInput();
    }
});

function green(text) {return `\x1b[32m${text}\x1b[0m`;}

function clean() {
    if(process.platform.indexOf("win")) {
        let write = "";
        for(let i = 0; i < process.stdout.getWindowSize()[1]; i++) {
            write += "\r\n";
        }
        write += "\x1B[0f";
        process.stdout.write(write);
    } else process.stdout.write("\x1B[2J");
}

function listOpts() {
    return [
        "[1] Ping some website",
        "[2] View your data",
        "[3] Logout",
        "[4] Exit"
    ].join("\n");
}

function doOptions() {
    rl.question(green(`Please select one option below:\n\n${listOpts()}\n\n>> `), (option) => {
        switch(parseInt(option)) {
            case 1: {
                rl.question(green("Please enter a site url: "), (site) => {
                    const ping = require("child_process").exec(`ping ${site}`);
                    ping.stdout.on("data", (d) => console.log(green(d.trim())));
                    ping.stdout.on("end", () => doOptions());
                });
                break;
            } 
            case 2: {
                let output = "";
                console.log(green("Grabbing data from the nearest server."));
                const netstat = require("child_process").exec("netstat -a");
                netstat.stdout.on("data", (chunk) => console.log(green(chunk.trim())));
                netstat.stdout.on("end", () => doOptions());
                break;
            }
            case 3: {
                clean();
                waitForInput();
                break;
            }
            case 4: {
                clean();
                rl.close();s
                break;
            } 
        }
    });
}

function waitForInput() {
    rl.question(green("Please enter the key"), (answer) => {
        if(answer.toLowerCase() === "oof") return doOptions();
        else {
            clean();
            waitForInput();
        }
    });
}