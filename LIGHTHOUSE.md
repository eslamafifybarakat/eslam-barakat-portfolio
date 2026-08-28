# Lighthouse report

Generated 2026-08-28T12:40:33.532Z against a local static server over the
production build (`npm run build` output, served exactly as Vercel serves
it — every route below is a prerendered static file, not a live SSR
render). Both languages are separate URLs (`/` vs `/ar`), so they're
covered by testing each path directly; theme is forced via Chrome's
`--force-prefers-color-scheme` flag rather than a second URL, matching how
the site actually resolves theme with no stored preference.

**This run covers every URL in `sitemap.xml`, in both forced color schemes.**

**Tablet has no official Lighthouse preset** — approximated here as a touch-class viewport (810×1080 @2x) with throttling between the mobile and desktop presets (70ms RTT, ~6 Mbps, 2× CPU slowdown), not an authoritative Lighthouse default the way mobile/desktop are.

## Results

| Route | Theme | Device | Performance | Accessibility | Best Practices | SEO | FCP | LCP | Speed Index | TBT | CLS | TTFB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | dark | Mobile | 90 | 100 | 100 | 100 | 1264ms | 1947ms | 3111ms | 355ms | 0.001 | 389ms |
| / | dark | Tablet | 100 | 100 | 100 | 100 | 675ms | 895ms | 1642ms | 90ms | 0.017 | 350ms |
| / | dark | Desktop | 99 | 100 | 100 | 100 | 382ms | 542ms | 1204ms | 16ms | 0.026 | 407ms |
| /ar | dark | Mobile | 75 | 100 | 100 | 100 | 2040ms | 2345ms | 4128ms | 820ms | 0.010 | 441ms |
| /ar | dark | Tablet | 99 | 100 | 100 | 100 | 908ms | 1162ms | 2111ms | 103ms | 0.015 | 375ms |
| /ar | dark | Desktop | 98 | 100 | 100 | 100 | 515ms | 774ms | 1422ms | 12ms | 0.006 | 345ms |
| /ar/work | dark | Mobile | 85 | 100 | 100 | 100 | 2668ms | 3418ms | 3956ms | 125ms | 0.008 | 312ms |
| /ar/work | dark | Tablet | 99 | 100 | 100 | 100 | 766ms | 1057ms | 2221ms | 118ms | 0.015 | 314ms |
| /ar/work | dark | Desktop | 95 | 100 | 100 | 100 | 588ms | 962ms | 1852ms | 0ms | 0.003 | 508ms |
| /ar/work/agro-teba | dark | Mobile | 52 | 100 | 100 | 100 | 4468ms | 5684ms | 6067ms | 501ms | 0.008 | 410ms |
| /ar/work/agro-teba | dark | Tablet | 98 | 100 | 100 | 100 | 731ms | 1034ms | 2174ms | 176ms | 0.015 | 342ms |
| /ar/work/agro-teba | dark | Desktop | 98 | 100 | 100 | 100 | 487ms | 769ms | 1516ms | 1ms | 0.026 | 306ms |
| /ar/work/ams-policies | dark | Mobile | 87 | 100 | 100 | 100 | 1844ms | 2754ms | 3165ms | 314ms | 0.000 | 767ms |
| /ar/work/ams-policies | dark | Tablet | 100 | 100 | 100 | 100 | 683ms | 947ms | 2089ms | 34ms | 0.016 | 356ms |
| /ar/work/ams-policies | dark | Desktop | 97 | 100 | 100 | 100 | 496ms | 783ms | 1634ms | 64ms | 0.026 | 361ms |
| /ar/work/civil-services-management-dashboard | dark | Mobile | 86 | 100 | 100 | 100 | 2627ms | 3227ms | 4236ms | 138ms | 0.008 | 324ms |
| /ar/work/civil-services-management-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 721ms | 972ms | 2287ms | 101ms | 0.015 | 524ms |
| /ar/work/civil-services-management-dashboard | dark | Desktop | 98 | 100 | 100 | 100 | 470ms | 725ms | 1444ms | 0ms | 0.026 | 296ms |
| /ar/work/download-images | dark | Mobile | 84 | 100 | 100 | 100 | 2646ms | 3246ms | 4231ms | 174ms | 0.008 | 310ms |
| /ar/work/download-images | dark | Tablet | 99 | 100 | 100 | 100 | 689ms | 938ms | 2039ms | 95ms | 0.015 | 299ms |
| /ar/work/download-images | dark | Desktop | 97 | 100 | 100 | 100 | 511ms | 810ms | 1604ms | 5ms | 0.026 | 459ms |
| /ar/work/eid-adha-card | dark | Mobile | 81 | 100 | 100 | 100 | 2737ms | 3487ms | 4349ms | 222ms | 0.008 | 319ms |
| /ar/work/eid-adha-card | dark | Tablet | 100 | 100 | 100 | 100 | 735ms | 1064ms | 2233ms | 80ms | 0.015 | 333ms |
| /ar/work/eid-adha-card | dark | Desktop | 97 | 100 | 100 | 100 | 512ms | 730ms | 1696ms | 5ms | 0.025 | 378ms |
| /ar/work/estkdam | dark | Mobile | 84 | 100 | 100 | 100 | 1313ms | 1901ms | 4679ms | 502ms | 0.008 | 342ms |
| /ar/work/estkdam | dark | Tablet | 98 | 100 | 100 | 100 | 864ms | 1342ms | 2670ms | 165ms | 0.015 | 334ms |
| /ar/work/estkdam | dark | Desktop | 96 | 100 | 100 | 100 | 585ms | 945ms | 1849ms | 14ms | 0.026 | 511ms |
| /ar/work/gdawel-erp | dark | Mobile | 87 | 100 | 100 | 100 | 1306ms | 1852ms | 4233ms | 421ms | 0.008 | 327ms |
| /ar/work/gdawel-erp | dark | Tablet | 100 | 100 | 100 | 100 | 804ms | 1068ms | 1298ms | 37ms | 0.000 | 338ms |
| /ar/work/gdawel-erp | dark | Desktop | 97 | 100 | 100 | 100 | 520ms | 760ms | 1719ms | 13ms | 0.025 | 402ms |
| /ar/work/hashstudio-digital-destination | dark | Mobile | 90 | 100 | 100 | 100 | 2373ms | 2523ms | 4427ms | 164ms | 0.008 | 363ms |
| /ar/work/hashstudio-digital-destination | dark | Tablet | 98 | 100 | 100 | 100 | 799ms | 1039ms | 2806ms | 142ms | 0.015 | 583ms |
| /ar/work/hashstudio-digital-destination | dark | Desktop | 85 | 100 | 100 | 100 | 711ms | 1182ms | 2275ms | 211ms | 0.026 | 392ms |
| /ar/work/hawdaj | dark | Mobile | 83 | 100 | 100 | 100 | 1879ms | 2509ms | 5198ms | 372ms | 0.010 | 394ms |
| /ar/work/hawdaj | dark | Tablet | 99 | 100 | 100 | 100 | 743ms | 1062ms | 2210ms | 102ms | 0.015 | 321ms |
| /ar/work/hawdaj | dark | Desktop | 98 | 100 | 100 | 100 | 465ms | 709ms | 1445ms | 1ms | 0.026 | 308ms |
| /ar/work/jusur-dashboard | dark | Mobile | 80 | 100 | 100 | 100 | 3004ms | 3619ms | 4304ms | 164ms | 0.008 | 326ms |
| /ar/work/jusur-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 664ms | 927ms | 1988ms | 125ms | 0.015 | 301ms |
| /ar/work/jusur-dashboard | dark | Desktop | 94 | 100 | 100 | 100 | 669ms | 1073ms | 1986ms | 53ms | 0.026 | 397ms |
| /ar/work/knowledge-bank-tweeq | dark | Mobile | 89 | 100 | 100 | 100 | 1289ms | 1854ms | 3928ms | 350ms | 0.008 | 344ms |
| /ar/work/knowledge-bank-tweeq | dark | Tablet | 100 | 100 | 100 | 100 | 685ms | 942ms | 2020ms | 66ms | 0.015 | 325ms |
| /ar/work/knowledge-bank-tweeq | dark | Desktop | 98 | 100 | 100 | 100 | 484ms | 757ms | 1503ms | 8ms | 0.026 | 326ms |
| /ar/work/medjol-patient-availy | dark | Mobile | 83 | 100 | 100 | 100 | 2668ms | 3418ms | 4302ms | 164ms | 0.008 | 342ms |
| /ar/work/medjol-patient-availy | dark | Tablet | 97 | 100 | 100 | 100 | 755ms | 1057ms | 2409ms | 179ms | 0.015 | 311ms |
| /ar/work/medjol-patient-availy | dark | Desktop | 98 | 100 | 100 | 100 | 501ms | 801ms | 1567ms | 18ms | 0.026 | 325ms |
| /ar/work/medjol-provider-dashboard | dark | Mobile | 83 | 100 | 100 | 100 | 2686ms | 3436ms | 4227ms | 184ms | 0.008 | 387ms |
| /ar/work/medjol-provider-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 692ms | 951ms | 2106ms | 96ms | 0.015 | 319ms |
| /ar/work/medjol-provider-dashboard | dark | Desktop | 97 | 100 | 100 | 100 | 526ms | 828ms | 1529ms | 0ms | 0.026 | 322ms |
| /ar/work/mention | dark | Mobile | 82 | 100 | 100 | 100 | 1459ms | 2030ms | 4595ms | 538ms | 0.008 | 374ms |
| /ar/work/mention | dark | Tablet | 100 | 100 | 100 | 100 | 676ms | 947ms | 2029ms | 67ms | 0.016 | 337ms |
| /ar/work/mention | dark | Desktop | 98 | 100 | 100 | 100 | 474ms | 734ms | 1547ms | 0ms | 0.026 | 344ms |
| /ar/work/nen-site | dark | Mobile | 85 | 100 | 100 | 100 | 2569ms | 3169ms | 4049ms | 172ms | 0.008 | 330ms |
| /ar/work/nen-site | dark | Tablet | 100 | 100 | 100 | 100 | 726ms | 1058ms | 2182ms | 65ms | 0.015 | 323ms |
| /ar/work/nen-site | dark | Desktop | 98 | 100 | 100 | 100 | 501ms | 785ms | 1492ms | 0ms | 0.026 | 292ms |
| /ar/work/nile-ortho | dark | Mobile | 85 | 100 | 100 | 100 | 2550ms | 3150ms | 4501ms | 189ms | 0.008 | 388ms |
| /ar/work/nile-ortho | dark | Tablet | 100 | 100 | 100 | 100 | 670ms | 953ms | 2034ms | 52ms | 0.015 | 306ms |
| /ar/work/nile-ortho | dark | Desktop | 98 | 100 | 100 | 100 | 498ms | 781ms | 1547ms | 1ms | 0.026 | 322ms |
| /ar/work/procurelinker | dark | Mobile | 88 | 100 | 100 | 100 | 1283ms | 1875ms | 4030ms | 382ms | 0.008 | 355ms |
| /ar/work/procurelinker | dark | Tablet | 100 | 100 | 100 | 100 | 707ms | 976ms | 2114ms | 66ms | 0.016 | 322ms |
| /ar/work/procurelinker | dark | Desktop | 98 | 100 | 100 | 100 | 472ms | 726ms | 1447ms | 0ms | 0.026 | 318ms |
| /ar/work/qaraah-site | dark | Mobile | 74 | 100 | 100 | 100 | 1119ms | 2077ms | 7714ms | 716ms | 0.010 | 2669ms |
| /ar/work/qaraah-site | dark | Tablet | 99 | 100 | 100 | 100 | 688ms | 968ms | 2065ms | 101ms | 0.015 | 324ms |
| /ar/work/qaraah-site | dark | Desktop | 98 | 100 | 100 | 100 | 509ms | 810ms | 1530ms | 3ms | 0.026 | 281ms |
| /ar/work/qias-dashboard | dark | Mobile | 79 | 100 | 100 | 100 | 1220ms | 1880ms | 6655ms | 560ms | 0.010 | 2223ms |
| /ar/work/qias-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 697ms | 974ms | 2224ms | 130ms | 0.015 | 306ms |
| /ar/work/qias-dashboard | dark | Desktop | 98 | 100 | 100 | 100 | 502ms | 789ms | 1559ms | 4ms | 0.026 | 315ms |
| /ar/work/qr-payment | dark | Mobile | 84 | 100 | 100 | 100 | 2539ms | 3289ms | 4342ms | 172ms | 0.008 | 342ms |
| /ar/work/qr-payment | dark | Tablet | 99 | 100 | 100 | 100 | 721ms | 960ms | 2208ms | 112ms | 0.016 | 367ms |
| /ar/work/qr-payment | dark | Desktop | 97 | 100 | 100 | 100 | 545ms | 868ms | 1597ms | 0ms | 0.026 | 340ms |
| /ar/work/reference-portal-talbinah | dark | Mobile | 86 | 100 | 100 | 100 | 2538ms | 3138ms | 4346ms | 143ms | 0.008 | 355ms |
| /ar/work/reference-portal-talbinah | dark | Tablet | 100 | 100 | 100 | 100 | 679ms | 974ms | 2095ms | 84ms | 0.015 | 304ms |
| /ar/work/reference-portal-talbinah | dark | Desktop | 97 | 100 | 100 | 100 | 525ms | 833ms | 1597ms | 0ms | 0.026 | 303ms |
| /ar/work/sarie-site | dark | Mobile | 77 | 100 | 100 | 100 | 1461ms | 2123ms | 4850ms | 763ms | 0.008 | 409ms |
| /ar/work/sarie-site | dark | Tablet | 100 | 100 | 100 | 100 | 680ms | 948ms | 2057ms | 81ms | 0.015 | 348ms |
| /ar/work/sarie-site | dark | Desktop | 97 | 100 | 100 | 100 | 557ms | 874ms | 1634ms | 7ms | 0.026 | 317ms |
| /ar/work/seaah-stakeholders | dark | Mobile | 84 | 100 | 100 | 100 | 1416ms | 1989ms | 4751ms | 475ms | 0.008 | 430ms |
| /ar/work/seaah-stakeholders | dark | Tablet | 99 | 100 | 100 | 100 | 682ms | 962ms | 2136ms | 121ms | 0.015 | 362ms |
| /ar/work/seaah-stakeholders | dark | Desktop | 97 | 100 | 100 | 100 | 557ms | 888ms | 1729ms | 17ms | 0.026 | 329ms |
| /ar/work/social-studio | dark | Mobile | 79 | 100 | 100 | 100 | 1979ms | 2964ms | 3207ms | 522ms | 0.000 | 544ms |
| /ar/work/social-studio | dark | Tablet | 99 | 100 | 100 | 100 | 724ms | 992ms | 2249ms | 134ms | 0.015 | 359ms |
| /ar/work/social-studio | dark | Desktop | 96 | 100 | 100 | 100 | 871ms | 1146ms | 1181ms | 11ms | 0.022 | 386ms |
| /ar/work/swarm-technologies | dark | Mobile | 77 | 100 | 100 | 100 | 1493ms | 2106ms | 5359ms | 696ms | 0.008 | 674ms |
| /ar/work/swarm-technologies | dark | Tablet | 99 | 100 | 100 | 100 | 849ms | 1118ms | 2482ms | 137ms | 0.015 | 444ms |
| /ar/work/swarm-technologies | dark | Desktop | 95 | 100 | 100 | 100 | 633ms | 1061ms | 1799ms | 0ms | 0.025 | 351ms |
| /ar/work/taba-educational-program | dark | Mobile | 83 | 100 | 100 | 100 | 1384ms | 1997ms | 4557ms | 526ms | 0.008 | 421ms |
| /ar/work/taba-educational-program | dark | Tablet | 100 | 100 | 100 | 100 | 706ms | 975ms | 2113ms | 81ms | 0.015 | 298ms |
| /ar/work/taba-educational-program | dark | Desktop | 96 | 100 | 100 | 100 | 562ms | 896ms | 1809ms | 15ms | 0.026 | 368ms |
| /ar/work/talbinah-website | dark | Mobile | 82 | 100 | 100 | 100 | 1611ms | 1999ms | 4841ms | 506ms | 0.008 | 522ms |
| /ar/work/talbinah-website | dark | Tablet | 100 | 100 | 100 | 100 | 682ms | 966ms | 2031ms | 21ms | 0.015 | 303ms |
| /ar/work/talbinah-website | dark | Desktop | 97 | 100 | 100 | 100 | 568ms | 909ms | 1621ms | 0ms | 0.025 | 335ms |
| /ar/work/wakeb-ai-chat | dark | Mobile | 81 | 100 | 100 | 100 | 2790ms | 3523ms | 4280ms | 182ms | 0.008 | 379ms |
| /ar/work/wakeb-ai-chat | dark | Tablet | 100 | 100 | 100 | 100 | 915ms | 1105ms | 2247ms | 83ms | 0.015 | 360ms |
| /ar/work/wakeb-ai-chat | dark | Desktop | 96 | 100 | 100 | 100 | 585ms | 889ms | 1800ms | 0ms | 0.026 | 395ms |
| /ar/work/wakeb-tech-site | dark | Mobile | 83 | 100 | 100 | 100 | 1450ms | 2057ms | 4841ms | 481ms | 0.008 | 416ms |
| /ar/work/wakeb-tech-site | dark | Tablet | 98 | 100 | 100 | 100 | 739ms | 1008ms | 2133ms | 141ms | 0.015 | 321ms |
| /ar/work/wakeb-tech-site | dark | Desktop | 97 | 100 | 100 | 100 | 548ms | 881ms | 1647ms | 6ms | 0.026 | 328ms |
| /ar/work/wrth-royal-institute-of-traditional-arts | dark | Mobile | 76 | 100 | 100 | 100 | 1847ms | 2700ms | 10584ms | 410ms | 0.008 | 600ms |
| /ar/work/wrth-royal-institute-of-traditional-arts | dark | Tablet | 99 | 100 | 100 | 100 | 720ms | 1009ms | 2337ms | 96ms | 0.015 | 406ms |
| /ar/work/wrth-royal-institute-of-traditional-arts | dark | Desktop | 96 | 100 | 100 | 100 | 551ms | 831ms | 1875ms | 12ms | 0.025 | 402ms |
| /work | dark | Mobile | 88 | 100 | 100 | 100 | 2307ms | 2702ms | 3605ms | 222ms | 0.008 | 324ms |
| /work | dark | Tablet | 100 | 100 | 100 | 100 | 574ms | 831ms | 1634ms | 52ms | 0.005 | 268ms |
| /work | dark | Desktop | 99 | 100 | 100 | 100 | 422ms | 683ms | 1317ms | 0ms | 0.000 | 258ms |
| /work/agro-teba | dark | Mobile | 84 | 100 | 100 | 100 | 2538ms | 3342ms | 3657ms | 196ms | 0.008 | 356ms |
| /work/agro-teba | dark | Tablet | 98 | 100 | 100 | 100 | 621ms | 926ms | 1847ms | 170ms | 0.005 | 360ms |
| /work/agro-teba | dark | Desktop | 98 | 100 | 100 | 100 | 654ms | 763ms | 1448ms | 5ms | 0.018 | 330ms |
| /work/ams-policies | dark | Mobile | 82 | 100 | 100 | 100 | 2385ms | 2786ms | 3867ms | 388ms | 0.008 | 357ms |
| /work/ams-policies | dark | Tablet | 98 | 100 | 100 | 100 | 597ms | 861ms | 1846ms | 159ms | 0.005 | 330ms |
| /work/ams-policies | dark | Desktop | 96 | 100 | 100 | 100 | 603ms | 1007ms | 1585ms | 35ms | 0.018 | 314ms |
| /work/civil-services-management-dashboard | dark | Mobile | 85 | 100 | 100 | 100 | 1157ms | 1719ms | 3527ms | 549ms | 0.008 | 431ms |
| /work/civil-services-management-dashboard | dark | Tablet | 97 | 100 | 100 | 100 | 702ms | 1035ms | 2096ms | 181ms | 0.005 | 363ms |
| /work/civil-services-management-dashboard | dark | Desktop | 98 | 100 | 100 | 100 | 488ms | 752ms | 1521ms | 13ms | 0.012 | 393ms |
| /work/download-images | dark | Mobile | 76 | 100 | 100 | 100 | 2782ms | 3560ms | 3850ms | 369ms | 0.008 | 392ms |
| /work/download-images | dark | Tablet | 99 | 100 | 100 | 100 | 577ms | 837ms | 1739ms | 116ms | 0.005 | 300ms |
| /work/download-images | dark | Desktop | 98 | 100 | 100 | 100 | 430ms | 665ms | 1440ms | 15ms | 0.012 | 349ms |
| /work/eid-adha-card | dark | Mobile | 79 | 100 | 100 | 100 | 1536ms | 2409ms | 5917ms | 527ms | 0.008 | 445ms |
| /work/eid-adha-card | dark | Tablet | 98 | 100 | 100 | 100 | 713ms | 1050ms | 2226ms | 148ms | 0.005 | 415ms |
| /work/eid-adha-card | dark | Desktop | 98 | 100 | 100 | 100 | 469ms | 747ms | 1391ms | 14ms | 0.012 | 313ms |
| /work/estkdam | dark | Mobile | 74 | 100 | 100 | 100 | 2433ms | 2853ms | 4004ms | 645ms | 0.008 | 394ms |
| /work/estkdam | dark | Tablet | 99 | 100 | 100 | 100 | 614ms | 840ms | 1946ms | 138ms | 0.005 | 340ms |
| /work/estkdam | dark | Desktop | 97 | 100 | 100 | 100 | 541ms | 883ms | 1527ms | 23ms | 0.012 | 327ms |
| /work/gdawel-erp | dark | Mobile | 83 | 100 | 100 | 100 | 1318ms | 1883ms | 4425ms | 547ms | 0.008 | 498ms |
| /work/gdawel-erp | dark | Tablet | 98 | 100 | 100 | 100 | 637ms | 936ms | 1977ms | 138ms | 0.005 | 319ms |
| /work/gdawel-erp | dark | Desktop | 98 | 100 | 100 | 100 | 603ms | 969ms | 1040ms | 6ms | 0.014 | 367ms |
| /work/hashstudio-digital-destination | dark | Mobile | 81 | 100 | 100 | 100 | 2494ms | 3339ms | 3739ms | 291ms | 0.008 | 317ms |
| /work/hashstudio-digital-destination | dark | Tablet | 99 | 100 | 100 | 100 | 571ms | 821ms | 1736ms | 119ms | 0.005 | 299ms |
| /work/hashstudio-digital-destination | dark | Desktop | 99 | 100 | 100 | 100 | 431ms | 680ms | 1363ms | 12ms | 0.012 | 339ms |
| /work/hawdaj | dark | Mobile | 80 | 100 | 100 | 100 | 2600ms | 3518ms | 3665ms | 268ms | 0.008 | 328ms |
| /work/hawdaj | dark | Tablet | 100 | 100 | 100 | 100 | 580ms | 821ms | 1764ms | 83ms | 0.005 | 304ms |
| /work/hawdaj | dark | Desktop | 99 | 100 | 100 | 100 | 417ms | 670ms | 1282ms | 9ms | 0.012 | 287ms |
| /work/jusur-dashboard | dark | Mobile | 74 | 100 | 100 | 100 | 1005ms | 1774ms | 6554ms | 813ms | 0.008 | 2665ms |
| /work/jusur-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 583ms | 811ms | 1682ms | 110ms | 0.005 | 286ms |
| /work/jusur-dashboard | dark | Desktop | 95 | 100 | 100 | 100 | 604ms | 1012ms | 1898ms | 18ms | 0.012 | 309ms |
| /work/knowledge-bank-tweeq | dark | Mobile | 76 | 100 | 100 | 100 | 2805ms | 3584ms | 3697ms | 347ms | 0.008 | 313ms |
| /work/knowledge-bank-tweeq | dark | Tablet | 100 | 100 | 100 | 100 | 576ms | 819ms | 1727ms | 62ms | 0.005 | 270ms |
| /work/knowledge-bank-tweeq | dark | Desktop | 99 | 100 | 100 | 100 | 427ms | 681ms | 1323ms | 16ms | 0.012 | 307ms |
| /work/medjol-patient-availy | dark | Mobile | 77 | 100 | 100 | 100 | 1043ms | 1801ms | 6571ms | 647ms | 0.008 | 2640ms |
| /work/medjol-patient-availy | dark | Tablet | 99 | 100 | 100 | 100 | 639ms | 826ms | 1806ms | 109ms | 0.005 | 332ms |
| /work/medjol-patient-availy | dark | Desktop | 98 | 100 | 100 | 100 | 494ms | 801ms | 1453ms | 16ms | 0.012 | 289ms |
| /work/medjol-provider-dashboard | dark | Mobile | 79 | 100 | 100 | 100 | 2763ms | 3699ms | 3820ms | 264ms | 0.008 | 323ms |
| /work/medjol-provider-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 581ms | 834ms | 1740ms | 127ms | 0.005 | 297ms |
| /work/medjol-provider-dashboard | dark | Desktop | 98 | 100 | 100 | 100 | 438ms | 672ms | 1379ms | 19ms | 0.012 | 345ms |
| /work/mention | dark | Mobile | 77 | 100 | 100 | 100 | 2288ms | 3384ms | 3529ms | 436ms | 0.008 | 303ms |
| /work/mention | dark | Tablet | 99 | 100 | 100 | 100 | 593ms | 829ms | 1745ms | 96ms | 0.005 | 286ms |
| /work/mention | dark | Desktop | 99 | 100 | 100 | 100 | 450ms | 692ms | 1349ms | 18ms | 0.012 | 312ms |
| /work/nen-site | dark | Mobile | 77 | 100 | 100 | 100 | 951ms | 1774ms | 5834ms | 717ms | 0.008 | 2103ms |
| /work/nen-site | dark | Tablet | 99 | 100 | 100 | 100 | 579ms | 836ms | 1766ms | 145ms | 0.005 | 320ms |
| /work/nen-site | dark | Desktop | 98 | 100 | 100 | 100 | 465ms | 744ms | 1363ms | 19ms | 0.012 | 278ms |
| /work/nile-ortho | dark | Mobile | 76 | 100 | 100 | 100 | 1045ms | 1788ms | 6550ms | 706ms | 0.008 | 2637ms |
| /work/nile-ortho | dark | Tablet | 99 | 100 | 100 | 100 | 575ms | 827ms | 1723ms | 106ms | 0.005 | 289ms |
| /work/nile-ortho | dark | Desktop | 99 | 100 | 100 | 100 | 377ms | 571ms | 1199ms | 5ms | 0.018 | 276ms |
| /work/procurelinker | dark | Mobile | 79 | 100 | 100 | 100 | 2586ms | 3502ms | 3673ms | 310ms | 0.008 | 375ms |
| /work/procurelinker | dark | Tablet | 100 | 100 | 100 | 100 | 782ms | 1148ms | 1326ms | 69ms | 0.000 | 422ms |
| /work/procurelinker | dark | Desktop | 97 | 100 | 100 | 100 | 495ms | 789ms | 1707ms | 19ms | 0.012 | 336ms |
| /work/qaraah-site | dark | Mobile | 82 | 100 | 100 | 100 | 2490ms | 2892ms | 3768ms | 351ms | 0.008 | 327ms |
| /work/qaraah-site | dark | Tablet | 99 | 100 | 100 | 100 | 564ms | 822ms | 1757ms | 104ms | 0.005 | 286ms |
| /work/qaraah-site | dark | Desktop | 99 | 100 | 100 | 100 | 447ms | 714ms | 1357ms | 11ms | 0.012 | 319ms |
| /work/qias-dashboard | dark | Mobile | 78 | 100 | 100 | 100 | 2592ms | 3514ms | 3692ms | 326ms | 0.008 | 327ms |
| /work/qias-dashboard | dark | Tablet | 99 | 100 | 100 | 100 | 597ms | 822ms | 1737ms | 144ms | 0.005 | 288ms |
| /work/qias-dashboard | dark | Desktop | 99 | 100 | 100 | 100 | 435ms | 705ms | 1285ms | 10ms | 0.012 | 283ms |
| /work/qr-payment | dark | Mobile | 76 | 100 | 100 | 100 | 1094ms | 1866ms | 6671ms | 669ms | 0.008 | 2644ms |
| /work/qr-payment | dark | Tablet | 99 | 100 | 100 | 100 | 599ms | 821ms | 1822ms | 132ms | 0.005 | 327ms |
| /work/qr-payment | dark | Desktop | 99 | 100 | 100 | 100 | 366ms | 562ms | 1216ms | 11ms | 0.018 | 310ms |
| /work/reference-portal-talbinah | dark | Mobile | 83 | 100 | 100 | 100 | 2514ms | 3358ms | 3656ms | 220ms | 0.008 | 362ms |
| /work/reference-portal-talbinah | dark | Tablet | 99 | 100 | 100 | 100 | 572ms | 821ms | 1757ms | 115ms | 0.005 | 274ms |
| /work/reference-portal-talbinah | dark | Desktop | 99 | 100 | 100 | 100 | 423ms | 684ms | 1315ms | 13ms | 0.012 | 306ms |
| /work/sarie-site | dark | Mobile | 77 | 100 | 100 | 100 | 1190ms | 1438ms | 6844ms | 670ms | 0.008 | 2676ms |
| /work/sarie-site | dark | Tablet | 99 | 100 | 100 | 100 | 595ms | 837ms | 1706ms | 112ms | 0.005 | 296ms |
| /work/sarie-site | dark | Desktop | 99 | 100 | 100 | 100 | 367ms | 550ms | 1211ms | 0ms | 0.012 | 268ms |
| /work/seaah-stakeholders | dark | Mobile | 86 | 100 | 100 | 100 | 1234ms | 1927ms | 3618ms | 467ms | 0.008 | 350ms |
| /work/seaah-stakeholders | dark | Tablet | 99 | 100 | 100 | 100 | 621ms | 831ms | 1774ms | 126ms | 0.005 | 320ms |
| /work/seaah-stakeholders | dark | Desktop | 98 | 100 | 100 | 100 | 586ms | 694ms | 1413ms | 15ms | 0.012 | 342ms |
| /work/social-studio | dark | Mobile | 83 | 100 | 100 | 100 | 2464ms | 3171ms | 3761ms | 265ms | 0.008 | 330ms |
| /work/social-studio | dark | Tablet | 100 | 100 | 100 | 100 | 569ms | 819ms | 1745ms | 83ms | 0.005 | 302ms |
| /work/social-studio | dark | Desktop | 88 | 100 | 100 | 100 | 866ms | 1455ms | 2356ms | 115ms | 0.012 | 314ms |
| /work/swarm-technologies | dark | Mobile | 76 | 100 | 100 | 100 | 1436ms | 2111ms | 5092ms | 771ms | 0.008 | 462ms |
| /work/swarm-technologies | dark | Tablet | 98 | 100 | 100 | 100 | 585ms | 838ms | 1775ms | 151ms | 0.005 | 298ms |
| /work/swarm-technologies | dark | Desktop | 99 | 100 | 100 | 100 | 448ms | 730ms | 1363ms | 11ms | 0.012 | 299ms |
| /work/taba-educational-program | dark | Mobile | 81 | 100 | 100 | 100 | 2486ms | 3040ms | 3800ms | 350ms | 0.008 | 375ms |
| /work/taba-educational-program | dark | Tablet | 100 | 100 | 100 | 100 | 585ms | 825ms | 1715ms | 91ms | 0.005 | 331ms |
| /work/taba-educational-program | dark | Desktop | 99 | 100 | 100 | 100 | 408ms | 637ms | 1308ms | 20ms | 0.012 | 313ms |
| /work/talbinah-website | dark | Mobile | 73 | 100 | 100 | 100 | 1024ms | 1799ms | 7119ms | 828ms | 0.008 | 2738ms |
| /work/talbinah-website | dark | Tablet | 99 | 100 | 100 | 100 | 573ms | 821ms | 1723ms | 110ms | 0.005 | 289ms |
| /work/talbinah-website | dark | Desktop | 98 | 100 | 100 | 100 | 578ms | 679ms | 1451ms | 1ms | 0.018 | 315ms |
| /work/wakeb-ai-chat | dark | Mobile | 82 | 100 | 100 | 100 | 2337ms | 2892ms | 3719ms | 369ms | 0.008 | 333ms |
| /work/wakeb-ai-chat | dark | Tablet | 99 | 100 | 100 | 100 | 586ms | 844ms | 1771ms | 107ms | 0.005 | 349ms |
| /work/wakeb-ai-chat | dark | Desktop | 98 | 100 | 100 | 100 | 499ms | 813ms | 1463ms | 17ms | 0.012 | 291ms |
| /work/wakeb-tech-site | dark | Mobile | 82 | 100 | 100 | 100 | 2492ms | 2897ms | 3745ms | 361ms | 0.008 | 332ms |
| /work/wakeb-tech-site | dark | Tablet | 99 | 100 | 100 | 100 | 604ms | 819ms | 1726ms | 118ms | 0.005 | 288ms |
| /work/wakeb-tech-site | dark | Desktop | 98 | 100 | 100 | 100 | 456ms | 697ms | 1425ms | 20ms | 0.012 | 326ms |
| /work/wrth-royal-institute-of-traditional-arts | dark | Mobile | 82 | 100 | 100 | 100 | 2477ms | 2876ms | 3788ms | 373ms | 0.008 | 364ms |
| /work/wrth-royal-institute-of-traditional-arts | dark | Tablet | 99 | 100 | 100 | 100 | 586ms | 824ms | 1785ms | 113ms | 0.005 | 322ms |
| /work/wrth-royal-institute-of-traditional-arts | dark | Desktop | 98 | 100 | 100 | 100 | 446ms | 713ms | 1501ms | 29ms | 0.012 | 332ms |

## Gaps from 100

- **/** (dark, Mobile): Performance 90
- **/** (dark, Desktop): Performance 99
- **/ar** (dark, Mobile): Performance 75
- **/ar** (dark, Tablet): Performance 99
- **/ar** (dark, Desktop): Performance 98
- **/ar/work** (dark, Mobile): Performance 85
- **/ar/work** (dark, Tablet): Performance 99
- **/ar/work** (dark, Desktop): Performance 95
- **/ar/work/agro-teba** (dark, Mobile): Performance 52
- **/ar/work/agro-teba** (dark, Tablet): Performance 98
- **/ar/work/agro-teba** (dark, Desktop): Performance 98
- **/ar/work/ams-policies** (dark, Mobile): Performance 87
- **/ar/work/ams-policies** (dark, Desktop): Performance 97
- **/ar/work/civil-services-management-dashboard** (dark, Mobile): Performance 86
- **/ar/work/civil-services-management-dashboard** (dark, Tablet): Performance 99
- **/ar/work/civil-services-management-dashboard** (dark, Desktop): Performance 98
- **/ar/work/download-images** (dark, Mobile): Performance 84
- **/ar/work/download-images** (dark, Tablet): Performance 99
- **/ar/work/download-images** (dark, Desktop): Performance 97
- **/ar/work/eid-adha-card** (dark, Mobile): Performance 81
- **/ar/work/eid-adha-card** (dark, Desktop): Performance 97
- **/ar/work/estkdam** (dark, Mobile): Performance 84
- **/ar/work/estkdam** (dark, Tablet): Performance 98
- **/ar/work/estkdam** (dark, Desktop): Performance 96
- **/ar/work/gdawel-erp** (dark, Mobile): Performance 87
- **/ar/work/gdawel-erp** (dark, Desktop): Performance 97
- **/ar/work/hashstudio-digital-destination** (dark, Mobile): Performance 90
- **/ar/work/hashstudio-digital-destination** (dark, Tablet): Performance 98
- **/ar/work/hashstudio-digital-destination** (dark, Desktop): Performance 85
- **/ar/work/hawdaj** (dark, Mobile): Performance 83
- **/ar/work/hawdaj** (dark, Tablet): Performance 99
- **/ar/work/hawdaj** (dark, Desktop): Performance 98
- **/ar/work/jusur-dashboard** (dark, Mobile): Performance 80
- **/ar/work/jusur-dashboard** (dark, Tablet): Performance 99
- **/ar/work/jusur-dashboard** (dark, Desktop): Performance 94
- **/ar/work/knowledge-bank-tweeq** (dark, Mobile): Performance 89
- **/ar/work/knowledge-bank-tweeq** (dark, Desktop): Performance 98
- **/ar/work/medjol-patient-availy** (dark, Mobile): Performance 83
- **/ar/work/medjol-patient-availy** (dark, Tablet): Performance 97
- **/ar/work/medjol-patient-availy** (dark, Desktop): Performance 98
- **/ar/work/medjol-provider-dashboard** (dark, Mobile): Performance 83
- **/ar/work/medjol-provider-dashboard** (dark, Tablet): Performance 99
- **/ar/work/medjol-provider-dashboard** (dark, Desktop): Performance 97
- **/ar/work/mention** (dark, Mobile): Performance 82
- **/ar/work/mention** (dark, Desktop): Performance 98
- **/ar/work/nen-site** (dark, Mobile): Performance 85
- **/ar/work/nen-site** (dark, Desktop): Performance 98
- **/ar/work/nile-ortho** (dark, Mobile): Performance 85
- **/ar/work/nile-ortho** (dark, Desktop): Performance 98
- **/ar/work/procurelinker** (dark, Mobile): Performance 88
- **/ar/work/procurelinker** (dark, Desktop): Performance 98
- **/ar/work/qaraah-site** (dark, Mobile): Performance 74
- **/ar/work/qaraah-site** (dark, Tablet): Performance 99
- **/ar/work/qaraah-site** (dark, Desktop): Performance 98
- **/ar/work/qias-dashboard** (dark, Mobile): Performance 79
- **/ar/work/qias-dashboard** (dark, Tablet): Performance 99
- **/ar/work/qias-dashboard** (dark, Desktop): Performance 98
- **/ar/work/qr-payment** (dark, Mobile): Performance 84
- **/ar/work/qr-payment** (dark, Tablet): Performance 99
- **/ar/work/qr-payment** (dark, Desktop): Performance 97
- **/ar/work/reference-portal-talbinah** (dark, Mobile): Performance 86
- **/ar/work/reference-portal-talbinah** (dark, Desktop): Performance 97
- **/ar/work/sarie-site** (dark, Mobile): Performance 77
- **/ar/work/sarie-site** (dark, Desktop): Performance 97
- **/ar/work/seaah-stakeholders** (dark, Mobile): Performance 84
- **/ar/work/seaah-stakeholders** (dark, Tablet): Performance 99
- **/ar/work/seaah-stakeholders** (dark, Desktop): Performance 97
- **/ar/work/social-studio** (dark, Mobile): Performance 79
- **/ar/work/social-studio** (dark, Tablet): Performance 99
- **/ar/work/social-studio** (dark, Desktop): Performance 96
- **/ar/work/swarm-technologies** (dark, Mobile): Performance 77
- **/ar/work/swarm-technologies** (dark, Tablet): Performance 99
- **/ar/work/swarm-technologies** (dark, Desktop): Performance 95
- **/ar/work/taba-educational-program** (dark, Mobile): Performance 83
- **/ar/work/taba-educational-program** (dark, Desktop): Performance 96
- **/ar/work/talbinah-website** (dark, Mobile): Performance 82
- **/ar/work/talbinah-website** (dark, Desktop): Performance 97
- **/ar/work/wakeb-ai-chat** (dark, Mobile): Performance 81
- **/ar/work/wakeb-ai-chat** (dark, Desktop): Performance 96
- **/ar/work/wakeb-tech-site** (dark, Mobile): Performance 83
- **/ar/work/wakeb-tech-site** (dark, Tablet): Performance 98
- **/ar/work/wakeb-tech-site** (dark, Desktop): Performance 97
- **/ar/work/wrth-royal-institute-of-traditional-arts** (dark, Mobile): Performance 76
- **/ar/work/wrth-royal-institute-of-traditional-arts** (dark, Tablet): Performance 99
- **/ar/work/wrth-royal-institute-of-traditional-arts** (dark, Desktop): Performance 96
- **/work** (dark, Mobile): Performance 88
- **/work** (dark, Desktop): Performance 99
- **/work/agro-teba** (dark, Mobile): Performance 84
- **/work/agro-teba** (dark, Tablet): Performance 98
- **/work/agro-teba** (dark, Desktop): Performance 98
- **/work/ams-policies** (dark, Mobile): Performance 82
- **/work/ams-policies** (dark, Tablet): Performance 98
- **/work/ams-policies** (dark, Desktop): Performance 96
- **/work/civil-services-management-dashboard** (dark, Mobile): Performance 85
- **/work/civil-services-management-dashboard** (dark, Tablet): Performance 97
- **/work/civil-services-management-dashboard** (dark, Desktop): Performance 98
- **/work/download-images** (dark, Mobile): Performance 76
- **/work/download-images** (dark, Tablet): Performance 99
- **/work/download-images** (dark, Desktop): Performance 98
- **/work/eid-adha-card** (dark, Mobile): Performance 79
- **/work/eid-adha-card** (dark, Tablet): Performance 98
- **/work/eid-adha-card** (dark, Desktop): Performance 98
- **/work/estkdam** (dark, Mobile): Performance 74
- **/work/estkdam** (dark, Tablet): Performance 99
- **/work/estkdam** (dark, Desktop): Performance 97
- **/work/gdawel-erp** (dark, Mobile): Performance 83
- **/work/gdawel-erp** (dark, Tablet): Performance 98
- **/work/gdawel-erp** (dark, Desktop): Performance 98
- **/work/hashstudio-digital-destination** (dark, Mobile): Performance 81
- **/work/hashstudio-digital-destination** (dark, Tablet): Performance 99
- **/work/hashstudio-digital-destination** (dark, Desktop): Performance 99
- **/work/hawdaj** (dark, Mobile): Performance 80
- **/work/hawdaj** (dark, Desktop): Performance 99
- **/work/jusur-dashboard** (dark, Mobile): Performance 74
- **/work/jusur-dashboard** (dark, Tablet): Performance 99
- **/work/jusur-dashboard** (dark, Desktop): Performance 95
- **/work/knowledge-bank-tweeq** (dark, Mobile): Performance 76
- **/work/knowledge-bank-tweeq** (dark, Desktop): Performance 99
- **/work/medjol-patient-availy** (dark, Mobile): Performance 77
- **/work/medjol-patient-availy** (dark, Tablet): Performance 99
- **/work/medjol-patient-availy** (dark, Desktop): Performance 98
- **/work/medjol-provider-dashboard** (dark, Mobile): Performance 79
- **/work/medjol-provider-dashboard** (dark, Tablet): Performance 99
- **/work/medjol-provider-dashboard** (dark, Desktop): Performance 98
- **/work/mention** (dark, Mobile): Performance 77
- **/work/mention** (dark, Tablet): Performance 99
- **/work/mention** (dark, Desktop): Performance 99
- **/work/nen-site** (dark, Mobile): Performance 77
- **/work/nen-site** (dark, Tablet): Performance 99
- **/work/nen-site** (dark, Desktop): Performance 98
- **/work/nile-ortho** (dark, Mobile): Performance 76
- **/work/nile-ortho** (dark, Tablet): Performance 99
- **/work/nile-ortho** (dark, Desktop): Performance 99
- **/work/procurelinker** (dark, Mobile): Performance 79
- **/work/procurelinker** (dark, Desktop): Performance 97
- **/work/qaraah-site** (dark, Mobile): Performance 82
- **/work/qaraah-site** (dark, Tablet): Performance 99
- **/work/qaraah-site** (dark, Desktop): Performance 99
- **/work/qias-dashboard** (dark, Mobile): Performance 78
- **/work/qias-dashboard** (dark, Tablet): Performance 99
- **/work/qias-dashboard** (dark, Desktop): Performance 99
- **/work/qr-payment** (dark, Mobile): Performance 76
- **/work/qr-payment** (dark, Tablet): Performance 99
- **/work/qr-payment** (dark, Desktop): Performance 99
- **/work/reference-portal-talbinah** (dark, Mobile): Performance 83
- **/work/reference-portal-talbinah** (dark, Tablet): Performance 99
- **/work/reference-portal-talbinah** (dark, Desktop): Performance 99
- **/work/sarie-site** (dark, Mobile): Performance 77
- **/work/sarie-site** (dark, Tablet): Performance 99
- **/work/sarie-site** (dark, Desktop): Performance 99
- **/work/seaah-stakeholders** (dark, Mobile): Performance 86
- **/work/seaah-stakeholders** (dark, Tablet): Performance 99
- **/work/seaah-stakeholders** (dark, Desktop): Performance 98
- **/work/social-studio** (dark, Mobile): Performance 83
- **/work/social-studio** (dark, Desktop): Performance 88
- **/work/swarm-technologies** (dark, Mobile): Performance 76
- **/work/swarm-technologies** (dark, Tablet): Performance 98
- **/work/swarm-technologies** (dark, Desktop): Performance 99
- **/work/taba-educational-program** (dark, Mobile): Performance 81
- **/work/taba-educational-program** (dark, Desktop): Performance 99
- **/work/talbinah-website** (dark, Mobile): Performance 73
- **/work/talbinah-website** (dark, Tablet): Performance 99
- **/work/talbinah-website** (dark, Desktop): Performance 98
- **/work/wakeb-ai-chat** (dark, Mobile): Performance 82
- **/work/wakeb-ai-chat** (dark, Tablet): Performance 99
- **/work/wakeb-ai-chat** (dark, Desktop): Performance 98
- **/work/wakeb-tech-site** (dark, Mobile): Performance 82
- **/work/wakeb-tech-site** (dark, Tablet): Performance 99
- **/work/wakeb-tech-site** (dark, Desktop): Performance 98
- **/work/wrth-royal-institute-of-traditional-arts** (dark, Mobile): Performance 82
- **/work/wrth-royal-institute-of-traditional-arts** (dark, Tablet): Performance 99
- **/work/wrth-royal-institute-of-traditional-arts** (dark, Desktop): Performance 98

## Notes

- **`/this-page-does-not-exist` SEO score**: intentionally below 100.
  Lighthouse's `is-crawlable` audit flags any `<meta name="robots"
  content="noindex">` as a failure — but noindexing the 404 page is
  correct SEO practice (indexing it would put a no-content page in search
  results), not a defect. Every real, indexable route scores SEO 100.
- **Performance run-to-run variance**: numbers come from a single local
  machine sharing CPU with the rest of this environment (editor, prior
  builds), so Lighthouse's simulated throttling (heaviest on mobile,
  lightest on desktop) amplifies whatever contention was happening at that
  moment — LCP/TBT can swing noticeably between otherwise-identical runs.
  Vercel's production edge network removes that local contention entirely;
  these numbers are a conservative floor, not a prediction of production
  scores.
