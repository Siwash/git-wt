#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/sisteransi/src/index.js"(exports, module) {
    "use strict";
    var ESC = "\x1B";
    var CSI = `${ESC}[`;
    var beep = "\x07";
    var cursor = {
      to(x2, y2) {
        if (!y2) return `${CSI}${x2 + 1}G`;
        return `${CSI}${y2 + 1};${x2 + 1}H`;
      },
      move(x2, y2) {
        let ret = "";
        if (x2 < 0) ret += `${CSI}${-x2}D`;
        else if (x2 > 0) ret += `${CSI}${x2}C`;
        if (y2 < 0) ret += `${CSI}${-y2}A`;
        else if (y2 > 0) ret += `${CSI}${y2}B`;
        return ret;
      },
      up: (count = 1) => `${CSI}${count}A`,
      down: (count = 1) => `${CSI}${count}B`,
      forward: (count = 1) => `${CSI}${count}C`,
      backward: (count = 1) => `${CSI}${count}D`,
      nextLine: (count = 1) => `${CSI}E`.repeat(count),
      prevLine: (count = 1) => `${CSI}F`.repeat(count),
      left: `${CSI}G`,
      hide: `${CSI}?25l`,
      show: `${CSI}?25h`,
      save: `${ESC}7`,
      restore: `${ESC}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI}S`.repeat(count),
      down: (count = 1) => `${CSI}T`.repeat(count)
    };
    var erase = {
      screen: `${CSI}2J`,
      up: (count = 1) => `${CSI}1J`.repeat(count),
      down: (count = 1) => `${CSI}J`.repeat(count),
      line: `${CSI}2K`,
      lineEnd: `${CSI}K`,
      lineStart: `${CSI}1K`,
      lines(count) {
        let clear = "";
        for (let i = 0; i < count; i++)
          clear += this.line + (i < count - 1 ? cursor.up() : "");
        if (count)
          clear += cursor.left;
        return clear;
      }
    };
    module.exports = { cursor, scroll, erase, beep };
  }
});

// src/index.ts
import { Command } from "commander";
import { intro, select as select3, outro } from "@clack/prompts";

// src/lib/utils.ts
import { isCancel, cancel } from "@clack/prompts";

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { stdin as j, stdout as M } from "process";
import * as g from "readline";
import O from "readline";
import { Writable as X } from "stream";
import v from "picocolors";
function DD({ onlyFirst: e = false } = {}) {
  const t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(t, e ? void 0 : "g");
}
var uD = DD();
function P(e) {
  if (typeof e != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
  return e.replace(uD, "");
}
function L(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var W = { exports: {} };
(function(e) {
  var u2 = {};
  e.exports = u2, u2.eastAsianWidth = function(F) {
    var s = F.charCodeAt(0), i = F.length == 2 ? F.charCodeAt(1) : 0, D = s;
    return 55296 <= s && s <= 56319 && 56320 <= i && i <= 57343 && (s &= 1023, i &= 1023, D = s << 10 | i, D += 65536), D == 12288 || 65281 <= D && D <= 65376 || 65504 <= D && D <= 65510 ? "F" : D == 8361 || 65377 <= D && D <= 65470 || 65474 <= D && D <= 65479 || 65482 <= D && D <= 65487 || 65490 <= D && D <= 65495 || 65498 <= D && D <= 65500 || 65512 <= D && D <= 65518 ? "H" : 4352 <= D && D <= 4447 || 4515 <= D && D <= 4519 || 4602 <= D && D <= 4607 || 9001 <= D && D <= 9002 || 11904 <= D && D <= 11929 || 11931 <= D && D <= 12019 || 12032 <= D && D <= 12245 || 12272 <= D && D <= 12283 || 12289 <= D && D <= 12350 || 12353 <= D && D <= 12438 || 12441 <= D && D <= 12543 || 12549 <= D && D <= 12589 || 12593 <= D && D <= 12686 || 12688 <= D && D <= 12730 || 12736 <= D && D <= 12771 || 12784 <= D && D <= 12830 || 12832 <= D && D <= 12871 || 12880 <= D && D <= 13054 || 13056 <= D && D <= 19903 || 19968 <= D && D <= 42124 || 42128 <= D && D <= 42182 || 43360 <= D && D <= 43388 || 44032 <= D && D <= 55203 || 55216 <= D && D <= 55238 || 55243 <= D && D <= 55291 || 63744 <= D && D <= 64255 || 65040 <= D && D <= 65049 || 65072 <= D && D <= 65106 || 65108 <= D && D <= 65126 || 65128 <= D && D <= 65131 || 110592 <= D && D <= 110593 || 127488 <= D && D <= 127490 || 127504 <= D && D <= 127546 || 127552 <= D && D <= 127560 || 127568 <= D && D <= 127569 || 131072 <= D && D <= 194367 || 177984 <= D && D <= 196605 || 196608 <= D && D <= 262141 ? "W" : 32 <= D && D <= 126 || 162 <= D && D <= 163 || 165 <= D && D <= 166 || D == 172 || D == 175 || 10214 <= D && D <= 10221 || 10629 <= D && D <= 10630 ? "Na" : D == 161 || D == 164 || 167 <= D && D <= 168 || D == 170 || 173 <= D && D <= 174 || 176 <= D && D <= 180 || 182 <= D && D <= 186 || 188 <= D && D <= 191 || D == 198 || D == 208 || 215 <= D && D <= 216 || 222 <= D && D <= 225 || D == 230 || 232 <= D && D <= 234 || 236 <= D && D <= 237 || D == 240 || 242 <= D && D <= 243 || 247 <= D && D <= 250 || D == 252 || D == 254 || D == 257 || D == 273 || D == 275 || D == 283 || 294 <= D && D <= 295 || D == 299 || 305 <= D && D <= 307 || D == 312 || 319 <= D && D <= 322 || D == 324 || 328 <= D && D <= 331 || D == 333 || 338 <= D && D <= 339 || 358 <= D && D <= 359 || D == 363 || D == 462 || D == 464 || D == 466 || D == 468 || D == 470 || D == 472 || D == 474 || D == 476 || D == 593 || D == 609 || D == 708 || D == 711 || 713 <= D && D <= 715 || D == 717 || D == 720 || 728 <= D && D <= 731 || D == 733 || D == 735 || 768 <= D && D <= 879 || 913 <= D && D <= 929 || 931 <= D && D <= 937 || 945 <= D && D <= 961 || 963 <= D && D <= 969 || D == 1025 || 1040 <= D && D <= 1103 || D == 1105 || D == 8208 || 8211 <= D && D <= 8214 || 8216 <= D && D <= 8217 || 8220 <= D && D <= 8221 || 8224 <= D && D <= 8226 || 8228 <= D && D <= 8231 || D == 8240 || 8242 <= D && D <= 8243 || D == 8245 || D == 8251 || D == 8254 || D == 8308 || D == 8319 || 8321 <= D && D <= 8324 || D == 8364 || D == 8451 || D == 8453 || D == 8457 || D == 8467 || D == 8470 || 8481 <= D && D <= 8482 || D == 8486 || D == 8491 || 8531 <= D && D <= 8532 || 8539 <= D && D <= 8542 || 8544 <= D && D <= 8555 || 8560 <= D && D <= 8569 || D == 8585 || 8592 <= D && D <= 8601 || 8632 <= D && D <= 8633 || D == 8658 || D == 8660 || D == 8679 || D == 8704 || 8706 <= D && D <= 8707 || 8711 <= D && D <= 8712 || D == 8715 || D == 8719 || D == 8721 || D == 8725 || D == 8730 || 8733 <= D && D <= 8736 || D == 8739 || D == 8741 || 8743 <= D && D <= 8748 || D == 8750 || 8756 <= D && D <= 8759 || 8764 <= D && D <= 8765 || D == 8776 || D == 8780 || D == 8786 || 8800 <= D && D <= 8801 || 8804 <= D && D <= 8807 || 8810 <= D && D <= 8811 || 8814 <= D && D <= 8815 || 8834 <= D && D <= 8835 || 8838 <= D && D <= 8839 || D == 8853 || D == 8857 || D == 8869 || D == 8895 || D == 8978 || 9312 <= D && D <= 9449 || 9451 <= D && D <= 9547 || 9552 <= D && D <= 9587 || 9600 <= D && D <= 9615 || 9618 <= D && D <= 9621 || 9632 <= D && D <= 9633 || 9635 <= D && D <= 9641 || 9650 <= D && D <= 9651 || 9654 <= D && D <= 9655 || 9660 <= D && D <= 9661 || 9664 <= D && D <= 9665 || 9670 <= D && D <= 9672 || D == 9675 || 9678 <= D && D <= 9681 || 9698 <= D && D <= 9701 || D == 9711 || 9733 <= D && D <= 9734 || D == 9737 || 9742 <= D && D <= 9743 || 9748 <= D && D <= 9749 || D == 9756 || D == 9758 || D == 9792 || D == 9794 || 9824 <= D && D <= 9825 || 9827 <= D && D <= 9829 || 9831 <= D && D <= 9834 || 9836 <= D && D <= 9837 || D == 9839 || 9886 <= D && D <= 9887 || 9918 <= D && D <= 9919 || 9924 <= D && D <= 9933 || 9935 <= D && D <= 9953 || D == 9955 || 9960 <= D && D <= 9983 || D == 10045 || D == 10071 || 10102 <= D && D <= 10111 || 11093 <= D && D <= 11097 || 12872 <= D && D <= 12879 || 57344 <= D && D <= 63743 || 65024 <= D && D <= 65039 || D == 65533 || 127232 <= D && D <= 127242 || 127248 <= D && D <= 127277 || 127280 <= D && D <= 127337 || 127344 <= D && D <= 127386 || 917760 <= D && D <= 917999 || 983040 <= D && D <= 1048573 || 1048576 <= D && D <= 1114109 ? "A" : "N";
  }, u2.characterLength = function(F) {
    var s = this.eastAsianWidth(F);
    return s == "F" || s == "W" || s == "A" ? 2 : 1;
  };
  function t(F) {
    return F.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  u2.length = function(F) {
    for (var s = t(F), i = 0, D = 0; D < s.length; D++) i = i + this.characterLength(s[D]);
    return i;
  }, u2.slice = function(F, s, i) {
    textLen = u2.length(F), s = s || 0, i = i || 1, s < 0 && (s = textLen + s), i < 0 && (i = textLen + i);
    for (var D = "", r = 0, n = t(F), E = 0; E < n.length; E++) {
      var a = n[E], o = u2.length(a);
      if (r >= s - (o == 2 ? 1 : 0)) if (r + o <= i) D += a;
      else break;
      r += o;
    }
    return D;
  };
})(W);
var tD = W.exports;
var eD = L(tD);
var FD = function() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};
var sD = L(FD);
function p(e, u2 = {}) {
  if (typeof e != "string" || e.length === 0 || (u2 = { ambiguousIsNarrow: true, ...u2 }, e = P(e), e.length === 0)) return 0;
  e = e.replace(sD(), "  ");
  const t = u2.ambiguousIsNarrow ? 1 : 2;
  let F = 0;
  for (const s of e) {
    const i = s.codePointAt(0);
    if (i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879) continue;
    switch (eD.eastAsianWidth(s)) {
      case "F":
      case "W":
        F += 2;
        break;
      case "A":
        F += t;
        break;
      default:
        F += 1;
    }
  }
  return F;
}
var w = 10;
var N = (e = 0) => (u2) => `\x1B[${u2 + e}m`;
var I = (e = 0) => (u2) => `\x1B[${38 + e};5;${u2}m`;
var R = (e = 0) => (u2, t, F) => `\x1B[${38 + e};2;${u2};${t};${F}m`;
var C = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], gray: [90, 39], grey: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgGray: [100, 49], bgGrey: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
Object.keys(C.modifier);
var iD = Object.keys(C.color);
var rD = Object.keys(C.bgColor);
[...iD, ...rD];
function CD() {
  const e = /* @__PURE__ */ new Map();
  for (const [u2, t] of Object.entries(C)) {
    for (const [F, s] of Object.entries(t)) C[F] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }, t[F] = C[F], e.set(s[0], s[1]);
    Object.defineProperty(C, u2, { value: t, enumerable: false });
  }
  return Object.defineProperty(C, "codes", { value: e, enumerable: false }), C.color.close = "\x1B[39m", C.bgColor.close = "\x1B[49m", C.color.ansi = N(), C.color.ansi256 = I(), C.color.ansi16m = R(), C.bgColor.ansi = N(w), C.bgColor.ansi256 = I(w), C.bgColor.ansi16m = R(w), Object.defineProperties(C, { rgbToAnsi256: { value: (u2, t, F) => u2 === t && t === F ? u2 < 8 ? 16 : u2 > 248 ? 231 : Math.round((u2 - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u2 / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(F / 255 * 5), enumerable: false }, hexToRgb: { value: (u2) => {
    const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(u2.toString(16));
    if (!t) return [0, 0, 0];
    let [F] = t;
    F.length === 3 && (F = [...F].map((i) => i + i).join(""));
    const s = Number.parseInt(F, 16);
    return [s >> 16 & 255, s >> 8 & 255, s & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u2) => C.rgbToAnsi256(...C.hexToRgb(u2)), enumerable: false }, ansi256ToAnsi: { value: (u2) => {
    if (u2 < 8) return 30 + u2;
    if (u2 < 16) return 90 + (u2 - 8);
    let t, F, s;
    if (u2 >= 232) t = ((u2 - 232) * 10 + 8) / 255, F = t, s = t;
    else {
      u2 -= 16;
      const r = u2 % 36;
      t = Math.floor(u2 / 36) / 5, F = Math.floor(r / 6) / 5, s = r % 6 / 5;
    }
    const i = Math.max(t, F, s) * 2;
    if (i === 0) return 30;
    let D = 30 + (Math.round(s) << 2 | Math.round(F) << 1 | Math.round(t));
    return i === 2 && (D += 60), D;
  }, enumerable: false }, rgbToAnsi: { value: (u2, t, F) => C.ansi256ToAnsi(C.rgbToAnsi256(u2, t, F)), enumerable: false }, hexToAnsi: { value: (u2) => C.ansi256ToAnsi(C.hexToAnsi256(u2)), enumerable: false } }), C;
}
var ED = CD();
var d = /* @__PURE__ */ new Set(["\x1B", "\x9B"]);
var oD = 39;
var y = "\x07";
var V = "[";
var nD = "]";
var G = "m";
var _ = `${nD}8;;`;
var z = (e) => `${d.values().next().value}${V}${e}${G}`;
var K = (e) => `${d.values().next().value}${_}${e}${y}`;
var aD = (e) => e.split(" ").map((u2) => p(u2));
var k = (e, u2, t) => {
  const F = [...u2];
  let s = false, i = false, D = p(P(e[e.length - 1]));
  for (const [r, n] of F.entries()) {
    const E = p(n);
    if (D + E <= t ? e[e.length - 1] += n : (e.push(n), D = 0), d.has(n) && (s = true, i = F.slice(r + 1).join("").startsWith(_)), s) {
      i ? n === y && (s = false, i = false) : n === G && (s = false);
      continue;
    }
    D += E, D === t && r < F.length - 1 && (e.push(""), D = 0);
  }
  !D && e[e.length - 1].length > 0 && e.length > 1 && (e[e.length - 2] += e.pop());
};
var hD = (e) => {
  const u2 = e.split(" ");
  let t = u2.length;
  for (; t > 0 && !(p(u2[t - 1]) > 0); ) t--;
  return t === u2.length ? e : u2.slice(0, t).join(" ") + u2.slice(t).join("");
};
var lD = (e, u2, t = {}) => {
  if (t.trim !== false && e.trim() === "") return "";
  let F = "", s, i;
  const D = aD(e);
  let r = [""];
  for (const [E, a] of e.split(" ").entries()) {
    t.trim !== false && (r[r.length - 1] = r[r.length - 1].trimStart());
    let o = p(r[r.length - 1]);
    if (E !== 0 && (o >= u2 && (t.wordWrap === false || t.trim === false) && (r.push(""), o = 0), (o > 0 || t.trim === false) && (r[r.length - 1] += " ", o++)), t.hard && D[E] > u2) {
      const c = u2 - o, f = 1 + Math.floor((D[E] - c - 1) / u2);
      Math.floor((D[E] - 1) / u2) < f && r.push(""), k(r, a, u2);
      continue;
    }
    if (o + D[E] > u2 && o > 0 && D[E] > 0) {
      if (t.wordWrap === false && o < u2) {
        k(r, a, u2);
        continue;
      }
      r.push("");
    }
    if (o + D[E] > u2 && t.wordWrap === false) {
      k(r, a, u2);
      continue;
    }
    r[r.length - 1] += a;
  }
  t.trim !== false && (r = r.map((E) => hD(E)));
  const n = [...r.join(`
`)];
  for (const [E, a] of n.entries()) {
    if (F += a, d.has(a)) {
      const { groups: c } = new RegExp(`(?:\\${V}(?<code>\\d+)m|\\${_}(?<uri>.*)${y})`).exec(n.slice(E).join("")) || { groups: {} };
      if (c.code !== void 0) {
        const f = Number.parseFloat(c.code);
        s = f === oD ? void 0 : f;
      } else c.uri !== void 0 && (i = c.uri.length === 0 ? void 0 : c.uri);
    }
    const o = ED.codes.get(Number(s));
    n[E + 1] === `
` ? (i && (F += K("")), s && o && (F += z(o))) : a === `
` && (s && o && (F += z(s)), i && (F += K(i)));
  }
  return F;
};
function Y(e, u2, t) {
  return String(e).normalize().replace(/\r\n/g, `
`).split(`
`).map((F) => lD(F, u2, t)).join(`
`);
}
var xD = ["up", "down", "left", "right", "space", "enter", "cancel"];
var B = { actions: new Set(xD), aliases: /* @__PURE__ */ new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["", "cancel"], ["escape", "cancel"]]) };
function $(e, u2) {
  if (typeof e == "string") return B.aliases.get(e) === u2;
  for (const t of e) if (t !== void 0 && $(t, u2)) return true;
  return false;
}
function BD(e, u2) {
  if (e === u2) return;
  const t = e.split(`
`), F = u2.split(`
`), s = [];
  for (let i = 0; i < Math.max(t.length, F.length); i++) t[i] !== F[i] && s.push(i);
  return s;
}
var AD = globalThis.process.platform.startsWith("win");
var S = /* @__PURE__ */ Symbol("clack:cancel");
function pD(e) {
  return e === S;
}
function m(e, u2) {
  const t = e;
  t.isTTY && t.setRawMode(u2);
}
var gD = Object.defineProperty;
var vD = (e, u2, t) => u2 in e ? gD(e, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e[u2] = t;
var h = (e, u2, t) => (vD(e, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var x = class {
  constructor(u2, t = true) {
    h(this, "input"), h(this, "output"), h(this, "_abortSignal"), h(this, "rl"), h(this, "opts"), h(this, "_render"), h(this, "_track", false), h(this, "_prevFrame", ""), h(this, "_subscribers", /* @__PURE__ */ new Map()), h(this, "_cursor", 0), h(this, "state", "initial"), h(this, "error", ""), h(this, "value");
    const { input: F = j, output: s = M, render: i, signal: D, ...r } = u2;
    this.opts = r, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = i.bind(this), this._track = t, this._abortSignal = D, this.input = F, this.output = s;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(u2, t) {
    const F = this._subscribers.get(u2) ?? [];
    F.push(t), this._subscribers.set(u2, F);
  }
  on(u2, t) {
    this.setSubscriber(u2, { cb: t });
  }
  once(u2, t) {
    this.setSubscriber(u2, { cb: t, once: true });
  }
  emit(u2, ...t) {
    const F = this._subscribers.get(u2) ?? [], s = [];
    for (const i of F) i.cb(...t), i.once && s.push(() => F.splice(F.indexOf(i), 1));
    for (const i of s) i();
  }
  prompt() {
    return new Promise((u2, t) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted) return this.state = "cancel", this.close(), u2(S);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      const F = new X();
      F._write = (s, i, D) => {
        this._track && (this.value = this.rl?.line.replace(/\t/g, ""), this._cursor = this.rl?.cursor ?? 0, this.emit("value", this.value)), D();
      }, this.input.pipe(F), this.rl = O.createInterface({ input: this.input, output: F, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), O.emitKeypressEvents(this.input, this.rl), this.rl.prompt(), this.opts.initialValue !== void 0 && this._track && this.rl.write(this.opts.initialValue), this.input.on("keypress", this.onKeypress), m(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(S);
      });
    });
  }
  onKeypress(u2, t) {
    if (this.state === "error" && (this.state = "active"), t?.name && (!this._track && B.aliases.has(t.name) && this.emit("cursor", B.aliases.get(t.name)), B.actions.has(t.name) && this.emit("cursor", t.name)), u2 && (u2.toLowerCase() === "y" || u2.toLowerCase() === "n") && this.emit("confirm", u2.toLowerCase() === "y"), u2 === "	" && this.opts.placeholder && (this.value || (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder))), u2 && this.emit("key", u2.toLowerCase()), t?.name === "return") {
      if (!this.value && this.opts.placeholder && (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder)), this.opts.validate) {
        const F = this.opts.validate(this.value);
        F && (this.error = F instanceof Error ? F.message : F, this.state = "error", this.rl?.write(this.value));
      }
      this.state !== "error" && (this.state = "submit");
    }
    $([u2, t?.name, t?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), m(this.input, false), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const u2 = Y(this._prevFrame, process.stdout.columns, { hard: true }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, u2 * -1));
  }
  render() {
    const u2 = Y(this._render(this) ?? "", process.stdout.columns, { hard: true });
    if (u2 !== this._prevFrame) {
      if (this.state === "initial") this.output.write(import_sisteransi.cursor.hide);
      else {
        const t = BD(this._prevFrame, u2);
        if (this.restoreCursor(), t && t?.length === 1) {
          const F = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F)), this.output.write(import_sisteransi.erase.lines(1));
          const s = u2.split(`
`);
          this.output.write(s[F]), this._prevFrame = u2, this.output.write(import_sisteransi.cursor.move(0, s.length - F - 1));
          return;
        }
        if (t && t?.length > 1) {
          const F = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F)), this.output.write(import_sisteransi.erase.down());
          const s = u2.split(`
`).slice(F);
          this.output.write(s.join(`
`)), this._prevFrame = u2;
          return;
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(u2), this.state === "initial" && (this.state = "active"), this._prevFrame = u2;
    }
  }
};
var A;
A = /* @__PURE__ */ new WeakMap();
var RD = class extends x {
  get valueWithCursor() {
    if (this.state === "submit") return this.value;
    if (this.cursor >= this.value.length) return `${this.value}\u2588`;
    const u2 = this.value.slice(0, this.cursor), [t, ...F] = this.value.slice(this.cursor);
    return `${u2}${v.inverse(t)}${F.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(u2) {
    super(u2), this.on("finalize", () => {
      this.value || (this.value = u2.defaultValue);
    });
  }
};

// src/lib/search-prompt.ts
import { select, multiselect } from "@clack/prompts";
import pc from "picocolors";
import process2 from "process";
function isUnicodeSupported() {
  if (process2.platform !== "win32") return process2.env.TERM !== "linux";
  return !!(process2.env.CI || process2.env.WT_SESSION || process2.env.TERMINUS_SUBLIME || process2.env.ConEmuTask === "{cmd::Cmder}" || process2.env.TERM_PROGRAM === "Terminus-Sublime" || process2.env.TERM_PROGRAM === "vscode" || process2.env.TERM === "xterm-256color" || process2.env.TERM === "alacritty" || process2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm");
}
var u = isUnicodeSupported();
var S_ACTIVE = u ? "\u25C6" : "*";
var S_CANCEL = u ? "\u25A0" : "x";
var S_ERROR = u ? "\u25B2" : "x";
var S_SUBMIT = u ? "\u25C7" : "o";
var S_BAR = u ? "\u2502" : "|";
var S_BAR_END = u ? "\u2514" : "\u2014";
var S_RADIO_ON = u ? "\u25CF" : ">";
var S_RADIO_OFF = u ? "\u25CB" : " ";
var S_CHECK_ON = u ? "\u25FC" : "[+]";
var S_CHECK_OFF = u ? "\u25FB" : "[ ]";
function sym(state) {
  switch (state) {
    case "initial":
    case "active":
      return pc.cyan(S_ACTIVE);
    case "cancel":
      return pc.red(S_CANCEL);
    case "error":
      return pc.yellow(S_ERROR);
    case "submit":
      return pc.green(S_SUBMIT);
    default:
      return pc.cyan(S_ACTIVE);
  }
}
function filterOpts(options, keyword) {
  if (!keyword) return options;
  const kw = keyword.toLowerCase();
  return options.filter(
    (o) => o.label.toLowerCase().includes(kw) || o.hint?.toLowerCase().includes(kw)
  );
}
function scrollWindow(options, cursor, renderItem) {
  if (options.length === 0) return [];
  const maxVisible = Math.min(Math.max(process2.stdout.rows - 7, 0), 15);
  if (maxVisible <= 0) return [];
  let start = 0;
  if (options.length > maxVisible) {
    if (cursor >= start + maxVisible - 3) {
      start = Math.max(Math.min(cursor - maxVisible + 3, options.length - maxVisible), 0);
    } else if (cursor < start + 2) {
      start = Math.max(cursor - 2, 0);
    }
  }
  const hasAbove = options.length > maxVisible && start > 0;
  const hasBelow = options.length > maxVisible && start + maxVisible < options.length;
  const visible = options.slice(start, start + maxVisible);
  return visible.map((opt, i) => {
    if (i === 0 && hasAbove) return pc.dim("...");
    if (i === visible.length - 1 && hasBelow) return pc.dim("...");
    return renderItem(opt, start + i === cursor);
  });
}
function overrideKeypress(prompt) {
  const p2 = prompt;
  const orig = p2["onKeypress"].bind(prompt);
  return {
    orig,
    set(fn) {
      p2["onKeypress"] = fn;
    }
  };
}
async function searchSelect(opts) {
  const { message, options, threshold = 10 } = opts;
  if (options.length <= threshold) {
    return select({ message, options });
  }
  let filtered = [...options];
  let listCursor = 0;
  let selectedLabel = "";
  const prompt = new RD({
    defaultValue: "",
    validate() {
      if (filtered.length === 0) return "\u6CA1\u6709\u5339\u914D\u7ED3\u679C\uFF0C\u8BF7\u4FEE\u6539\u5173\u952E\u5B57";
      return void 0;
    },
    render() {
      const st = this.state;
      const bar = st === "error" ? pc.yellow : pc.cyan;
      const hdr = `${pc.gray(S_BAR)}
${sym(st)}  ${message}
`;
      if (st === "submit") {
        return `${hdr}${pc.gray(S_BAR)}  ${pc.dim(selectedLabel)}`;
      }
      if (st === "cancel") {
        const lbl = selectedLabel || "";
        return `${hdr}${pc.gray(S_BAR)}  ${pc.strikethrough(pc.dim(lbl))}${lbl ? `
${pc.gray(S_BAR)}` : ""}`;
      }
      if (st === "error") {
        const input2 = this.value ? this.valueWithCursor : pc.inverse(pc.hidden("_")) + pc.dim(" \u8F93\u5165\u8FC7\u6EE4...");
        return [
          hdr.trimEnd(),
          `${pc.yellow(S_BAR)}  \u{1F50D} ${input2}`,
          `${pc.yellow(S_BAR_END)}  ${pc.yellow(this.error)}`,
          ""
        ].join("\n");
      }
      const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden("_")) + pc.dim(" \u8F93\u5165\u8FC7\u6EE4...");
      const optLines = scrollWindow(filtered, listCursor, (opt, active) => {
        if (active) {
          const hint = opt.hint ? pc.dim(` (${opt.hint})`) : "";
          return `${pc.green(S_RADIO_ON)} ${opt.label}${hint}`;
        }
        return `${pc.dim(S_RADIO_OFF)} ${pc.dim(opt.label)}`;
      });
      const kw = (this.value || "").trim();
      const parts = [
        hdr.trimEnd(),
        `${bar(S_BAR)}  \u{1F50D} ${input}`,
        ...optLines.map((l2) => `${bar(S_BAR)}  ${l2}`)
      ];
      if (kw) {
        parts.push(`${bar(S_BAR)}  ${pc.dim(`\u2500\u2500 ${filtered.length}/${options.length} \u5339\u914D \u2500\u2500`)}`);
      }
      parts.push(`${bar(S_BAR_END)}
`);
      return parts.join("\n");
    }
  });
  const kp = overrideKeypress(prompt);
  kp.set((char, key) => {
    if (key.name === "up") {
      if (filtered.length > 0) {
        listCursor = listCursor <= 0 ? filtered.length - 1 : listCursor - 1;
      }
      prompt.render();
      return;
    }
    if (key.name === "down") {
      if (filtered.length > 0) {
        listCursor = listCursor >= filtered.length - 1 ? 0 : listCursor + 1;
      }
      prompt.render();
      return;
    }
    kp.orig(char, key);
  });
  prompt.on("value", () => {
    const kw = (prompt.value || "").trim();
    filtered = filterOpts(options, kw);
    listCursor = Math.min(listCursor, Math.max(filtered.length - 1, 0));
  });
  let result;
  prompt.once("finalize", () => {
    if (filtered.length > 0) {
      result = filtered[listCursor].value;
      selectedLabel = filtered[listCursor].label;
    }
  });
  const raw = await prompt.prompt();
  if (pD(raw)) return raw;
  return result;
}
async function searchMultiselect(opts) {
  const { message, options, required = true, threshold = 10 } = opts;
  if (options.length <= threshold) {
    return multiselect({ message, options, required });
  }
  let filtered = [...options];
  let listCursor = 0;
  const selectedValues = /* @__PURE__ */ new Set();
  function renderCb(opt, active) {
    const sel = selectedValues.has(opt.value);
    const hint = opt.hint ? pc.dim(` (${opt.hint})`) : "";
    if (active && sel) return `${pc.green(S_CHECK_ON)} ${opt.label}${hint}`;
    if (active) return `${pc.cyan(S_CHECK_OFF)} ${opt.label}${hint}`;
    if (sel) return `${pc.green(S_CHECK_ON)} ${pc.dim(opt.label)}`;
    return `${pc.dim(S_CHECK_OFF)} ${pc.dim(opt.label)}`;
  }
  const prompt = new RD({
    defaultValue: "",
    validate() {
      if (required && selectedValues.size === 0) {
        return `\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u9879
${pc.reset(pc.dim(`${pc.gray(pc.bgWhite(pc.inverse(" \u7A7A\u683C ")))} \u5207\u6362\u9009\u62E9\uFF0C${pc.gray(pc.bgWhite(pc.inverse(" \u56DE\u8F66 ")))} \u786E\u8BA4`))}`;
      }
      return void 0;
    },
    render() {
      const st = this.state;
      const bar = st === "error" ? pc.yellow : pc.cyan;
      const countSuffix = selectedValues.size > 0 ? pc.dim(` (\u5DF2\u9009 ${selectedValues.size} \u9879)`) : "";
      const hdr = `${pc.gray(S_BAR)}
${sym(st)}  ${message}${countSuffix}
`;
      if (st === "submit") {
        const labels = options.filter((o) => selectedValues.has(o.value)).map((o) => pc.dim(o.label)).join(pc.dim(", "));
        return `${hdr}${pc.gray(S_BAR)}  ${labels || pc.dim("\u65E0")}`;
      }
      if (st === "cancel") {
        const labels = options.filter((o) => selectedValues.has(o.value)).map((o) => pc.strikethrough(pc.dim(o.label))).join(pc.dim(", "));
        return `${hdr}${pc.gray(S_BAR)}  ${labels}${labels ? `
${pc.gray(S_BAR)}` : ""}`;
      }
      if (st === "error") {
        const input2 = this.value ? this.valueWithCursor : pc.inverse(pc.hidden("_")) + pc.dim(" \u8F93\u5165\u8FC7\u6EE4... (\u7A7A\u683C\u5207\u6362\u9009\u62E9)");
        const optLines2 = scrollWindow(filtered, listCursor, renderCb);
        const errLines = this.error.split("\n").map(
          (line, i) => i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(line)}` : `   ${line}`
        );
        return [
          hdr.trimEnd(),
          `${pc.yellow(S_BAR)}  \u{1F50D} ${input2}`,
          ...optLines2.map((l2) => `${pc.yellow(S_BAR)}  ${l2}`),
          ...errLines,
          ""
        ].join("\n");
      }
      const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden("_")) + pc.dim(" \u8F93\u5165\u8FC7\u6EE4... (\u7A7A\u683C\u5207\u6362\u9009\u62E9)");
      const optLines = scrollWindow(filtered, listCursor, renderCb);
      const kw = (this.value || "").trim();
      const parts = [
        hdr.trimEnd(),
        `${bar(S_BAR)}  \u{1F50D} ${input}`,
        ...optLines.map((l2) => `${bar(S_BAR)}  ${l2}`)
      ];
      if (kw) {
        parts.push(`${bar(S_BAR)}  ${pc.dim(`\u2500\u2500 ${filtered.length}/${options.length} \u5339\u914D \u2500\u2500`)}`);
      }
      parts.push(`${bar(S_BAR_END)}
`);
      return parts.join("\n");
    }
  });
  const kp = overrideKeypress(prompt);
  kp.set((char, key) => {
    if (key.name === "up") {
      if (filtered.length > 0) {
        listCursor = listCursor <= 0 ? filtered.length - 1 : listCursor - 1;
      }
      prompt.render();
      return;
    }
    if (key.name === "down") {
      if (filtered.length > 0) {
        listCursor = listCursor >= filtered.length - 1 ? 0 : listCursor + 1;
      }
      prompt.render();
      return;
    }
    if (char === " " || key.name === "space") {
      if (filtered.length > 0) {
        const item = filtered[listCursor];
        if (selectedValues.has(item.value)) {
          selectedValues.delete(item.value);
        } else {
          selectedValues.add(item.value);
        }
      }
      prompt.render();
      return;
    }
    kp.orig(char, key);
  });
  prompt.on("value", () => {
    const kw = (prompt.value || "").trim();
    filtered = filterOpts(options, kw);
    listCursor = Math.min(listCursor, Math.max(filtered.length - 1, 0));
  });
  let result = [];
  prompt.once("finalize", () => {
    result = options.filter((o) => selectedValues.has(o.value)).map((o) => o.value);
  });
  const raw = await prompt.prompt();
  if (pD(raw)) return raw;
  return result;
}

// src/lib/utils.ts
function onCancel(value) {
  if (isCancel(value)) {
    cancel("\u5DF2\u53D6\u6D88");
    process.exit(0);
  }
}

// src/commands/create.ts
import path3 from "path";
import { text, confirm, spinner, log, note } from "@clack/prompts";

// src/lib/config.ts
import fs from "fs";
import path from "path";
import os from "os";
var CONFIG_DIR = path.join(os.homedir(), ".gwt");
var CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
function defaultConfig() {
  return { workspaces: [] };
}
function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return defaultConfig();
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultConfig();
  }
}
function saveConfig(config) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
function addWorkspace(config, workspace) {
  config.workspaces.push(workspace);
  saveConfig(config);
  return config;
}
function removeWorkspaceById(config, id) {
  config.workspaces = config.workspaces.filter((w2) => w2.id !== id);
  saveConfig(config);
  return config;
}
function generateId() {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// src/lib/git.ts
import { exec } from "child_process";
import { promisify } from "util";
import fs2 from "fs";
import path2 from "path";
var execAsync = promisify(exec);
var GIT_TIMEOUT = 3e4;
var FETCH_TIMEOUT = 8e3;
async function git(args, cwd, timeout = GIT_TIMEOUT) {
  try {
    const { stdout } = await execAsync(`git ${args}`, {
      cwd,
      encoding: "utf-8",
      timeout,
      maxBuffer: 10 * 1024 * 1024,
      // 10MB
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      // 禁止 git 弹交互式认证，避免在 TUI raw mode 下挂起
      windowsHide: true
    });
    return stdout.trim();
  } catch (error) {
    const err = error;
    if (err.killed) throw new Error("git \u547D\u4EE4\u8D85\u65F6");
    const msg = err.stderr?.trim() || err.message;
    throw new Error(msg);
  }
}
function isGitRepo(dirPath) {
  const gitPath = path2.join(dirPath, ".git");
  return fs2.existsSync(gitPath);
}
async function scanGitRepos(dir) {
  if (isGitRepo(dir)) {
    return [{ name: path2.basename(dir), path: dir }];
  }
  const entries = fs2.readdirSync(dir, { withFileTypes: true });
  const repos = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path2.join(dir, entry.name);
    if (isGitRepo(fullPath)) {
      repos.push({ name: entry.name, path: fullPath });
    }
  }
  return repos.sort((a, b2) => a.name.localeCompare(b2.name));
}
async function fetchAll(repoPath) {
  await git("fetch --all --prune", repoPath, FETCH_TIMEOUT);
}
async function getBranches(repoPath) {
  const [localRaw, remoteRaw] = await Promise.all([
    git('branch "--format=%(refname:short)"', repoPath),
    git('branch -r "--format=%(refname:short)"', repoPath)
  ]);
  const local = localRaw ? localRaw.split("\n").map((b2) => b2.trim()).filter(Boolean) : [];
  const remote = remoteRaw ? remoteRaw.split("\n").map((b2) => b2.trim()).filter((b2) => b2 && b2.includes("/") && !b2.includes("HEAD")).map((b2) => b2.replace(/^[^/]+\//, "")) : [];
  const remoteOnly = [...new Set(remote.filter((r) => !local.includes(r)))];
  return { local, remote: remoteOnly };
}
async function createWorktree(repoPath, targetPath, branch) {
  const localRaw = await git('branch --list "--format=%(refname:short)"', repoPath);
  const localBranches = localRaw ? localRaw.split("\n").map((b2) => b2.trim()).filter(Boolean) : [];
  if (localBranches.includes(branch)) {
    await git(`worktree add -f "${targetPath}" "${branch}"`, repoPath);
    return;
  }
  const remoteRaw = await git('branch -r "--format=%(refname:short)"', repoPath);
  const remoteBranches = remoteRaw ? remoteRaw.split("\n").map((b2) => b2.trim()).filter(Boolean) : [];
  const remoteRef = remoteBranches.find((b2) => b2.endsWith(`/${branch}`));
  if (remoteRef) {
    await git(`worktree add -b "${branch}" "${targetPath}" "${remoteRef}"`, repoPath);
    return;
  }
  await git(`worktree add -b "${branch}" "${targetPath}"`, repoPath);
}
async function removeWorktree(repoPath, worktreePath) {
  try {
    await git(`worktree remove --force "${worktreePath}"`, repoPath);
  } catch {
    try {
      await git("worktree prune", repoPath);
    } catch {
    }
  }
}
function branchToDir(branch) {
  return branch.replace(/\//g, "--");
}

// src/commands/create.ts
async function createWorkspace() {
  const config = loadConfig();
  const cwd = process.cwd();
  const sourceDir = await text({
    message: "\u9879\u76EE\u6240\u5728\u76EE\u5F55:",
    initialValue: cwd,
    validate: (val) => {
      if (!val) return "\u8BF7\u8F93\u5165\u76EE\u5F55\u8DEF\u5F84";
    }
  });
  onCancel(sourceDir);
  const resolvedSource = path3.resolve(sourceDir);
  const s = spinner();
  s.start("\u626B\u63CF git \u4ED3\u5E93...");
  let repos;
  try {
    repos = await scanGitRepos(resolvedSource);
  } catch (err) {
    s.stop(`\u626B\u63CF\u5931\u8D25: ${err.message}`);
    return;
  }
  if (repos.length === 0) {
    s.stop(`${resolvedSource} \u4E0B\u672A\u53D1\u73B0 git \u4ED3\u5E93`);
    return;
  }
  const isSingleRepo = repos.length === 1 && isGitRepo(resolvedSource);
  s.stop(
    isSingleRepo ? `\u5F53\u524D\u76EE\u5F55\u662F git \u4ED3\u5E93: ${repos[0].name}` : `\u53D1\u73B0 ${repos.length} \u4E2A git \u4ED3\u5E93`
  );
  let selectedRepos;
  if (isSingleRepo) {
    selectedRepos = repos;
  } else {
    const selectedNames = await searchMultiselect({
      message: "\u9009\u62E9\u8981\u521B\u5EFA worktree \u7684\u9879\u76EE:",
      options: repos.map((r) => ({
        value: r.name,
        label: r.name
      })),
      required: true
    });
    onCancel(selectedNames);
    selectedRepos = selectedNames.map(
      (name) => repos.find((r) => r.name === name)
    );
  }
  const firstRepo = selectedRepos[0];
  const sf = spinner();
  sf.start(`\u52A0\u8F7D\u5206\u652F\u5217\u8868 (${firstRepo.name})...`);
  let branches;
  let branchHint = "\u5DF2\u5237\u65B0\u8FDC\u7AEF\u5206\u652F";
  try {
    await fetchAll(firstRepo.path);
  } catch {
    branchHint = "\u8FDC\u7AEF\u5237\u65B0\u5931\u8D25\uFF0C\u4F7F\u7528\u672C\u5730\u7F13\u5B58";
  }
  try {
    branches = await getBranches(firstRepo.path);
  } catch (err) {
    sf.stop(`\u83B7\u53D6\u5206\u652F\u5931\u8D25: ${err.message}`);
    return;
  }
  sf.stop(branchHint);
  const branchOptions = [
    ...branches.local.map((b2) => ({ value: b2, label: b2, hint: "local" })),
    ...branches.remote.map((b2) => ({ value: b2, label: b2, hint: "remote" })),
    { value: "__custom__", label: "+ \u8F93\u5165\u5206\u652F\u540D" }
  ];
  const selectedBranch = await searchSelect({
    message: `\u9009\u62E9\u5206\u652F (\u57FA\u4E8E ${firstRepo.name} \u7684\u5206\u652F\u5217\u8868):`,
    options: branchOptions
  });
  onCancel(selectedBranch);
  let branch;
  if (selectedBranch === "__custom__") {
    const custom = await text({
      message: "\u5206\u652F\u540D:",
      placeholder: "feature/xxx",
      validate: (val) => {
        if (!val) return "\u8BF7\u8F93\u5165\u5206\u652F\u540D";
      }
    });
    onCancel(custom);
    branch = custom;
  } else {
    branch = selectedBranch;
  }
  const baseDir = isSingleRepo ? path3.dirname(resolvedSource) : path3.dirname(resolvedSource);
  const baseName = isSingleRepo ? path3.basename(resolvedSource) : path3.basename(resolvedSource);
  const defaultTarget = path3.join(
    baseDir,
    `${baseName}--${branchToDir(branch)}`
  );
  const targetDir = await text({
    message: "worktree \u7EC4\u76EE\u5F55:",
    initialValue: defaultTarget,
    validate: (val) => {
      if (!val) return "\u8BF7\u8F93\u5165\u8DEF\u5F84";
    }
  });
  onCancel(targetDir);
  const resolvedTarget = path3.resolve(targetDir);
  const summary = selectedRepos.map((r) => `  ${r.name}`).join("\n");
  note(
    `${summary}

  \u5206\u652F: ${branch}
  \u76EE\u6807: ${resolvedTarget}`,
    `\u5373\u5C06\u521B\u5EFA ${selectedRepos.length} \u4E2A worktree`
  );
  const confirmed = await confirm({ message: "\u786E\u8BA4\u521B\u5EFA?" });
  onCancel(confirmed);
  if (!confirmed) return;
  const wsRepos = [];
  for (const repo of selectedRepos) {
    const wtPath = isSingleRepo ? resolvedTarget : path3.join(resolvedTarget, repo.name);
    const s2 = spinner();
    s2.start(`${repo.name} \u2192 ${branch}`);
    try {
      await createWorktree(repo.path, wtPath, branch);
      wsRepos.push({
        name: repo.name,
        sourcePath: repo.path,
        branch,
        worktreePath: wtPath
      });
      s2.stop(`${repo.name} \u2192 ${branch}`);
    } catch (err) {
      s2.stop(`${repo.name} \u5931\u8D25: ${err.message}`);
    }
  }
  if (wsRepos.length > 0) {
    addWorkspace(config, {
      id: generateId(),
      sourceDir: resolvedSource,
      targetDir: resolvedTarget,
      branch,
      repos: wsRepos,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    note(
      wsRepos.map((r) => `  ${r.name}`).join("\n") + `

  cd ${resolvedTarget}`,
      `\u5B8C\u6210 (${wsRepos.length}/${selectedRepos.length} \u6210\u529F)`
    );
  } else {
    log.error("\u6240\u6709\u4ED3\u5E93\u521B\u5EFA\u5931\u8D25");
  }
}

// src/commands/list.ts
import { log as log2, note as note2 } from "@clack/prompts";
import pc2 from "picocolors";
async function listWorkspaces() {
  const config = loadConfig();
  if (config.workspaces.length === 0) {
    log2.info("\u6CA1\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A\uFF0C\u4F7F\u7528 gwt create \u521B\u5EFA");
    return;
  }
  for (const ws of config.workspaces) {
    const repos = ws.repos.map((r) => `  ${pc2.cyan(r.name)} \u2192 ${pc2.green(r.worktreePath)}`).join("\n");
    const time = new Date(ws.createdAt).toLocaleString();
    note2(
      `${repos}

  \u521B\u5EFA\u4E8E: ${pc2.dim(time)}`,
      `${pc2.yellow(ws.branch)} \u2190 ${ws.sourceDir}`
    );
  }
  log2.info(`\u5171 ${config.workspaces.length} \u4E2A\u5DE5\u4F5C\u533A`);
}

// src/commands/remove.ts
import fs3 from "fs";
import { select as select2, confirm as confirm2, spinner as spinner2, log as log3 } from "@clack/prompts";
import pc3 from "picocolors";
async function removeWorkspaceCmd() {
  const config = loadConfig();
  if (config.workspaces.length === 0) {
    log3.info("\u6CA1\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A");
    return;
  }
  const wsId = await select2({
    message: "\u9009\u62E9\u8981\u5220\u9664\u7684\u5DE5\u4F5C\u533A:",
    options: config.workspaces.map((ws2) => ({
      value: ws2.id,
      label: `${ws2.branch} \u2190 ${ws2.sourceDir}`,
      hint: ws2.repos.map((r) => r.name).join(", ")
    }))
  });
  onCancel(wsId);
  const ws = config.workspaces.find((w2) => w2.id === wsId);
  log3.info(`\u5DE5\u4F5C\u533A: ${ws.targetDir}`);
  log3.info(`\u5206\u652F: ${ws.branch}`);
  for (const repo of ws.repos) {
    log3.message(`  ${repo.name} \u2192 ${repo.worktreePath}`);
  }
  const yes = await confirm2({ message: "\u786E\u8BA4\u5220\u9664? (\u5C06\u79FB\u9664\u6240\u6709 worktree)" });
  onCancel(yes);
  if (!yes) return;
  const s = spinner2();
  for (const repo of ws.repos) {
    s.start(`\u6CE8\u9500 ${repo.name}...`);
    try {
      await removeWorktree(repo.sourcePath, repo.worktreePath);
      s.stop(`${pc3.green("ok")} ${repo.name}`);
    } catch (err) {
      s.stop(`${pc3.yellow("\u26A0")} ${repo.name}: ${err.message}`);
    }
  }
  if (fs3.existsSync(ws.targetDir)) {
    try {
      fs3.rmSync(ws.targetDir, { recursive: true, force: true });
    } catch (err) {
      log3.error(`\u5220\u9664\u76EE\u5F55\u5931\u8D25: ${err.message}
  ${ws.targetDir}`);
      return;
    }
  }
  if (fs3.existsSync(ws.targetDir)) {
    log3.error(`\u65E0\u6CD5\u5220\u9664\u76EE\u5F55 ${ws.targetDir}\uFF0C\u5DE5\u4F5C\u533A\u4FDD\u7559\u5728\u914D\u7F6E\u4E2D`);
    return;
  }
  removeWorkspaceById(config, ws.id);
  log3.success("\u5DE5\u4F5C\u533A\u5DF2\u5220\u9664");
}

// src/index.ts
import pc4 from "picocolors";
async function mainMenu() {
  intro(pc4.cyan("Git Worktree Manager"));
  const action = await select3({
    message: "\u9009\u62E9\u64CD\u4F5C:",
    options: [
      { value: "create", label: "\u521B\u5EFA\u5DE5\u4F5C\u533A", hint: "\u626B\u63CF\u76EE\u5F55\uFF0C\u6279\u91CF\u68C0\u51FA worktree" },
      { value: "list", label: "\u67E5\u770B\u5DE5\u4F5C\u533A", hint: "\u5217\u51FA\u6240\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A" },
      { value: "remove", label: "\u5220\u9664\u5DE5\u4F5C\u533A", hint: "\u79FB\u9664 worktree \u5E76\u6E05\u7406" }
    ]
  });
  onCancel(action);
  switch (action) {
    case "create":
      await createWorkspace();
      break;
    case "list":
      await listWorkspaces();
      break;
    case "remove":
      await removeWorkspaceCmd();
      break;
  }
  outro(pc4.dim("done"));
}
var program = new Command();
program.name("gwt").description("Git Worktree Manager - \u591A\u4ED3\u5E93 worktree \u7BA1\u7406\u5DE5\u5177").version("1.3.0").action(mainMenu);
program.command("create").description("\u521B\u5EFA\u5DE5\u4F5C\u533A - \u626B\u63CF\u76EE\u5F55\uFF0C\u6279\u91CF\u68C0\u51FA worktree").action(async () => {
  intro(pc4.cyan("\u521B\u5EFA\u5DE5\u4F5C\u533A"));
  await createWorkspace();
  outro(pc4.dim("done"));
});
program.command("list").description("\u67E5\u770B\u6240\u6709\u6D3B\u8DC3\u5DE5\u4F5C\u533A").action(async () => {
  intro(pc4.cyan("\u5DE5\u4F5C\u533A\u5217\u8868"));
  await listWorkspaces();
  outro(pc4.dim("done"));
});
program.command("remove").description("\u5220\u9664\u5DE5\u4F5C\u533A").action(async () => {
  intro(pc4.cyan("\u5220\u9664\u5DE5\u4F5C\u533A"));
  await removeWorkspaceCmd();
  outro(pc4.dim("done"));
});
program.parse();
