import { toDotted, toDottedBinary } from "../core/format.js";
import { MAX_ROWS } from "../core/flsm.js";
const number = (value) => value.toLocaleString("en-US");
function termRow(list, label, value) {
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value;
    list.append(term, detail);
}
function blockTable(blocks, namePrefix) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headings = [
        "Subnet Name",
        "Network",
        "First Usable IP",
        "Last Usable IP",
        "Broadcast",
        "Total Usable Host",
        "Total Available Host",
        "Netmask",
        "Wildcard",
    ];
    for (const label of headings) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = label;
        headRow.append(th);
    }
    head.append(headRow);
    const body = document.createElement("tbody");
    blocks.forEach((block, index) => {
        const row = document.createElement("tr");
        const values = [
            `${namePrefix} ${index + 1}`,
            toDotted(block.network),
            toDotted(block.firstUsable),
            toDotted(block.lastUsable),
            toDotted(block.broadcast),
            number(block.usableHosts),
            number(block.totalAddresses),
            toDotted(block.mask),
            toDotted(block.wildcard),
        ];
        for (const value of values) {
            const td = document.createElement("td");
            td.textContent = value;
            row.append(td);
        }
        body.append(row);
    });
    table.append(head, body);
    wrap.append(table);
    return wrap;
}
function heading(text) {
    const h = document.createElement("h2");
    h.textContent = text;
    return h;
}
function note(text) {
    const p = document.createElement("p");
    p.className = "note";
    p.textContent = text;
    return p;
}
/** Summary, allocated subnet table, and free block table. Values use textContent only. */
export function renderResult(output, result) {
    output.replaceChildren();
    const summary = document.createElement("dl");
    termRow(summary, "Original prefix", `/${result.originalPrefix}`);
    termRow(summary, "New prefix", `/${result.newPrefix}`);
    termRow(summary, "Subnet mask", `${toDotted(result.mask)} (${toDottedBinary(result.mask)})`);
    termRow(summary, "Subnets allocated", number(result.subnetCount));
    termRow(summary, "Free subnet blocks", number(result.freeCount));
    termRow(summary, "Usable hosts per subnet", number(result.hostsPerSubnet));
    output.append(summary);
    output.append(heading("Subnets"), blockTable(result.subnets, "Subnet"));
    if (result.subnetsTruncated) {
        output.append(note(`Showing the first ${number(MAX_ROWS)} of ${number(result.subnetCount)} subnets.`));
    }
    output.append(heading("Free / Unused Blocks"));
    if (result.freeCount === 0) {
        output.append(note("No free blocks. Every block of this size is allocated."));
    }
    else {
        output.append(note("Free blocks match the size of the allocated subnets."));
        output.append(blockTable(result.free, "Free"));
        if (result.freeTruncated) {
            output.append(note(`Showing the first ${number(MAX_ROWS)} of ${number(result.freeCount)} free blocks.`));
        }
    }
}
/** Show an error message in place of the results. */
export function renderError(output, message) {
    output.replaceChildren();
    const p = document.createElement("p");
    p.className = "error";
    p.setAttribute("role", "alert");
    p.textContent = message;
    output.append(p);
}
/** Clear the results area back to its empty state. */
export function renderEmpty(output) {
    output.replaceChildren();
}
