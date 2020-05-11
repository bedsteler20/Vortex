import BrTag from './bbcode/BrTag';
import FontTag from './bbcode/FontTag';
import HeadingTag from './bbcode/HeadingTag';
import IdentityTag from './bbcode/IdentityTag';
import LineTag from './bbcode/LineTag';
import LinkTag from './bbcode/LinkTag';
import MoreTag from './bbcode/MoreTag';
import SizeTag from './bbcode/SizeTag';
import SpoilerTag from './bbcode/SpoilerTag';
import SvgTag from './bbcode/SvgTag';
import TooltipTag from './bbcode/TooltipTag';
import YoutubeTag from './bbcode/YoutubeTag';

import * as bbcode from 'bbcode-to-react';
import React = require('react');

const fullParser = new bbcode.Parser();

fullParser.registerTag('size', SizeTag);
fullParser.registerTag('br', BrTag);
fullParser.registerTag('email', LinkTag);
fullParser.registerTag('link', LinkTag);
fullParser.registerTag('url', LinkTag);
fullParser.registerTag('spoiler', SpoilerTag);
fullParser.registerTag('font', FontTag);
fullParser.registerTag('youtube', YoutubeTag);
fullParser.registerTag('line', LineTag);
fullParser.registerTag('heading', HeadingTag);
fullParser.registerTag('svg', SvgTag);
fullParser.registerTag('more', MoreTag);
fullParser.registerTag('tooltip', TooltipTag);

const stripParser = new bbcode.Parser();
stripParser.registerTag('br', BrTag);
['size', 'email', 'font', 'link', 'url', 'spoiler',
 'font', 'youtube', 'line', 'heading', 'svg', 'b', 'u']
 .forEach(tag => stripParser.registerTag(tag, IdentityTag));

let convertDiv: HTMLDivElement;

function transformSymbol(fullMatch, symbol: string): string {
  if (convertDiv === undefined) {
    convertDiv = document.createElement('div');
  }
  convertDiv.innerHTML = symbol;
  return convertDiv.innerText;
}

function preProcess(input: string): string {
  return input
      .replace(/<br *\/?>/g, '[br][/br]')
      .replace(/(&[^;]+;)/g, transformSymbol);
}

function renderBBCode(input: string): React.ReactChild[] {
  if (input === undefined) {
    return [''];
  }

  return fullParser.toReact(preProcess(input));
}

export function stripBBCode(input: string): string {
  if (input === undefined) {
    return '';
  }

  return stripParser.toReact(input.replace(/<br *\/?>/g, '[br][/br]')
      .replace(/(&[^;]+;)/g, transformSymbol))
      .filter(line => typeof(line) === 'string')
      .join('');
}

export function bbcodeToHTML(input: string): string {
  const res: string | string[] = fullParser.toHTML(preProcess(input));
  // according to the typings toHTML should return an array of strings but
  // in practice I found it to return just a string
  if (Array.isArray(res)) {
    return res.join();
  } else {
    return res;
  }
}

export default renderBBCode;
