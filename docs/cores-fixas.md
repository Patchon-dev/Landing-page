# Códigos de cor restantes

As classes das páginas, componentes e layouts usam agora as variáveis do tema. A revisão inclui também `src/app/home/Home.tsx` e os estilos globais.

`bg-transparent`, `text-transparent` e as máscaras com `black` mantêm a transparência e a opacidade necessárias aos efeitos; não representam cores da paleta visual.

Este inventário lista os códigos hexadecimais e as funções de cor literais nos ficheiros de texto de `src/`, `public/` e `index.html`. Não inclui dependências, builds, imagens raster, ícones binários nem o PDF.

## Utilitários

Cores devolvidas por `getCaptionColor()` e classes devolvidas por `getTableBorderCaptionColor()`. Mantidas para revisão: são cores de estados fora das páginas e não existem chamadas a estas funções no código atual.

| Localização | Códigos |
| --- | --- |
| [src/lib/utils/helpers.ts:279](../src/lib/utils/helpers.ts#L279) | `#007BFF` |
| [src/lib/utils/helpers.ts:280](../src/lib/utils/helpers.ts#L280) | `#2fd074` |
| [src/lib/utils/helpers.ts:281](../src/lib/utils/helpers.ts#L281) | `#e052b1` |
| [src/lib/utils/helpers.ts:282](../src/lib/utils/helpers.ts#L282) | `#f49d25` |
| [src/lib/utils/helpers.ts:283](../src/lib/utils/helpers.ts#L283) | `#e44444` |
| [src/lib/utils/helpers.ts:284](../src/lib/utils/helpers.ts#L284) | `#3c71dd` |
| [src/lib/utils/helpers.ts:285](../src/lib/utils/helpers.ts#L285) | `#f4b625` |
| [src/lib/utils/helpers.ts:286](../src/lib/utils/helpers.ts#L286) | `#995cd6` |
| [src/lib/utils/helpers.ts:287](../src/lib/utils/helpers.ts#L287) | `#1e1e1e` |
| [src/lib/utils/helpers.ts:299](../src/lib/utils/helpers.ts#L299) | `#00CC99` |
| [src/lib/utils/helpers.ts:300](../src/lib/utils/helpers.ts#L300) | `#4C99F2` |
| [src/lib/utils/helpers.ts:302](../src/lib/utils/helpers.ts#L302) | `#F2C94C` |
| [src/lib/utils/helpers.ts:303](../src/lib/utils/helpers.ts#L303) | `#ADADAD` |

## Metadados

Cor inicial do navegador e cores de instalação da aplicação. Estes campos exigem valores de cor concretos e não resolvem variáveis CSS.

| Localização | Códigos |
| --- | --- |
| [index.html:14](../index.html#L14) | `#101114` |
| [public/site.webmanifest:8](../public/site.webmanifest#L8) | `#101114` |
| [public/site.webmanifest:9](../public/site.webmanifest#L9) | `#101114` |

## Definições dos temas

Os valores concretos ficam nestes ficheiros por serem a origem das variáveis. Aqui é esperado existirem códigos de cor.

| Localização | Códigos |
| --- | --- |
| [src/lib/themes/dark.css:6](../src/lib/themes/dark.css#L6) | `#f5f5f7` |
| [src/lib/themes/dark.css:15](../src/lib/themes/dark.css#L15) | `#9b8aff24` |
| [src/lib/themes/dark.css:17](../src/lib/themes/dark.css#L17) | `#685799` |
| [src/lib/themes/light.css:6](../src/lib/themes/light.css#L6) | `#1b1a2b` |
| [src/lib/themes/light.css:15](../src/lib/themes/light.css#L15) | `#8779b72b` |
| [src/lib/themes/light.css:17](../src/lib/themes/light.css#L17) | `#b8a8e2` |
| [src/lib/themes/light.css:18](../src/lib/themes/light.css#L18) | `#f0f0f0` |
| [src/lib/themes/shared.css:47](../src/lib/themes/shared.css#L47) | `#171225` |
| [src/lib/themes/shared.css:48](../src/lib/themes/shared.css#L48) | `#9b8aff16` |
| [src/lib/themes/shared.css:50](../src/lib/themes/shared.css#L50) | `#0001` |
| [src/lib/themes/shared.css:51](../src/lib/themes/shared.css#L51) | `#0002` |
| [src/lib/themes/shared.css:52](../src/lib/themes/shared.css#L52) | `#0003` |
| [src/lib/themes/shared.css:53](../src/lib/themes/shared.css#L53) | `#0004` |
| [src/lib/themes/shared.css:60](../src/lib/themes/shared.css#L60) | `#f6f3ff` |
| [src/lib/themes/shared.css:61](../src/lib/themes/shared.css#L61) | `#eee9fc` |
| [src/lib/themes/shared.css:62](../src/lib/themes/shared.css#L62) | `#dcd1ff` |
| [src/lib/themes/shared.css:63](../src/lib/themes/shared.css#L63) | `#c5b8f5` |
| [src/lib/themes/shared.css:64](../src/lib/themes/shared.css#L64) | `#b4a0ee` |
| [src/lib/themes/shared.css:65](../src/lib/themes/shared.css#L65) | `#9b8aff` |
| [src/lib/themes/shared.css:66](../src/lib/themes/shared.css#L66) | `#7963d4` |
| [src/lib/themes/shared.css:67](../src/lib/themes/shared.css#L67) | `#5c42bc` |
| [src/lib/themes/shared.css:68](../src/lib/themes/shared.css#L68) | `#46328e` |
| [src/lib/themes/shared.css:69](../src/lib/themes/shared.css#L69) | `#30235f` |
| [src/lib/themes/shared.css:70](../src/lib/themes/shared.css#L70) | `#171225` |
| [src/lib/themes/shared.css:71](../src/lib/themes/shared.css#L71) | `#171225` |
| [src/lib/themes/shared.css:72](../src/lib/themes/shared.css#L72) | `#ffffff` |
| [src/lib/themes/shared.css:86](../src/lib/themes/shared.css#L86) | `#f3f5fd` |
| [src/lib/themes/shared.css:87](../src/lib/themes/shared.css#L87) | `#e9edfb` |
| [src/lib/themes/shared.css:88](../src/lib/themes/shared.css#L88) | `#d6dcf5` |
| [src/lib/themes/shared.css:89](../src/lib/themes/shared.css#L89) | `#b6c8ff` |
| [src/lib/themes/shared.css:90](../src/lib/themes/shared.css#L90) | `#8da9eb` |
| [src/lib/themes/shared.css:91](../src/lib/themes/shared.css#L91) | `#6c8bd8` |
| [src/lib/themes/shared.css:92](../src/lib/themes/shared.css#L92) | `#5375c8` |
| [src/lib/themes/shared.css:93](../src/lib/themes/shared.css#L93) | `#4465ba` |
| [src/lib/themes/shared.css:94](../src/lib/themes/shared.css#L94) | `#354e91` |
| [src/lib/themes/shared.css:95](../src/lib/themes/shared.css#L95) | `#293c6c` |
| [src/lib/themes/shared.css:96](../src/lib/themes/shared.css#L96) | `#202541` |
| [src/lib/themes/shared.css:97](../src/lib/themes/shared.css#L97) | `#171225` |
| [src/lib/themes/shared.css:98](../src/lib/themes/shared.css#L98) | `#ffffff` |
| [src/lib/themes/shared.css:112](../src/lib/themes/shared.css#L112) | `#f5f2fc` |
| [src/lib/themes/shared.css:113](../src/lib/themes/shared.css#L113) | `#eeebf8` |
| [src/lib/themes/shared.css:114](../src/lib/themes/shared.css#L114) | `#dcd1ff` |
| [src/lib/themes/shared.css:115](../src/lib/themes/shared.css#L115) | `#c7b8f1` |
| [src/lib/themes/shared.css:116](../src/lib/themes/shared.css#L116) | `#a48be7` |
| [src/lib/themes/shared.css:117](../src/lib/themes/shared.css#L117) | `#6b50d8` |
| [src/lib/themes/shared.css:118](../src/lib/themes/shared.css#L118) | `#5b42bc` |
| [src/lib/themes/shared.css:119](../src/lib/themes/shared.css#L119) | `#4b369b` |
| [src/lib/themes/shared.css:120](../src/lib/themes/shared.css#L120) | `#342a62` |
| [src/lib/themes/shared.css:121](../src/lib/themes/shared.css#L121) | `#2c2446` |
| [src/lib/themes/shared.css:122](../src/lib/themes/shared.css#L122) | `#1d1931` |
| [src/lib/themes/shared.css:123](../src/lib/themes/shared.css#L123) | `#171225` |
| [src/lib/themes/shared.css:124](../src/lib/themes/shared.css#L124) | `#ffffff` |
| [src/lib/themes/shared.css:138](../src/lib/themes/shared.css#L138) | `#effdf4` |
| [src/lib/themes/shared.css:139](../src/lib/themes/shared.css#L139) | `#d9fbe5` |
| [src/lib/themes/shared.css:140](../src/lib/themes/shared.css#L140) | `#b6f5cd` |
| [src/lib/themes/shared.css:141](../src/lib/themes/shared.css#L141) | `#79eaa8` |
| [src/lib/themes/shared.css:142](../src/lib/themes/shared.css#L142) | `#34da7e` |
| [src/lib/themes/shared.css:143](../src/lib/themes/shared.css#L143) | `#00c950` |
| [src/lib/themes/shared.css:144](../src/lib/themes/shared.css#L144) | `#00a63e` |
| [src/lib/themes/shared.css:145](../src/lib/themes/shared.css#L145) | `#008236` |
| [src/lib/themes/shared.css:146](../src/lib/themes/shared.css#L146) | `#016630` |
| [src/lib/themes/shared.css:147](../src/lib/themes/shared.css#L147) | `#0d542b` |
| [src/lib/themes/shared.css:148](../src/lib/themes/shared.css#L148) | `#052e16` |
| [src/lib/themes/shared.css:149](../src/lib/themes/shared.css#L149) | `#171225` |
| [src/lib/themes/shared.css:150](../src/lib/themes/shared.css#L150) | `#ffffff` |
| [src/lib/themes/shared.css:164](../src/lib/themes/shared.css#L164) | `#fffbeb` |
| [src/lib/themes/shared.css:165](../src/lib/themes/shared.css#L165) | `#fef3c7` |
| [src/lib/themes/shared.css:166](../src/lib/themes/shared.css#L166) | `#fde68a` |
| [src/lib/themes/shared.css:167](../src/lib/themes/shared.css#L167) | `#fcd34d` |
| [src/lib/themes/shared.css:168](../src/lib/themes/shared.css#L168) | `#fbbf24` |
| [src/lib/themes/shared.css:169](../src/lib/themes/shared.css#L169) | `#f59e0b` |
| [src/lib/themes/shared.css:170](../src/lib/themes/shared.css#L170) | `#d97706` |
| [src/lib/themes/shared.css:171](../src/lib/themes/shared.css#L171) | `#b45309` |
| [src/lib/themes/shared.css:172](../src/lib/themes/shared.css#L172) | `#92400e` |
| [src/lib/themes/shared.css:173](../src/lib/themes/shared.css#L173) | `#78350f` |
| [src/lib/themes/shared.css:174](../src/lib/themes/shared.css#L174) | `#451a03` |
| [src/lib/themes/shared.css:175](../src/lib/themes/shared.css#L175) | `#171225` |
| [src/lib/themes/shared.css:176](../src/lib/themes/shared.css#L176) | `#ffffff` |
| [src/lib/themes/shared.css:190](../src/lib/themes/shared.css#L190) | `#fef2f2` |
| [src/lib/themes/shared.css:191](../src/lib/themes/shared.css#L191) | `#fee2e2` |
| [src/lib/themes/shared.css:192](../src/lib/themes/shared.css#L192) | `#fecaca` |
| [src/lib/themes/shared.css:193](../src/lib/themes/shared.css#L193) | `#fca5a5` |
| [src/lib/themes/shared.css:194](../src/lib/themes/shared.css#L194) | `#f87171` |
| [src/lib/themes/shared.css:195](../src/lib/themes/shared.css#L195) | `#ef4444` |
| [src/lib/themes/shared.css:196](../src/lib/themes/shared.css#L196) | `#dc2626` |
| [src/lib/themes/shared.css:197](../src/lib/themes/shared.css#L197) | `#b91c1c` |
| [src/lib/themes/shared.css:198](../src/lib/themes/shared.css#L198) | `#991b1b` |
| [src/lib/themes/shared.css:199](../src/lib/themes/shared.css#L199) | `#7f1d1d` |
| [src/lib/themes/shared.css:200](../src/lib/themes/shared.css#L200) | `#450a0a` |
| [src/lib/themes/shared.css:201](../src/lib/themes/shared.css#L201) | `#171225` |
| [src/lib/themes/shared.css:202](../src/lib/themes/shared.css#L202) | `#ffffff` |
| [src/lib/themes/shared.css:216](../src/lib/themes/shared.css#L216) | `#ffffff` |
| [src/lib/themes/shared.css:217](../src/lib/themes/shared.css#L217) | `#f6f5fa` |
| [src/lib/themes/shared.css:218](../src/lib/themes/shared.css#L218) | `#eeebf8` |
| [src/lib/themes/shared.css:219](../src/lib/themes/shared.css#L219) | `#d8d4e7` |
| [src/lib/themes/shared.css:220](../src/lib/themes/shared.css#L220) | `#a6a7b6` |
| [src/lib/themes/shared.css:221](../src/lib/themes/shared.css#L221) | `#636176` |
| [src/lib/themes/shared.css:222](../src/lib/themes/shared.css#L222) | `#484657` |
| [src/lib/themes/shared.css:223](../src/lib/themes/shared.css#L223) | `#30313f` |
| [src/lib/themes/shared.css:224](../src/lib/themes/shared.css#L224) | `#252632` |
| [src/lib/themes/shared.css:225](../src/lib/themes/shared.css#L225) | `#191a21` |
| [src/lib/themes/shared.css:226](../src/lib/themes/shared.css#L226) | `#101114` |
| [src/lib/themes/shared.css:227](../src/lib/themes/shared.css#L227) | `#171225` |
| [src/lib/themes/shared.css:228](../src/lib/themes/shared.css#L228) | `#ffffff` |

## Imagens SVG

Cores próprias dos logótipos, bandeiras e ícones. Mantidas nos ficheiros de imagem.

| Ficheiro | Linhas | Códigos |
| --- | --- | --- |
| [public/favicon.svg](../public/favicon.svg#L1) | 1 | `#6d4bd1`, `#ffffff` |
| [public/icons.svg](../public/icons.svg#L3) | 3–4, 7, 10–12, 15, 18–19, 22 | `#08060d`, `#fff`, `#aa3bff` |
| [src/assets/flags/de.svg](../src/assets/flags/de.svg#L2) | 2–3 | `#fc0`, `#000001` |
| [src/assets/flags/es.svg](../src/assets/flags/es.svg#L2) | 2–336, 338, 340–347, 349, 351, 353, 355–486, 488, 490, 492, 494, 496, 498, 500–536, 538–539, 541–542 | `#AA151B`, `#F1BF00`, `#ad1519`, `#000`, `#c8b100`, `#fff`, `#058e6e`, `#005bbf`, `#ccc`, `#c7b500`, `#db4446`, `#ed72aa`, `#ffd691`, `#0039f0` |
| [src/assets/flags/fr.svg](../src/assets/flags/fr.svg#L2) | 2–4 | `#000091`, `#fff`, `#e1000f` |
| [src/assets/flags/it.svg](../src/assets/flags/it.svg#L3) | 3–5 | `#fff`, `#009246`, `#ce2b37` |
| [src/assets/flags/nl.svg](../src/assets/flags/nl.svg#L2) | 2–4 | `#ae1c28`, `#fff`, `#21468b` |
| [src/assets/flags/pt.svg](../src/assets/flags/pt.svg#L3) | 3–4, 24–25, 27, 35–36, 44–45 | `#060`, `#ff0`, `#000`, `#fff`, `#000001`, `#039` |
| [src/assets/flags/uk.svg](../src/assets/flags/uk.svg#L2) | 2–6 | `#012169`, `#FFF`, `#C8102E` |
| [src/assets/react.svg](../src/assets/react.svg#L1) | 1 | `#00D8FF` |
| [src/assets/vite.svg](../src/assets/vite.svg#L1) | 1 | `#000`, `#fff`, `#9135ff`, `#eee6ff`, `#8900ff`, `#00c2ff` |
