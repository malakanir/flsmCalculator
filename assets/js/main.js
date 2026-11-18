import { toDotted } from "./core/format.js";
import { prefixToMask } from "./core/ip.js";
import { parseMask, parseSubnetFields } from "./core/input.js";
import { splitFixedLength } from "./core/flsm.js";
import { getFormElements } from "./ui/form.js";
import { renderEmpty, renderError, renderResult } from "./ui/render.js";
const DEFAULT_ADDRESS = "192.168.1.0";
const DEFAULT_MASK = "/24";
const DEFAULT_SUBNETS = "4";
function start() {
    const elements = getFormElements();
    const { form, addressInput, maskInput, cidrInput, cidrValue, subnetsInput, hostsInput, clearButton, output } = elements;
    /** Show the prefix on the slider and its label. */
    function showPrefix(prefix) {
        cidrInput.value = String(prefix);
        cidrValue.textContent = `/${prefix}`;
    }
    /**
     * Pick the split request from the two count fields.
     * Exactly one of "No. of Subnets" and "Hosts per Subnet" is used.
     */
    function readRequest() {
        const subnetsText = subnetsInput.value.trim();
        const hostsText = hostsInput.value.trim();
        if (subnetsText !== "" && hostsText !== "") {
            return { ok: false, error: "Fill in either No. of Subnets or Hosts per Subnet, not both." };
        }
        if (subnetsText === "" && hostsText === "") {
            return { ok: false, error: "Enter No. of Subnets or Hosts per Subnet." };
        }
        if (subnetsText !== "") {
            return { ok: true, value: { kind: "subnets", count: Number(subnetsText) } };
        }
        return { ok: true, value: { kind: "hosts", hosts: Number(hostsText) } };
    }
    /** Recalculate from the current field values and redraw the results. */
    function refresh() {
        const parsed = parseSubnetFields(addressInput.value, maskInput.value);
        if (!parsed.ok) {
            renderError(output, parsed.error);
            return;
        }
        const request = readRequest();
        if (!request.ok) {
            renderError(output, request.error);
            return;
        }
        const result = splitFixedLength(parsed.value.address, parsed.value.prefix, request.value);
        if (!result.ok) {
            renderError(output, result.error);
            return;
        }
        renderResult(output, result.value);
    }
    /** Typing in the mask field moves the slider when the mask is valid. */
    function onMaskTyped() {
        const parsed = parseMask(maskInput.value);
        if (parsed.ok)
            showPrefix(parsed.value);
        refresh();
    }
    /** Moving the slider rewrites the mask field as a dotted mask. */
    function onSliderMoved() {
        const prefix = Number(cidrInput.value);
        maskInput.value = toDotted(prefixToMask(prefix));
        showPrefix(prefix);
        refresh();
    }
    /** Clear every input and the results. */
    function onClear() {
        addressInput.value = "";
        maskInput.value = "";
        subnetsInput.value = "";
        hostsInput.value = "";
        showPrefix(24);
        renderEmpty(output);
        addressInput.focus();
    }
    addressInput.addEventListener("input", refresh);
    maskInput.addEventListener("input", onMaskTyped);
    cidrInput.addEventListener("input", onSliderMoved);
    subnetsInput.addEventListener("input", refresh);
    hostsInput.addEventListener("input", refresh);
    clearButton.addEventListener("click", onClear);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        refresh();
    });
    if (addressInput.value.trim() === "")
        addressInput.value = DEFAULT_ADDRESS;
    if (maskInput.value.trim() === "")
        maskInput.value = DEFAULT_MASK;
    if (subnetsInput.value.trim() === "" && hostsInput.value.trim() === "") {
        subnetsInput.value = DEFAULT_SUBNETS;
    }
    const initial = parseMask(maskInput.value);
    if (initial.ok) {
        showPrefix(initial.value);
        maskInput.value = toDotted(prefixToMask(initial.value));
    }
    refresh();
}
start();
