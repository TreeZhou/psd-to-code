import PSD from 'psd.js/lib/psd.js';

export default function parsePsd(psdPath) {
  return PSD.open(psdPath).then(doc => {
    const docTree = doc.tree();
    return {
      docTree
    };
  });
}
