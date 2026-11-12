/* Sicherheit: die einzige Stelle für HTML-Escaping.
   Jeder Text aus Eingaben oder aus dem Speicher muss hier durch, bevor er per innerHTML in die Seite kommt. */
window.GWSec = Object.freeze({
  esc: s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
});
