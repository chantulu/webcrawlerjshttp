import { test, expect } from "@jest/globals";
import { getURLsFromHTML, normalizeURL } from "./crawl.js";

test("normalizeURL protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL http", () => {
  const input = "http://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("returns an empty array for empty HTML", () => {
  const htmlBody = "";
  const baseURL = "https://example.com";
  const expectedUrls = [];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("returns an empty array for HTML without links", () => {
  const htmlBody = "<p>This is some text</p>";
  const baseURL = "https://example.com";
  const expectedUrls = [];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("returns absolute URLs from absolute links", () => {
  const htmlBody = '<a href="https://www.google.com/">Google</a>';
  const baseURL = "https://example.com";
  const expectedUrls = ["https://www.google.com/"];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("returns absolute URLs from relative links with baseURL", () => {
  const htmlBody = '<a href="/about">About</a>';
  const baseURL = "https://example.com";
  const expectedUrls = ["https://example.com/about"];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("returns absolute URLs from relative links without trailing slash in baseURL", () => {
  const htmlBody = '<a href="/about">About</a>';
  const baseURL = "https://example.com"; // No trailing slash
  const expectedUrls = ["https://example.com/about"];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("returns absolute URLs for multiple links", () => {
  const htmlBody = `
      <a href="https://www.google.com/">Google</a>
      <a href="/about">About</a>
      <a href="https://www.youtube.com/">YouTube</a>`;
  const baseURL = "https://example.com";
  const expectedUrls = [
    "https://www.google.com/",
    "https://example.com/about",
    "https://www.youtube.com/",
  ];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("handles fragment identifiers (hash)", () => {
  const htmlBody = '<a href="#top">Go to Top</a>';
  const baseURL = "https://example.com/about";
  const expectedUrls = ["https://example.com/about#top"];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});

test("ignores mailto links", () => {
  const htmlBody = '<a href="mailto:support@example.com">Contact Us</a>';
  const baseURL = "https://example.com";
  const expectedUrls = [];

  expect(getURLsFromHTML(htmlBody, baseURL)).toEqual(expectedUrls);
});
