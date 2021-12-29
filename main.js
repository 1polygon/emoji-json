import fetch from 'node-fetch';
import fs from "fs";

const url = "https://www.unicode.org/Public/emoji/14.0/emoji-test.txt";

const response = await fetch(url);
const body = await response.text();

const groups = [];
var group = null;
var subgroup = null;

for (const line of body.split("\n")) {
    if (line.startsWith("# group")) {
        if (group) {
            groups.push(group);
        }
        group = {
            name: line.substring(9),
            subgroups: []
        }
    }

    if (line.length == 0 && subgroup) {
        group.subgroups.push(subgroup);
        subgroup = null;
    }

    if (line.startsWith("# subgroup")) {
        subgroup = {
            name: line.substring(12),
            emoji: []
        }
    }

    if (line.includes("; fully-qualified")) {
        const emoji = line.split(";")[0].trim().split(" ").map(s => "0x" + s);
        subgroup.emoji.push(String.fromCodePoint(...emoji));
    }

    if (line.startsWith("#EOF")) {
        groups.push(group);
    }
}

fs.writeFileSync("./emoji.json", JSON.stringify(groups, null, 2));
