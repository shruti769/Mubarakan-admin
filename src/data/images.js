// Photo library. Keys map to Unsplash ids; `img` crops to a box, `face` crops around a face.
const IMG = {
  brideRed: 'u:1610173827043-9db50e0d8ef9', baraat: 'u:1587271636175-90d58cdad458', bangles: 'u:1621801306185-8c0ccf9c8eb8', brideWhite: 'u:1630526720753-aa4e71acf67d',
  couplePose: 'u:1722952934708-749c22eb2e58', groomSehra: 'u:1597157639073-69284dc0fdaf', decorCeiling: 'u:1587271407850-8d438ca9fdf2', ringHands: 'u:1542042161784-26ab9e041e89',
  brideFloral: 'u:1587271315307-eaebc181c749', coupleTrad: 'u:1665960213508-48f07086d49c', canopy: 'u:1727430256509-0f897d6f4765', couplePath: 'u:1735052712464-9d24b69be5f5',
  sariRed: 'u:1599462616558-2b75fd26a283', sariGreen: 'u:1611106211090-8f3c79eb8552', coupleWalk: 'u:1735052712489-f45220126a0c', pinkDress: 'u:1583878545126-2f1ca0142714',
  couplePair: 'u:1633104502699-b2ecf0fee294', couplePose2: 'u:1722952934661-dde241aeb591', sariSmile: 'f:1551854716-8b811be39e7e',
  mehndiHands: 'p:1682092632793-c7d75b23718e', ceremony: 'p:1682092597591-81f59c80d9ec', handsGold: 'p:1682092637891-d9979cc93f6e', couplePlus: 'p:1711132425055-1c289c69b950',
  seatedBride: 'p:1724762182780-000d248f9301', redGoldOutfit: 'p:1724762183683-251ce8b09d08', celebration: 'p:1682090867765-39d1790259c5',
  coupleCouch: 'u:1640953148126-1962ec17a92b', ritualObject: 'u:1601121868898-4581104b29de', handsClose: 'u:1654156577076-e0350ba86cc1', havanFire: 'u:1630764883473-e8c2056f0589',
  roseBouquet: 'u:1587271339318-2e78fdf79586', couplePose3: 'u:1665960213530-3fb10da1f25e', mehndiHandsTwo: 'u:1505932794465-147d1f1b2c97', haldiYellow: 'u:1647949940712-bfcf82015d9b',
  turbanMirror: 'u:1735052709798-2abcc8c0d6e1', pinkLehenga: 'u:1733937140732-2cc70a1d7017', yellowRedBridal: 'u:1733937108021-d5db469f2216', bridalClutch: 'u:1661885411165-a08c34f40488',
  beadsClose: 'u:1641755322620-b99e9132fceb', purpleDress: 'u:1733937110329-7bfb323fc567', flowerArrangement: 'u:1520859209837-7ad58274de6b', redDressPortrait: 'u:1661877574666-c6574f69fa9d',
  mehndiArm: 'u:1554787388-9194e4eb57a3', twoWomen: 'u:1661877867818-6a5565b0170d', flowerGroup: 'p:1670524465634-93cf255ffa8b', diyaGirl: 'p:1682090811844-e0a89fb2c780',
}

// Photos without a face, cropped by entropy instead of faces.
const WIDE = ['bangles', 'ringHands', 'handsGold', 'mehndiHands', 'mehndiHandsTwo', 'mehndiArm', 'beadsClose', 'handsClose', 'flowerArrangement', 'roseBouquet', 'decorCeiling', 'canopy', 'havanFire', 'ritualObject', 'bridalClutch']

function base(k) {
  const v = IMG[k]
  if (!v) return ''
  const t = v.slice(0, 2), id = v.slice(2)
  if (t === 'u:') return 'https://images.unsplash.com/photo-' + id
  if (t === 'f:') return 'https://images.unsplash.com/flagged/photo-' + id
  return 'https://plus.unsplash.com/premium_photo-' + id
}

export function img(k, w, h) {
  if (!IMG[k]) return ''
  return base(k) + '?auto=format&fit=crop&crop=' + (WIDE.includes(k) ? 'entropy' : 'faces,entropy') + '&w=' + w + '&h=' + h + '&q=70'
}

export function face(k, s) {
  if (!IMG[k]) return ''
  return base(k) + '?auto=format&fit=facearea&facepad=3.2&w=' + s + '&h=' + s + '&q=70'
}
