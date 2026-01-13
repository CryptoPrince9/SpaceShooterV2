import "react-native-get-random-values";
import "@ethersproject/shims";
import { polyfillWebCrypto } from "expo-standard-web-crypto";

// Polyfill for TextEncoder/TextDecoder
import "text-encoding-polyfill";

// Polyfill for URL
import "react-native-url-polyfill/auto";

global.Buffer = require("buffer").Buffer;
global.process = require("process");
global.process.env.NODE_ENV = __DEV__ ? "development" : "production";
polyfillWebCrypto();
