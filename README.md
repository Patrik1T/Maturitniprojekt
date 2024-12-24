# Revas
# Aplikace pro dělání testů
## Cíl projektu:
`Mým cílem bylo udělat funkční aplikaci, ve které by bylo být schopno udělat jednoduše testy na nějaké téma a potom by je šlo hodit na moodle nebo na jiné aplikace, kde by žák ten daný vyrobený test udělal a učitel by, pak uviděl hotový výsledek toho daného žáka. Aplikace pod jménem Revas by měla umožňovat co ---nejjednodušeji udělat různé druhy typů testů. Některé typy testů bude dělaná i v podobě menších her.`

## Logo:
![Moje obrázek](logoRevas.png)

## Moje hlavní cíle, můj hlavní plán:
### Plánování a Nastavení Projektu: (100%)

•	`Zjištění o všem co se jak dělá . `(100%)

•	`Detailní specifikace aplikace . `(100%)

•	`Vytvoření readme.md. `(100%)

•	`Vytvoření SQL databáze pro strukturu projektu. `(100%)

•	`Nastavení vývojového prostředí: Django (backend a fronted). `(100%)

•	`Základní struktura projektu (databáze: testy, otázky, uživatelé, platby). `(100%)

•	`Přidání knihovny pro zpracování plateb (např. Stripe nebo PayPal SDK). `(100%)

### Přihlašování a registrace:  (90%)

•	`Přihlášení: ` (90%)

•	`Přihlášení přes github: ` (100%)

•	`Registrace: ` (90%)


### Testy: (90%)

•	`Udělání základních testů. ` (90%)


### Herní testy: (90%)

•	- `Udělání herních testů. ` (90%)


### Ukládání, statistiky, historie a další věci: (0%)

•	`Historie. ` (0%)

•	`Statistiky ` (0%)

•	`Ukládání. ` (29%)

### Komunikace (20%)

•	`Zjistit jak se to dělá. ` (100%)

•	`Posílání správ a souborů mezi uživateli ` (0%)


### Košík (20%)

•	`Zjistit jak se to dělá. ` (100%)

•	`Sprovoznění platby. ` (0%)

•	`Přidání výhod. ` (0%)


### Upravení stylů, menších chyb, nedostatků a Finální Testování (60%)

•	`Fungování kódu ` (40%)

•	`Styli aplikace  ` (100%)

•	`Vygenerování/nakreslení všech animací a obrázků.  ` (20%)

### Dokumentace a příprava na prezentaci projektu (20%)

•	`Udělání dokumentace v Latexu. ` (20%)

•	`Udělání video prezentace o projektu. ` (0%)


## Používané technologie:

`Pycharm: Pro napsání celého kódu pro mou aplikaci. `

`Backend (Django): Pro autentifikaci uživatelů, správu testů, export do Moodle a zpracování plateb (např. Stripe nebo PayPal). `

`Frontend (django/css): Pro tvorbu interaktivního uživatelského rozhraní s integrací P5.js pro herní prvky. `

`Javascript: Pro fuunkcionalitu klasických otázek a odpovědí. `

`P5.js: Pro vizualizace a gamifikaci testů. `

`FullCalendar.js: Pro zobrazení plánovaných testů v kalendáři. `

`Django REST Framework: Pro vytváření API pro nahrávání souborů na Moodle.`

`Stripe/PayPal SDK: Pro implementaci platebních funkcí. `

`MySQL: Databáze pro ukládání uživatelských statistik, testů. `

`Photoshop: pro nakreslení a nanimování některých funkcí a her. `

`Latex: pro dokumentaci celého projektu. `

## Konkurence
`Existuje několik open-source projektů zaměřených na tvorbu kvízových aplikací, které mi sloužili jako základ pro můj projekt nebo jako inspirace: 
`
### Quiz Flask App:
   
`Jedná se o open-source aplikaci postavenou na Pythonu a Flasku s MySQL databází. Umožňuje vytváření a spravování kvízů, nabízí náhodný výběr otázek, zaznamenávání odpovědí uživatelů a okamžité skórování. Tento projekt je dobře strukturovaný a snadno přizpůsobitelný různým vzdělávacím účelům(
simboli/quiz-flask-app: An open-source web app for creating and taking quizzes with ease. (github.com)
). `

### Flask Quiz App by thepasterover:

`Tato aplikace je také postavena na Flasku a nabízí funkce jako registraci, přihlašování, opakování testů, a zobrazení výsledků okamžitě po dokončení testu. Aplikace využívá SQLite pro rychlý výkon a HTML/CSS pro frontend(
thepasterover/flask-quiz-app: A Quiz App built using Flask Library and Custom HTML-CSS. (github.com)
). `

### ClassQuiz:

`Tento projekt je zaměřen na interaktivní učení ve stylu Kahoot! Je open-source a umožňuje učitelům vytvářet kvízy, které mohou studenti hrát na dálku proti sobě. Nabízí kompletní dokumentaci pro vlastní hostování a je dobře přizpůsobený pro použití ve vzdělávacím prostředí(
mawoka-myblock/ClassQuiz: ClassQuiz is a quiz-application like Kahoot!, but open-source. (github.com)
). `

### Moodle API a export testů:

•	moosh: Moosh je nástroj pro správu Moodle z příkazové řádky, což by mi mohlo pomoci při exportu testů do Moodle. I když je více zaměřen na administraci Moodle, můžu tento projekt využít jako základ pro práci s Moodle API.
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
