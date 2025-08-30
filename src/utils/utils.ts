import { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { Href } from './href';

export function getHrefsFromContainer(parent: Cheerio<Element>): Href[] {
  return parent
    .find('ul.commas > li > a')
    .map((_, el) => {
      const text = el.type === 'tag' ? el.children.map(c => c.type === 'text' ? c.data : '').join('').trim() : '';
      const href = el.attribs?.href ?? '';
      return { name: text, href: 'https://archiveofourown.org' + href };
    })
    .get();
}

export function getHrefsFromElement($: CheerioAPI, element: Cheerio<Element>): Href[] {
    const array: Href[] = [];
    const commas = element.children('ul.commas').children();
    for (let i = 0; i < commas.length; i++) {
        const child = $(commas[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')!
        });
    }
    return array;
}

export function getHrefFromElement(element: Cheerio<Element>): Href | undefined {
    return {
        name: element.text().trim(),
        href: 'https://archiveofourown.org' + element.attr('href')!
    };
}

export function getHrefsFromListbox($: CheerioAPI, element: Cheerio<Element>): Href[] {
    const array: Href[] = [];
    const treeIndex = element.children('ul[class="tags tree index"]').children();
    for (let i = 0; i < treeIndex.length; i++) {
        const child = $(treeIndex[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')!
        });
    }
    return array;
}
