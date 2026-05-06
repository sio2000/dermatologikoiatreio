# Advanced Derma Athens — frontend

Rebuild of the clinic landing page from `../HTML_WEBSITE.txt` using **React 19**, **TypeScript**, **Vite 8**, **Three.js**, and **GSAP** (ScrollTrigger). Ελληνικά UI, όχι backend — η υποβολή ραντεβού είναι επίδειξη διεπαφής μόνο (θα συνδεθεί με Supabase όταν είναι έτοιμο).

## Απαιτήσεις

- Node.js 20+ συνιστάται

## Τοπική εκτέλεση

```bash
cd web
npm install
npm run dev
```

Ανοίξτε τη διεύθυνση που εκτυπώνει το Vite (συνήθως http://localhost:5173/).

## Παραγωγή / προεπισκόπιση build

```bash
npm run build
npm run preview
```

## Πού ορίζονται οι φωτογραφίες

Αρχείο **`src/constants/images.ts`**: σύνδεσμοι Unsplash για πορτρέτο επίδειξης, φόντο φιλοσοφίας, συγκρίσεις «πριν/μετά» και γκαλερί 6 fotos. Οι επίσημες φωτογραφίες κλινικής της Δρ. Ζήσιμου μπορούν να υποκαταστήσουν τις τιμές που σχετίζονται με επαγγελματικά stock.

Αν το Google Maps embed δεν εμφανίζεται ανά πρόγραμμα περιήγησης ή περιφέρεια, αντικαταστήστε τις τιμές `images.maps.*` σε embed ή static map της επιλογής σας.

## Δομή

- `src/components/` — Navbar, Hero, Μετάδοση επαναλαμβανόμενων ενοτήτων, κλπ.
- `src/three/skinScenes.ts` — διαδραστικά WebGL που αντιστοιχούν στο αρχικό HTML
- `src/styles/globals.css` — tokens χρωμάτων και διάταξη που μεταφέρθηκε από την αρχική σελίδα (+ δέσιμο για mobile menu και εικόνες)
