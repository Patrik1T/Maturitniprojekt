p# Aplikace Revas pro dělání testů
## Cíl projektu:
`Mým cílem bylo udělat funkční aplikaci, ve které by bylo být schopno udělat jednoduše testy na nějaké téma a potom by je šlo hodit na moodle nebo na jiné aplikace, kde by žák ten daný vyrobený test udělal a učitel by, pak uviděl hotový výsledek toho daného žáka. Aplikace pod jménem Revas by měla umožňovat co ---nejjednodušeji udělat různé druhy typů testů. Některé typy testů bude dělaná i v podobě menších her.`

## Logo:
[Revas.kra](..%2FUsers%2Fmegaagri%2FDesktop%2FRevas_projekt%2FRevas.kra)

## Moje hlavní cíle, můj hlavní plán:
###1. týden (15.9. – 22.9.): Plánování a Nastavení Projektu (100%)
•	- `Detailní specifikace aplikace (moduly: testy, platby, denní výzvy, veřejné sdílení). `(hotovo)
•	- `Vytvoření readme.md. `(hotovo)
•	- `Vytvoření SQL databáze pro strukturu projektu. `(hotovo)
•	- `Nastavení vývojového prostředí: Django (backend), React (frontend), P5.js (herní prvky). `(hotovo)
•	- `Základní struktura projektu (databáze: testy, otázky, uživatelé, platby). `(hotovo)
•	- `Přidání knihovny pro zpracování plateb (např. Stripe nebo PayPal SDK). `(hotovo)
###2.–3. týden: Backendová Logika (38%)
•	- `Vytvoření datových modelů: `
o	Testy, otázky, odpovědi. ()
o	Uživatelské profily s pokročilými statistikami (úspěchy, chyby). ()
o	Platby za prémiové funkce. ` ()
•	- `Implementace REST API: 
o	CRUD operace pro správu testů. ()
o	API pro ukládání statistik uživatelů (chyby, postup). ()
o	API pro zpracování plateb. ` ()
•	- `Export testů do formátů GIFT a Moodle XML. ` ()
•	- `Testy backendové logiky (unit testy). ` ()
###4.–5. týden: Frontendová Základní Struktura (0%)
•	- `Základní UI v Reactu: registrace, správa testů, zobrazení kalendáře. ` ()
•	- `Integrace API (získávání a zobrazování testů, uživatelských statistik). ` ()
•	- `První verze herních prvků v P5.js (např. jednoduchý kvíz, pexeso). ` ()
•	- `Autentifikace uživatelů (Django + React). ` ()
###6.–7. týden: Gamifikace a Pokročilé Herní Prvky (0%)
•	- `Implementace postupování levelů: za úspěšné testy uživatel získá body nebo odměny. ` ()
•	- `Rozšíření herních prvků a vizualizací (např. animace v P5.js). ` ()
•	- `Denní výzvy: sledování, v jakých otázkách uživatel chybuje, a vytváření denních kvízů pro opravu chyb. ` ()
•	- `Propojení gamifikace s backendem (ukládání skóre, úspěchů a chyb). ` ()
###8. týden: Veřejné Sdílení a Učební Materiály (0%)
•	- `Implementace veřejného sdílení testů. Autor testu může rozhodnout, zda bude test přístupný veřejnosti. ` ()
•	- `Možnost vytvářet učební materiály k jednotlivým tématům (např. lekce, které doplní testy). ` ()
•	- `Integrace kalendáře pro zobrazení naplánovaných testů a výzev. ` ()
###9. týden: Platby a Prémiové Funkce (0%)
•	- `Integrace platební brány (Stripe, PayPal) pro nákup prémiových funkcí (např. extra herní prvky nebo personalizace UI). ` ()
•	- `Zajištění bezpečnosti plateb a ochrany uživatelských dat. ` ()
•	- `Testování API pro zpracování plateb a napojení na uživatelské profily (zobrazení zakoupených výhod). ` ()
###10. týden: Optimalizace a Integrace s Moodle (0%)
•	- `Optimalizace výkonu aplikace (rychlost načítání, plynulost herních prvků). ` ()
•	- `Testování exportu do Moodle, ladění generovaných formátů (GIFT a Moodle XML). ` ()
•	- `Zabezpečení API a ochrana dat uživatelů (např. SSL, správné ošetření vstupů). ` ()
###11.–12. týden: Nasazení a Finální Testování (0%)
•	- `Nasazení aplikace na produkční server (Heroku, DigitalOcean, AWS). ` ()
•	- `Testování všech funkcí (platby, herní mechaniky, veřejné testy).  ` ()
•	- `Nakreslení všech animací a obrázků.  ` ()
•	- `Udělání prezentace  a video prezentace o projektu. ` ()


## Používané technologie:
- `Backend (Django): Pro autentifikaci uživatelů, správu testů, export do Moodle a zpracování plateb (např. Stripe nebo PayPal). `
-`Frontend (React + Javascript): Pro tvorbu interaktivního uživatelského rozhraní s integrací P5.js pro herní prvky. `
-`P5.js: Pro vizualizace a gamifikaci testů. `
-`FullCalendar.js: Pro zobrazení plánovaných testů v kalendáři. `
-`Django REST Framework: Pro vytváření API.`
-`Stripe/PayPal SDK: Pro implementaci platebních funkcí. `
-`MySQL: Databáze pro ukládání uživatelských statistik, testů a transakcí. `
-`Photoshop: pro nakreslení a nanimování některých funkcí a her. `

## Konkurence
`Existuje několik open-source projektů zaměřených na tvorbu kvízových aplikací, které mi sloužili jako základ pro můj projekt nebo jako inspirace: `
1.	###Quiz Flask App:
`Jedná se o open-source aplikaci postavenou na Pythonu a Flasku s MySQL databází. Umožňuje vytváření a spravování kvízů, nabízí náhodný výběr otázek, zaznamenávání odpovědí uživatelů a okamžité skórování. Tento projekt je dobře strukturovaný a snadno přizpůsobitelný různým vzdělávacím účelům(
simboli/quiz-flask-app: An open-source web app for creating and taking quizzes with ease. (github.com)
). `
2.	###Flask Quiz App by thepasterover:
`Tato aplikace je také postavena na Flasku a nabízí funkce jako registraci, přihlašování, opakování testů, a zobrazení výsledků okamžitě po dokončení testu. Aplikace využívá SQLite pro rychlý výkon a HTML/CSS pro frontend(
thepasterover/flask-quiz-app: A Quiz App built using Flask Library and Custom HTML-CSS. (github.com)
). `
3.	###ClassQuiz:
`Tento projekt je zaměřen na interaktivní učení ve stylu Kahoot! Je open-source a umožňuje učitelům vytvářet kvízy, které mohou studenti hrát na dálku proti sobě. Nabízí kompletní dokumentaci pro vlastní hostování a je dobře přizpůsobený pro použití ve vzdělávacím prostředí(
mawoka-myblock/ClassQuiz: ClassQuiz is a quiz-application like Kahoot!, but open-source. (github.com)
). `
4.	###Moodle API a export testů:
•	moosh: Moosh je nástroj pro správu Moodle z příkazové řádky, což by ti mohlo pomoci při exportu testů do Moodle. I když je více zaměřen na administraci Moodle, můžeš tento projekt využít jako základ pro práci s Moodle API.
tmuras/moosh: Moosh (github.com)

### Instalace
1. Klonování repozitáře
- `git clone`
2. Přesun do adresáře webu
- `cd`
3. Vytvoření virtuálního prostředí do složky .venv
- `python -m venv .venv`
4. Aktivace virtuálního prostředí 
- `.venv\Scripts\activate` (aktivace virtuálního prostředí - ve Windows)
- `.venv/bin/activate` (aktivace virtuálního prostředí - v Linuxu)
5. Instalace závislostí
- `pip install -r requirements.txt`
6. Spuštění aplikace
- `python manage.py runserver`

### Přístupové údaje do administrace
- superuživatel: `admin`
- heslo: `admin`
