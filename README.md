# FLSM Calculator

Fixed Length Subnet Mask calculator. It splits one network into equal-size subnets, either by number of subnets or by usable hosts per subnet.

Built as a Jekyll site for GitHub Pages. The logic is TypeScript, compiled into `assets/js/`, which Jekyll publishes as-is.

## Usage

1. Enter the **Network address**, for example `192.168.10.0`.
2. Enter the **Subnet Mask or CIDR**: `255.255.255.0` or `/24`.
3. Choose **Split by**:
   - **Number of subnets**: the count is rounded up to a power of two, because FLSM borrows whole bits. Asking for 300 subnets gives 512.
   - **Hosts per subnet**: the smallest block that fits, counting the network and broadcast addresses.
4. Results update as you type.

Results show the new prefix, subnet mask, number of subnets, usable hosts per subnet, and a table of each subnet. The table shows up to 256 rows.

## Project layout

```
index.md                Jekyll page (form and results container)
_layouts/default.html   page shell, loads CSS and the compiled JS
_config.yml             Jekyll config; source and build files are excluded
assets/css/style.css    minimal styles
assets/js/              compiled output of src/ (committed)
src/core/               pure logic, no DOM (flsm, subnet, ip, input, format, types)
src/ui/                 DOM access only (form, render)
src/main.ts             wires the form to core and render
CNAME                   custom domain
```

`src/core` does not touch the DOM, so it can be tested in Node.

## Build

```bash
npm install
npm run build
```

Run `npm run build` after every change to `src/` and commit `assets/js/` with it. GitHub Pages runs Jekyll only and does not run `tsc`.

## Deploy to GitHub Pages

1. Push this folder as the repository root.
2. In **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The custom domain is set by `CNAME`. Enable **Enforce HTTPS** once the certificate is approved.
