import { toDotted } from "./core/format.js";
import { prefixToMask } from "./core/ip.js";
import { parseMask, parseSubnetFields } from "./core/input.js";
import { splitFixedLength, type FlsmRequest } from "./core/flsm.js";
import { getFormElements } from "./ui/form.js";
import { renderError, renderResult } from "./ui/render.js";

const DEFAULT_ADDRESS = "192.168.10.0";
const DEFAULT_MASK = "/24";
const DEFAULT_MODE = "subnets";
const DEFAULT_VALUE = "4";

function start(): void {
  const { form, addressInput, maskInput, modeSelect, valueInput, output } = getFormElements();

  /** Read the split mode and its number, as a request for the core. */
  function readRequest(): FlsmRequest {
    const value = Number(valueInput.value);
    return modeSelect.value === "hosts"
      ? { kind: "hosts", hosts: value }
      : { kind: "subnets", count: value };
  }

  /** Recalculate from the current field values and redraw the results. */
  function refresh(): void {
    const parsed = parseSubnetFields(addressInput.value, maskInput.value);
    if (!parsed.ok) {
      renderError(output, parsed.error);
      return;
    }
    const result = splitFixedLength(parsed.value.address, parsed.value.prefix, readRequest());
    if (!result.ok) {
      renderError(output, result.error);
      return;
    }
    renderResult(output, result.value);
  }

  /** A valid mask is normalized to a dotted mask so the field stays readable. */
  function onMaskChanged(): void {
    const parsed = parseMask(maskInput.value);
    if (parsed.ok) maskInput.value = toDotted(prefixToMask(parsed.value));
    refresh();
  }

  addressInput.addEventListener("input", refresh);
  maskInput.addEventListener("change", onMaskChanged);
  maskInput.addEventListener("input", refresh);
  modeSelect.addEventListener("change", refresh);
  valueInput.addEventListener("input", refresh);
  form.addEventListener("submit", (event) => event.preventDefault());

  if (addressInput.value.trim() === "") addressInput.value = DEFAULT_ADDRESS;
  if (maskInput.value.trim() === "") maskInput.value = DEFAULT_MASK;
  if (valueInput.value.trim() === "") valueInput.value = DEFAULT_VALUE;
  modeSelect.value = DEFAULT_MODE;

  onMaskChanged();
}

start();
