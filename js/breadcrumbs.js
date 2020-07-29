(function() {

var prefix = 'Navigation'

var separator = '/';

var dtRoot = window.location.href.substring(0, window.location.href.indexOf('suttas')).replace(/\/$/, '')

var linkSpecs = {
  'suttas': ['Suttas', dtRoot + '/suttas/index.html'],
  'DN': ['DN', dtRoot + '/suttas/DN/index_DN.html'],
  'MN': ['MN', dtRoot + '/suttas/MN/index_MN.html'],
  'SN': ['SN', dtRoot + '/suttas/SN/index_SN.html'],
  'AN': ['AN', dtRoot + '/suttas/AN/index_AN.html'],
  'KN': ['KN', dtRoot + '/suttas/KN/index_KN.html'],
  'Dhp': ['Dhp', dtRoot + '/suttas/KN/Dhp/index_Dhp.html'],
  'Khp': ['Khp', dtRoot + '/suttas/KN/Khp/index_Khp.html'],
  'Ud': ['Ud', dtRoot + '/suttas/KN/Ud/index_Ud.html'],
  'Iti': ['Iti', dtRoot + '/suttas/KN/Iti/index_Iti.html'],
  'StNp': ['Sn', dtRoot + '/suttas/KN/StNp/index_StNp.html'],
  'Thag': ['Thag', dtRoot + '/suttas/KN/Thag/index_Thag.html'],
  'Thig': ['Thig', dtRoot + '/suttas/KN/Thig/index_Thig.html'],

  'QuestionofBhikkhuniOrdination': ['Bhikkhuni Ordination', dtRoot + '/books/QuestionofBhikkhuniOrdination/Contents.html'],
  'FactorsforAwakening': ['Factors for Awakening', dtRoot + '/books/FactorsforAwakening/Contents.html'],
  'NibbanaDescription': ['Talking about Nirvana', dtRoot + '/books/uncollected/NibbanaDescription.html'],
  'books': ['Books', dtRoot + '/ebook_index.html'],
  'uncollected': ['Misc Essays', dtRoot + '/uncollected_essays_index.html'],
};

var removeEmpty = function(arr) {
  return arr.filter(function(item) {
    return item != undefined && item != '';
  });
}

var getSuttasIndex = function() {
  return '/suttas/index.html';
}

var getCurrentPage = function() {
  return window.location.pathname;
}

var getPathParts = function(path) {
  var parts = path.replace('.html', '').split('/');
  return removeEmpty(parts);
}

var getMainHeadings = function() {
  title = $('h1');

  if (title.length == 0)
    title = $('h2');

  if (title.length == 0)
    title = $('h3');

  if (title.length == 0)
    return null;

  return title;
}

var getMainHeading = function() {
  title = $('h1');

  if (title.length != 1)
    title = $('h2');

  if (title.length != 1)
    title = $('h3');

  if (title.length != 1)
    return null;

  return title.first();
}

var prettifyName = function(name) {
  if (name.includes('intro'))
    return 'Introduction';

  if (name.includes('prolog'))
    return 'Prologue';

  if (name.includes('epilog'))
    return 'Epilogue';

  if (name.includes('app'))
    return name.replace(/app(.+)/, 'Appendix $1');

  if (getCurrentPage().includes('/suttas')) {
    name = name.replace('_', ':')
               .replace(/([A-Za-z]+)0*([0-9:]+)/, '$2');
  } else {
    name = name.replace('_', ' ');
  }


  if (!getCurrentPage().includes('/suttas')) {
    name = name.replace(/([A-Z])/g, ' $1').trim();

    if (/^(Section)?\d+$/.test(name)) {
      title = getMainHeadings();

      if (!title || title.length > 1)
        name = '...';
      else
        name = title.text();
    }
  }


  return name;
}

var getLinkSpec = function(partName) {
  if (partName in linkSpecs) {
    return linkSpecs[partName];
  } else {
    if (partName.startsWith('index')) {
      return null;
    } else {
      if (!getCurrentPage().includes('suttas/')) {
        if (!partName.includes('Section') && !partName.includes('Cover')) {
          toc = $('img[title="table of contents"]');

          if (toc.length == 0)
            toc = $('img[title="Table of Contents"]');

          tocHref = toc.closest('a').attr('href');

          return [prettifyName(partName), tocHref];
        } else {
          return [prettifyName(partName), getCurrentPage()];
        }
      } else {
        return [prettifyName(partName), getCurrentPage()];
      }
    }
  }
}

var getAnchorTag = function(linkSpec) {
  if (linkSpec == null)
    return;

  var name = linkSpec[0];
  var url = linkSpec[1];
  return '<a href="' + url + '">' + name + '</a>';
}

$(document).ready(function() {
  var currentPage = getCurrentPage();
  var parts = getPathParts(currentPage);
  var links = removeEmpty(parts.map(getLinkSpec).map(getAnchorTag));

  for (i = 0; i < links.length; i++) {
    if (i == links.length - 1)
      links[i] = '<span class="current">' + links[i] + '</span>';
    else
      links[i] = '<span>' + links[i] + '</span>';
  }

  var html = '<div class="breadcrumbs"><span class="prefix">'
             + prefix
             + '</span>'
             + links.join('<span class="separator">' + separator + '</span>')
             + '</div>';

  if (currentPage != '/suttas/index.html' &&
       currentPage != '/suttas/index_mobile.html' &&
       $('#titlepage').length == 0) {
    h = getMainHeading();

    if (h)
      h.after(html);
    else
      $('#content').prepend(html);
  }
})
})()
