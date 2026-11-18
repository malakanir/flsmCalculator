import { toDotted } from "../core/format.js";
import { MAX_ROWS } from "../core/flsm.js";
const number = (value) => value.toLocaleString("en-US");
function cell(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}
/** Summary list plus the subnet table. Values use textContent only. */
export function renderResult(output, result) {
    output.replaceChildren();
    const summary = document.createElement("dl");
    const items = [
        ["Original prefix", `/${result.originalPrefix}`],
        ["New prefix", `/${result.newPrefix}`],
        ["Subnet mask", toDotted(result.mask)],
        ["Number of subnets", number(result.subnetCount)],
        ["Usable hosts per subnet", number(result.hostsPerSubnet)],
    ];
    for (const [label, value] of items) {
        const term = document.createElement("dt");
        term.textContent = label;
        const detail = document.createElement("dd");
        detail.textContent = value;
        summary.append(term, detail);
    }
    output.append(summary);
    output.append(subnetTable(result.subnets));
    if (result.truncated) {
        const note = document.createElement("p");
        note.className = "note";
        note.textContent = `Showing the first ${number(MAX_ROWS)} of ${number(result.subnetCount)} subnets.`;
        output.append(note);
    }
}
function subnetTable(subnets) {
    const table = document.createElement("table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const label of ["#", "Network", "First usable", "Last usable", "Broadcast"]) {
        headRow.append(cell("th", label));
    }
    head.append(headRow);
    const body = document.createElement("tbody");
    subnets.forEach((subnet, index) => {
        const row = document.createElement("tr");
        row.append(cell("td", String(index + 1)), cell("td", toDotted(subnet.network)), cell("td", toDotted(subnet.firstUsable)), cell("td", toDotted(subnet.lastUsable)), cell("td", toDotted(subnet.broadcast)));
        body.append(row);
    });
    table.append(head, body);
    return table;
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
