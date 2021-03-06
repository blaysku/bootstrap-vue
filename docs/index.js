import package_info from '../package.json'
import components from './components'
import directives from './directives'
import reference from './reference'
import layout from './layout'
import misc from './misc'
import setup from '~/../README.md';

// Process an hTML readme and create a page TOC array
function processHeadings(readme) {
    if (!readme) {
        return [];
    }
    const toc = [];

    // Grab the first H1 tag with ID from readme
    const h1 = readme.match(/<h1.*? id="([^"]+)".*?>(.+?)<\/h1>/) || [];

    // Grab all the H2 and H3 tags with ID's from readme
    const headings = readme.match(/<h[23].*? id="[^"]+".+?<\/h\d>/g) || [];

    // Process teh h2 and h3 headings
    let h2Idx = 0;
    headings.forEach(heading => {
        // Pass the link, label and heading level
        const matches = heading.match(/^<(h[23]).*? id="([^"]+)"[^>]*>(.+?)<\/h\d>$/);
        const tag = matches[1];
        const href = `#${matches[2]}`;
        // Remove any HTML markup in the label
        const label = matches[3].replace(/<[^>]+>/g, '');
        if (tag === 'h2') {
            toc.push({ href, label });
            h2Idx = toc.length;
        } else if (tag === 'h3') {
            toc[h2Idx] = toc[h2Idx] || [];
            toc[h2Idx].push({ href, label });
        }
    });
    return { toc, title: h1[2] || '', top: h1[1] ? `#${h1[1]}` : '' };
}

function makeTOC(setup, layout, sections) {
    const toc = {};
    toc['/docs/'] = processHeadings(setup);
    toc['/docs/layout/'] = processHeadings(layout.readme);
    Object.keys(sections).forEach(section => {
        Object.keys(sections[section]).forEach(page => {
            toc[`/docs/${section}/${page}/`] = processHeadings(sections[section][page].readme);
        });
    });
    return toc;
}

// Our site object
export default {
    package_info,
    toc: makeTOC(setup, layout, { components, directives, reference, misc }),
    nav: [
        {
            title: 'Getting started',
            slug: '',
        },
        {
            title: 'Layout & Grid',
            slug: 'layout/',
            new: true
        },
        {
            title: 'Components',
            slug: 'components/',
            pages: Object.keys(components).map(key => {
                return {
                    title: components[key].meta.title,
                    new: components[key].meta.new,
                    beta: components[key].meta.beta,
                    breaking: components[key].meta.breaking,
                    slug: key
                }
            })
        },
        {
            title: 'Directives',
            slug: 'directives/',
            pages: Object.keys(directives).map(key => {
                return {
                    title: directives[key].meta.title,
                    new: directives[key].meta.new,
                    beta: directives[key].meta.beta,
                    breaking: directives[key].meta.breaking,
                    slug: key
                }
            })
        },
        {
            title: 'Reference',
            slug: 'reference/',
            new: true,
            pages: Object.keys(reference).map(key => {
                return {
                    title: reference[key].meta.title,
                    new: reference[key].meta.new,
                    beta: reference[key].meta.beta,
                    slug: key
                }
            })
        },
        {
            title: 'Misc',
            slug: 'misc/',
            pages: Object.keys(misc).map(key => {
                return {
                    title: misc[key].meta.title,
                    new: misc[key].meta.new,
                    beta: misc[key].meta.beta,
                    slug: key
                }
            })
        }
    ]
}
