# MLK Auto - refonte (local, non déployée)

Aperçu : `npx serve -l 4960 mlkauto` depuis `C:\Users\Reda\Code` (entrée `mlkauto` dans `.claude/launch.json`). Liens racine-relatifs : toujours servir depuis la racine du dossier `mlkauto`.

## Socle partagé
- CSS : `tokens.css` > `base.css` > `site.css` (composants documentés en tête de bloc).
- JS : `assets/js/app.js` (`<script src="/assets/js/app.js" defer>`), `gallery.js`, `contact.js`, `film-solaire/simulateur/simulateur.js`.
- Partials à copier tels quels : `_partials/header.html`, `_partials/footer.html`. Ajouter `aria-current="page"` au lien actif.
- Logo réel du client (`assets/logo/mlk-auto-logo-bone.png` pour fond sombre, `mlk-auto-logo-black.png` pour fond clair / mode clair), extrait de `2022_06_logo.jpg` par seuillage de luminance. Favicon et apple-touch : le « M » du logo (`favicon-32/16.png`, `apple-touch-icon.png`). Ancien logo dessiné et ancien favicon archivés dans `assets/logo/_alt/` (non référencés). Le logo est tel quel peu lisible à moins de ~100 px de large : un vrai SVG vectoriel serait préférable (à demander au client).
- Images : toutes les images utilisées sont en WebP (max 1920 px hero / 1440 px galerie / 1600 px stock). Originaux dans `assets/img/_originals/` (non référencés ; `exclus/` = fichier AdobeStock Editorial_Use_Only, à ne jamais utiliser). SEO : `robots.txt`, `sitemap.xml` (mentions légales exclues et `noindex`), canonical + OG + JSON-LD `AutoRepair` (accueil et contact).
- Captures de référence : `_review/` (accueil desktop et mobile, total covering).

## Checklist finale « à compléter »
- [ ] Domaine : canonical, `og:url`, `og:image`, JSON-LD, `robots.txt` et `sitemap.xml` utilisent `https://www.mlkauto.fr` comme PLACEHOLDER. À remplacer par le domaine réel au déploiement.
- [ ] Nettoyage manuel : les anciennes copies JPG des images optimisées sont encore présentes dans `assets/img/site/` et `assets/img/insta/` (suppression refusée par l'environnement ; elles ne sont plus référencées et existent dans `_originals/`). Dont `2023_05_5N4A2913-scaled.jpg` (hero, adresse de concessionnaire visible) : à supprimer avant mise en ligne. Les JPG/JPEG non utilisés (stock, ppf-35-2/3/4, ppf-45, car-dealer-05, IMG_1016, 3DD2BF01, ig_*, emb_* non flou) peuvent partir aussi.
- [ ] Chiffres clés : relevés sur mlkauto.fr le 2026-10-10 : « 13 années d'expérience », « 310 avis Google », « +2000 clients satisfaits ». « 13 ans » contredit « depuis 2011 » (≈ 15 ans) : le compteur d'ancienneté est remplacé par « 2011 » ; confirmer avec le client. Valider 310 et +2000 (valeurs du site actuel, probablement périmées).
- [ ] « Plus de 98 % de clients satisfaits » : repris du brief, à confirmer.
- [ ] UV : le site actuel affiche « jusqu'à 99 % » dans ses textes et 99,5 dans les données du simulateur. Le simulateur affiche désormais 99 (arrondi bas de la donnée source 99,5) pour rester cohérent. À trancher avec le client.
- [ ] Légendes des réalisations : déduites de la vue des photos (aucune légende Instagram disponible). Faire valider modèles/finitions par le client.
- [ ] Photos manquantes : aucune photo propre pour film solaire, DynoTop, polissage, formations. Les cartes Film solaire et Pare-brise utilisent des photos AdobeStock d'illustration (commentées dans le HTML) ; à remplacer par des photos de l'atelier. Le hero du simulateur n'utilise plus le visuel catalogue (illisible sous le titre).
- [ ] Hero desktop (Audi R8) : l'adresse de concessionnaire sous la plaque est masquée (aplat noir calé sur le cadre de plaque) dans la version WebP. Hero mobile : cabriolet rouge IMG_1860. Un seul `alt` générique pour les deux photos (limite de `<picture>`).
- [ ] Plaques : floutées dans la galerie (emb_04, 09, 11, 15 : les fichiers `-flou` d'origine ne l'étaient pas, flou appliqué en QA ; emb_12 l'était déjà). Autres photos à plaque lisible non utilisées sur le site : IMG_1016, 3DD2BF01 (à flouter si utilisées un jour).
- [ ] Formulaire de contact : non branché (validation seule, aucune donnée envoyée). Brancher Web3Forms/Formspree ou retirer le formulaire.
- [ ] RDV : l'embed Calendly (`calendly.com/mlkauto`) affiche son propre bandeau cookies et des prix saisis côté Calendly ; à vérifier avec le client.
- [ ] Lien « avis Google » : aucun lien propre trouvé ; ajouter l'URL de la fiche Google Business.
- [ ] Facebook : `facebook.com/mlkautoVitreTeintee` déduit du brief, à vérifier. Bio Instagram (certifications) tronquée : ne rien afficher tant que non vérifié.
- [ ] Mentions légales : SIRET/raison sociale/forme juridique/directeur de publication/hébergeur à fournir par le client (champs « à compléter » visibles, page `noindex` tant qu'incomplète).
- [ ] Pas de lightbox ni de filtre sur la galerie d'accueil (prévu par DA.md section 7.5, non demandé dans ce lot).
- [ ] JSON-LD : type `AutoRepair`, uniquement adresse, tél., e-mail, horaires, année de création et réseaux. Pas de `priceRange`, pas d'`aggregateRating` (à ajouter seulement avec une source vérifiée).

## Maquette de démarchage (noindex)
Ce site est une maquette de démarchage, pas le site officiel de MLK Auto : `noindex,nofollow` sur toutes les pages, `robots.txt` en `Disallow: /`, en-tête `X-Robots-Tag` (vercel.json), pas de canonical / og:url / og:image absolu / JSON-LD / sitemap.xml pointant vers mlkauto.fr. **À inverser le jour où le site devient officiel** (retirer ces protections, remettre canonical, og:*, JSON-LD, sitemap avec le vrai domaine).
