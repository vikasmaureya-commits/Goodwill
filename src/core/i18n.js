/* ============ SPRACHE / LANGUAGE ============ */
var LANG = 'de';
const L = (de, en) => LANG === 'en' ? en : de;

/* Englische Artikeldaten: Name, Suchwörter (für Spracheingabe), Einheit, Frage */
const EN_ITEMS = {
  milch:{name:'Milk', syn:['milk'], unit:'litre', q:'How much milk would you like?'},
  brot:{name:'Bread', syn:['bread','loaf','loaves'], noun:['loaf','loaves'], unit:'loaf', q:'How many loaves of bread would you like?'},
  aepfel:{name:'Apples', syn:['apple','apples'], unit:'kg', q:'How many apples would you like?'},
  broetchen:{name:'Bread rolls', syn:['breadrolls','buns','bun'], noun:['roll','rolls'], unit:'piece', q:'How many bread rolls would you like?'},
  eier:{name:'Eggs', syn:['egg','eggs'], noun:['egg','eggs'], unit:'piece', q:'How many eggs would you like?'},
  kaese:{name:'Cheese', syn:['cheese','gouda','cheddar'], unit:'grams', q:'How much cheese would you like?'},
  wurst:{name:'Cold cuts', syn:['coldcuts','sausage','sausages','ham','salami'], unit:'grams', q:'How much cold cuts would you like?'},
  butter:{name:'Butter', syn:['butter'], unit:'grams', q:'How much butter would you like?'},
  joghurt:{name:'Yoghurt', syn:['yoghurt','yogurt','yoghurts','yogurts'], noun:['pot','pots'], unit:'pot', q:'How many pots of yoghurt would you like?'},
  kartoffeln:{name:'Potatoes', syn:['potato','potatoes'], unit:'kg', q:'How many potatoes would you like?'},
  gemuese:{name:'Vegetables', syn:['vegetable','vegetables','veg','carrot','carrots'], unit:'kg', q:'How many vegetables would you like?'},
  bananen:{name:'Bananas', syn:['banana','bananas'], noun:['banana','bananas'], unit:'piece', q:'How many bananas would you like?'},
  nudeln:{name:'Pasta', syn:['pasta','noodles','noodle','spaghetti'], unit:'grams', q:'How much pasta would you like?'},
  reis:{name:'Rice', syn:['rice'], unit:'grams', q:'How much rice would you like?'},
  zucker:{name:'Sugar', syn:['sugar'], unit:'grams', q:'How much sugar would you like?'},
  kaffee:{name:'Coffee', syn:['coffee'], unit:'grams', q:'How much coffee would you like?'},
  tee:{name:'Tea', syn:['tea'], noun:['pack','packs'], unit:'pack', q:'How many packs of tea would you like?'},
  saft:{name:'Juice', syn:['juice'], unit:'litre', q:'How much juice would you like?'},
  wasser:{name:'Water', syn:['water'], noun:['bottle','bottles'], unit:'bottle', q:'How many bottles of water would you like?'},
  schmerz:{name:'Painkillers', syn:['painkillers','painkiller','ibuprofen','paracetamol','aspirin','headache'], noun:['pack','packs'], unit:'pack', q:'How many packs of painkillers would you like?'},
  pflaster:{name:'Plasters', syn:['plaster','plasters','bandaid','bandaids'], noun:['pack','packs'], unit:'pack', q:'How many packs of plasters would you like?'},
  hustensaft:{name:'Cough syrup', syn:['coughsyrup'], noun:['bottle','bottles'], unit:'bottle', q:'How many bottles of cough syrup would you like?'},
  halsbonbons:{name:'Throat lozenges', syn:['lozenges','lozenge','coughdrops'], noun:['pack','packs'], unit:'pack', q:'How many packs of throat lozenges would you like?'},
  vitamine:{name:'Vitamins', syn:['vitamin','vitamins'], noun:['pack','packs'], unit:'pack', q:'How many packs of vitamins would you like?'},
  klopapier:{name:'Toilet paper', syn:['toiletpaper'], noun:['pack','packs'], unit:'pack', q:'How many packs of toilet paper would you like?'},
  spuelmittel:{name:'Dish soap', syn:['dishsoap'], noun:['bottle','bottles'], unit:'bottle', q:'How many bottles of dish soap would you like?'},
  waschmittel:{name:'Laundry detergent', syn:['detergent','laundry','washingpowder'], noun:['pack','packs'], unit:'pack', q:'How many packs of laundry detergent would you like?'},
  kuechenrolle:{name:'Kitchen roll', syn:['kitchenroll'], noun:['pack','packs'], unit:'pack', q:'How many packs of kitchen roll would you like?'},
  muellbeutel:{name:'Bin bags', syn:['binbags','binbag'], noun:['roll','rolls'], unit:'roll', q:'How many rolls of bin bags would you like?'},
  gluehbirne:{name:'Light bulbs', syn:['lightbulb','lightbulbs','bulb','bulbs'], noun:['bulb','bulbs'], unit:'piece', q:'How many light bulbs would you like?'},
  seife:{name:'Soap', syn:['soap'], noun:['bar','bars'], unit:'bar', q:'How many bars of soap would you like?'},
  batterien:{name:'Batteries', syn:['battery','batteries'], noun:['pack','packs'], unit:'pack', q:'How many packs of batteries would you like?'},
  briefmarken:{name:'Stamps', syn:['stamp','stamps'], noun:['stamp','stamps'], unit:'piece', q:'How many stamps would you like?'},
  zeitung:{name:'Newspaper', syn:['newspaper','newspapers'], noun:['copy','copies'], unit:'copy', q:'How many newspapers would you like?'}
};
const CATS_EN = {all:'All', food:'Groceries', med:'Medicine', home:'Household', other:'Other'};
const FREQ = {w1:['jede Woche','every week'], w2:['alle 2 Wochen','every 2 weeks'], m1:['jeden Monat','every month']};
const freqLabel = k => k ? FREQ[k][LANG==='en'?1:0] : '';

/* Mehrwort-Ausdrücke vereinheitlichen (nur Englisch, für die Spracheingabe) */
const EN_PHRASES = [
  [/bread rolls?/g,'breadrolls'],[/cold cuts?/g,'coldcuts'],[/toilet (paper|roll)s?|loo rolls?/g,'toiletpaper'],
  [/kitchen (roll|paper|towel)s?|paper towels?/g,'kitchenroll'],[/bin bags?|trash bags?|garbage bags?|rubbish bags?/g,'binbags'],
  [/light bulbs?/g,'lightbulb'],[/dish ?(washing )?soap|washing[- ]up liquid|dishwashing liquid/g,'dishsoap'],
  [/washing powder|laundry detergent|laundry powder/g,'detergent'],[/pain ?killers?|pain relief( tablets)?|headache tablets/g,'painkillers'],
  [/band[- ]?aids?/g,'bandaids'],[/cough syrup|cough medicine/g,'coughsyrup'],[/throat lozenges?|cough drops?/g,'lozenges'],
  [/(orange|apple) juice/g,'juice'],[/ice cream/g,'icecream']
];
const EN_U={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const EN_T={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
const UNIT_EN = {
  gram:['mass',1],grams:['mass',1],gr:['mass',1],g:['mass',1],kilo:['mass',1000],kilos:['mass',1000],kilogram:['mass',1000],kilograms:['mass',1000],kg:['mass',1000],pound:['mass',500],pounds:['mass',500],lb:['mass',500],lbs:['mass',500],
  litre:['vol',1],litres:['vol',1],liter:['vol',1],liters:['vol',1],l:['vol',1],milliliter:['vol',0.001],milliliters:['vol',0.001],millilitre:['vol',0.001],millilitres:['vol',0.001],ml:['vol',0.001],
  piece:['count',1],pieces:['count',1],pcs:['count',1],pack:['count',1],packs:['count',1],packet:['count',1],packets:['count',1],package:['count',1],packages:['count',1],
  bottle:['count',1],bottles:['count',1],roll:['count',1],rolls:['count',1],pot:['count',1],pots:['count',1],cup:['count',1],cups:['count',1],loaf:['count',1],loaves:['count',1],bar:['count',1],bars:['count',1],dozen:['count',12]
};
const HALF_EN = /^half$/;
function enTokens(tokens){
  /* Zahlwörter zusammenfassen: "twenty five" -> 25 */
  const out=[]; let i=0;
  while(i<tokens.length){
    const w=tokens[i];
    if(w in EN_U || w in EN_T || w==='hundred' || w==='thousand'){
      let total=0,cur=0,j=i;
      while(j<tokens.length){
        const x=tokens[j];
        if(x in EN_U) cur+=EN_U[x]; else if(x in EN_T) cur+=EN_T[x];
        else if(x==='hundred') cur=(cur||1)*100; else if(x==='thousand'){ total+=(cur||1)*1000; cur=0; } else break;
        j++;
      }
      out.push(String(total+cur)); i=j;
    } else { out.push(w); i++; }
  }
  /* "half a kilo" / "a half kilo" -> half kilo; "a kilo" -> 1 kilo */
  const o2=[];
  for(let k=0;k<out.length;k++){
    const w=out[k], nx=out[k+1];
    if((w==='a'||w==='an') && nx==='half') continue;
    if(w==='half' && (nx==='a'||nx==='an')){ o2.push('half'); k++; continue; }
    if((w==='a'||w==='an') && nx && (nx in UNIT_EN)){ o2.push('1'); continue; }
    o2.push(w);
  }
  return o2;
}

/* Übersetzungen für die feste Oberfläche (Deutsch -> Englisch) */
const DICT = {
 /* Start */
 'Gemeinsam für ein besseres Morgen.':'Together for a better tomorrow.','Ansicht':'View','Teilen Sie Ihre Geschichte':'Share your story','Ideen und gute Taten als Video – jetzt ansehen':'Ideas and acts of kindness on video – watch now',
 'Gefällt mir':'Like','Teilen':'Share','Abonnieren':'Subscribe','Video posten':'Post a video','Ton':'Sound','Ihr Video':'Your video','Gerade von Ihnen gepostet.':'Just posted by you.',
 'Hilfe im Alltag':'Everyday help','Tierschutz':'Animal welfare','Umwelt':'Environment','Ehrenamt':'Volunteering','Hilfe gesucht':'Help wanted','Rettung':'Rescue',
 'Ein Stück Weg gemeinsam – Hilfe, die ankommt.':'Part of the way together – help that arrives.',
 'Dieser Hund braucht ein Zuhause. Tierheime in Ihrer Nähe helfen.':'This dog needs a home. Shelters near you can help.',
 'Freiwillige räumen das Flussufer auf – jede Hand zählt.':'Volunteers clean up the riverbank – every hand counts.',
 'Ein Brot, ein Lächeln – so einfach kann Helfen sein.':'A loaf of bread, a smile – helping can be that simple.',
 'Manchmal fällt es schwer, um Hilfe zu bitten. Schauen Sie hin.':'Sometimes it is hard to ask for help. Take notice.',
 'Einsatzkräfte helfen, wenn jede Minute zählt.':'Emergency crews help when every minute counts.',
 'Im Tierheim warten viele Tiere auf einen Menschen wie Sie.':'Many shelter animals are waiting for someone like you.',
 'Ein sauberer Strand beginnt mit einem einzigen Müllsack.':'A clean beach starts with a single rubbish bag.',
 'Alltagshilfe von Menschen aus Ihrer Nachbarschaft – kostenlos.':'Everyday help from people in your neighbourhood – free of charge.',
 'Einmalige Hilfe':'One-time help','Schnelle Anfrage für das, was Sie brauchen':'A quick request for what you need',
 'Regelmäßige Unterstützung':'Regular support','Wiederkehrende Hilfe einrichten':'Set up recurring help',
 'Benachrichtigungen':'Notifications','Junge Menschen helfen Senioren beim Einkaufen':'Young people helping seniors with their shopping',
 /* Anfragen */
 'Meine Anfragen':'My requests','Hier sehen Sie, was gerade unterwegs ist.':'Here you can see what is on its way.',
 'Alle':'All','Aktiv':'Active','Regelmäßig':'Regular','Erledigt':'Done','Aktuell':'Current','Milch, Brot, Käse':'Milk, bread, cheese',
 'Unterwegs':'On the way','Gesucht':'Searching','Bestätigt':'Confirmed','Geliefert':'Delivered',
 'Ankunft ca. 10:05 Uhr':'Arrival approx. 10:05','· in etwa 15 Min.':'· in about 15 min.','Daniel · ~ 500 m entfernt':'Daniel · ~ 500 m away',
 'Helfer kontaktieren':'Contact helper','Details':'Details','Jede Woche · Dienstag':'Every week · Tuesday',
 'Äpfel 1 kg, Eier 10 Stück, Joghurt 4 Becher':'Apples 1 kg, eggs 10 pieces, yoghurt 4 pots',
 'Nächste Lieferung: Dienstag, 28. Oktober':'Next delivery: Tuesday, 28 October','Ändern':'Edit',
 'Abgeschlossen':'Completed','Butter, Kaffee':'Butter, coffee','Von Sophia geliefert.':'Delivered by Sophia.','Montag, 13. Oktober':'Monday, 13 October',
 'Nochmal bestellen':'Order again','Neue Anfrage':'New request',
 /* Bestellungen */
 'Bestellungen':'Orders','Bestellungen durchsuchen':'Search orders','Helfer':'Helpers','Anstehend':'Upcoming',
 'Der Service von Goodwill ist kostenlos – Sie zahlen keine Gebühr.':'Goodwill’s service is free – you pay no fees.',
 'Schnell bestellen':'Quick order','Lebensmittel':'Groceries','Medikamente':'Medicine','Haushalt':'Household','Sonstiges':'Other',
 'Milch':'Milk','Brot':'Bread','Äpfel':'Apples','Kaffee':'Coffee','1 Liter':'1 litre','1 Stück':'1 piece','Nochmal':'Again','Merken':'Save',
 'Milch nochmal bestellen':'Order milk again','Brot nochmal bestellen':'Order bread again','Äpfel nochmal bestellen':'Order apples again','Kaffee nochmal bestellen':'Order coffee again',
 'Frühere Bestellungen':'Past orders','Milch, Brot, Äpfel':'Milk, bread, apples','Schmerztabletten, Pflaster':'Painkillers, plasters','Eier, Kartoffeln, Gemüse':'Eggs, potatoes, vegetables',
 'Sa., 18. Okt. ·':'Sat, 18 Oct ·','Mo., 13. Okt. ·':'Mon, 13 Oct ·','Di., 7. Okt. ·':'Tue, 7 Oct ·','Fr., 3. Okt. ·':'Fri, 3 Oct ·','Zugestellt':'Delivered',
 'Keine Bestellungen gefunden.':'No orders found.','Sprache ändern':'Change language',
 /* Profil */
 'Ihr Konto':'Your account','Vertrauensperson hinzufügen':'Add a trusted person','Jetzt einrichten ›':'Set up now ›',
 'Schriftgröße':'Text size','Sprache':'Language','Meine Angaben':'My details','Meine Adresse':'My address',
 'Per Nachricht und Anruf':'By message and phone call','Meine Bestellungen':'My orders','Sicherheit':'Safety','Vertrauensperson':'Trusted person',
 'Angehörige(r) kann mitlesen – nur mit Ihrer Zustimmung':'A relative can follow along – only with your consent',
 'Geprüfte Helfer':'Verified helpers','So prüfen wir unsere Nachbarn':'How we vet our neighbours','Datenschutz':'Privacy','Wer sieht meine Adresse?':'Who can see my address?',
 'Hilfe':'Help','Hilfe & Kontakt':'Help & contact','Wir sind für Sie da':'We are here for you','Problem melden':'Report a problem','Konto löschen':'Delete account','Abmelden':'Log out',
 /* Anfrage erstellen */
 'Anfrage erstellen':'Create request','Hilfe kommt zu':'Help is coming to','Was brauchen Sie heute?':'What do you need today?',
 'Suchen Sie nach Artikeln, wählen Sie eine Kategorie – oder sagen Sie es einfach.':'Search for items, pick a category – or simply say it.',
 'Eigenen Artikel hinzufügen':'Add your own item','Hinzufügen':'Add','Hinweis für den Helfer':'Note for the helper',
 'Ersatz erlaubt, wenn ein Artikel nicht verfügbar ist':'Substitutes allowed if an item is unavailable','Weiter':'Next',
 'Artikel suchen …':'Search items …','Artikel suchen':'Search items','Bestellung sprechen':'Speak your order','Name des Artikels':'Item name',
 'z. B. Bitte an der Tür klingeln.':'e.g. Please ring the doorbell.','Zurück':'Back','Antwort sprechen':'Speak your answer','Hauptmenü':'Main menu',
 /* Gesendet / Helfer */
 'Anfrage gesendet!':'Request sent!','Wir haben Helfer in Ihrer Nähe informiert. Sie erhalten bald eine Nachricht.':'We have informed helpers near you. You will get a message soon.',
 'Kostenlos – Sie müssen nichts bezahlen.':'Free – you don’t have to pay anything.','Anfrage gesendet':'Request sent','Helfer ist unterwegs':'Helper is on the way',
 'Artikel werden gekauft':'Items are being bought','Bei Ihnen angekommen':'Arrived at your door','Weiter zur Umfrage':'Continue to the survey','Zur Startseite':'Back to home',
 'Helfer in der Nähe':'Helpers nearby','4 Helfer in der Nähe':'4 helpers nearby','Ihr Stamm-Helfer':'Your regular helper','Verfügbare Helfer':'Available helpers','Menschen aus Ihrer Nachbarschaft':'People from your neighbourhood',
 '✓ Geprüft':'✓ Verified','4,9 (28)':'4.9 (28)','4,8 (21)':'4.8 (21)','4,9 (35)':'4.9 (35)','~ 1,1 km':'~ 1.1 km',
 /* Tabs */
 'Zuhause · Otto-von-Guericke-Straße':'Home · Otto-von-Guericke-Straße','Kategorien':'Categories','Start':'Home','Anfragen':'Requests','Profil':'Profile'
};
