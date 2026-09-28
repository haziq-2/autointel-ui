/** Turn a free-text listing location into a USPS state code, when we can. */

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "Washington, DC",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const ABBR = new Set(Object.keys(STATE_NAMES));

/** Full normalized string → state. Used for short or ambiguous labels. */
const EXACT: Record<string, string> = {
  spring: "TX",
  hollywood: "CA",
  cambridge: "MA",
  woodside: "CA",
  lawrenceville: "GA",
  "east valley": "AZ",
  "otp north": "GA",
  "phx north": "AZ",
  "north phoenix": "AZ",
  "wayne county": "MI",
  "park forest": "IL",
  "mid cities": "TX",
  "north dfw": "TX",
  "south dfw": "TX",
  "fort sam": "TX",
  "fort sam area": "TX",
  "hennepin county": "MN",
  "multnomah county": "OR",
  "broward county": "FL",
  "pierce county": "WA",
  "santa cruz co": "CA",
  "clark cowlitz wa": "WA",
  "tacoma pierce": "WA",
  "vallejo benicia": "CA",
  "949vanscom": "CA",
  "our website is motorhubnjcom": "NJ",
  "wwwalamocarcentercom": "TX",
};

/** Area codes used only when a location is a phone number and nothing else matched. */
const AREA_CODES: Record<string, string> = {
  "201": "NJ", "202": "DC", "203": "CT", "205": "AL", "206": "WA", "207": "ME", "208": "ID",
  "209": "CA", "210": "TX", "212": "NY", "213": "CA", "214": "TX", "215": "PA", "216": "OH",
  "217": "IL", "218": "MN", "219": "IN", "224": "IL", "225": "LA", "228": "MS", "229": "GA",
  "231": "MI", "234": "OH", "239": "FL", "240": "MD", "248": "MI", "251": "AL", "252": "NC",
  "253": "WA", "254": "TX", "256": "AL", "260": "IN", "262": "WI", "267": "PA", "269": "MI",
  "270": "KY", "272": "PA", "276": "VA", "281": "TX", "301": "MD", "302": "DE", "303": "CO",
  "304": "WV", "305": "FL", "307": "WY", "308": "NE", "309": "IL", "310": "CA", "312": "IL",
  "313": "MI", "314": "MO", "315": "NY", "316": "KS", "317": "IN", "318": "LA", "319": "IA",
  "320": "MN", "321": "FL", "323": "CA", "325": "TX", "330": "OH", "331": "IL", "334": "AL",
  "336": "NC", "337": "LA", "339": "MA", "346": "TX", "347": "NY", "351": "MA", "352": "FL",
  "360": "WA", "361": "TX", "364": "KY", "380": "OH", "385": "UT", "386": "FL", "401": "RI",
  "402": "NE", "404": "GA", "405": "OK", "406": "MT", "407": "FL", "408": "CA", "409": "TX",
  "410": "MD", "412": "PA", "413": "MA", "414": "WI", "415": "CA", "417": "MO", "419": "OH",
  "423": "TN", "424": "CA", "425": "WA", "430": "TX", "432": "TX", "434": "VA", "435": "UT",
  "440": "OH", "442": "CA", "443": "MD", "458": "OR", "469": "TX", "470": "GA", "475": "CT",
  "478": "GA", "479": "AR", "480": "AZ", "484": "PA", "501": "AR", "502": "KY", "503": "OR",
  "504": "LA", "505": "NM", "507": "MN", "508": "MA", "509": "WA", "510": "CA", "512": "TX",
  "513": "OH", "515": "IA", "516": "NY", "517": "MI", "518": "NY", "520": "AZ", "530": "CA",
  "531": "NE", "534": "WI", "539": "OK", "540": "VA", "541": "OR", "551": "NJ", "559": "CA",
  "561": "FL", "562": "CA", "563": "IA", "567": "OH", "570": "PA", "571": "VA", "573": "MO",
  "574": "IN", "575": "NM", "580": "OK", "585": "NY", "586": "MI", "601": "MS", "602": "AZ",
  "603": "NH", "605": "SD", "606": "KY", "607": "NY", "608": "WI", "609": "NJ", "610": "PA",
  "612": "MN", "614": "OH", "615": "TN", "616": "MI", "617": "MA", "618": "IL", "619": "CA",
  "620": "KS", "623": "AZ", "626": "CA", "628": "CA", "629": "TN", "630": "IL", "631": "NY",
  "636": "MO", "641": "IA", "646": "NY", "650": "CA", "651": "MN", "657": "CA", "660": "MO",
  "661": "CA", "662": "MS", "667": "MD", "669": "CA", "678": "GA", "681": "WV", "682": "TX",
  "701": "ND", "702": "NV", "703": "VA", "704": "NC", "706": "GA", "707": "CA", "708": "IL",
  "712": "IA", "713": "TX", "714": "CA", "715": "WI", "716": "NY", "717": "PA", "718": "NY",
  "719": "CO", "720": "CO", "724": "PA", "725": "NV", "726": "TX", "727": "FL", "731": "TN",
  "732": "NJ", "734": "MI", "737": "TX", "740": "OH", "743": "NC", "747": "CA", "754": "FL",
  "757": "VA", "760": "CA", "762": "GA", "763": "MN", "765": "IN", "769": "MS", "770": "GA",
  "772": "FL", "773": "IL", "774": "MA", "775": "NV", "779": "IL", "781": "MA", "785": "KS",
  "786": "FL", "801": "UT", "802": "VT", "803": "SC", "804": "VA", "805": "CA", "806": "TX",
  "808": "HI", "810": "MI", "812": "IN", "813": "FL", "814": "PA", "815": "IL", "816": "MO",
  "817": "TX", "818": "CA", "828": "NC", "830": "TX", "831": "CA", "832": "TX", "843": "SC",
  "845": "NY", "847": "IL", "848": "NJ", "850": "FL", "854": "SC", "856": "NJ", "857": "MA",
  "858": "CA", "859": "KY", "860": "CT", "862": "NJ", "863": "FL", "864": "SC", "865": "TN",
  "870": "AR", "872": "IL", "878": "PA", "901": "TN", "903": "TX", "904": "FL", "906": "MI",
  "907": "AK", "908": "NJ", "909": "CA", "910": "NC", "912": "GA", "913": "KS", "914": "NY",
  "915": "TX", "916": "CA", "917": "NY", "918": "OK", "919": "NC", "920": "WI", "925": "CA",
  "928": "AZ", "929": "NY", "930": "IN", "931": "TN", "934": "NY", "936": "TX", "937": "OH",
  "938": "AL", "940": "TX", "941": "FL", "945": "TX", "947": "MI", "949": "CA", "951": "CA",
  "952": "MN", "954": "FL", "956": "TX", "959": "CT", "970": "CO", "971": "OR", "972": "TX",
  "973": "NJ", "978": "MA", "979": "TX", "980": "NC", "984": "NC", "985": "LA", "989": "MI",
};

function areaCodeState(raw: string): string | null {
  const match = raw.match(/\(?\b(\d{3})\)?[\s.-]+\d{3}[\s.-]?\d{4}/);
  if (!match) return null;
  return AREA_CODES[match[1]] ?? null;
}

/**
 * Distinctive city, county, and metro phrases. Longest match wins.
 * Bare "Arlington, VA" is caught by the comma-state parser before this list,
 * so bare "arlington" can stay Texas, which is what this catalog uses.
 */
const PLACE_LINES = `
cleveland|OH
columbus|OH
dayton|OH
richmond|VA
springfield|IL
troy|MI
pasadena|CA
aurora|CO
portland|OR
kansas city|MO
st louis|MO
washington|DC
las vegas|NV
reno|NV
santa fe|NM
greenville|SC
birmingham|AL
columbia|SC
franklin|TN
jackson|MS
lebanon|PA
hamilton|OH
plymouth|MA
florence|AL
manchester|NH
newport|RI
glendale|CA
san antonio|TX
fort worth|TX
grand prairie|TX
new braunfels|TX
flower mound|TX
north dallas|TX
south arlington|TX
little elm|TX
caddo mills|TX
red oak|TX
el paso|TX
corpus christi|TX
college station|TX
round rock|TX
cedar park|TX
san marcos|TX
the woodlands|TX
sugar land|TX
missouri city|TX
league city|TX
port arthur|TX
beaumont|TX
wichita falls|TX
san angelo|TX
north richland hills|TX
haltom city|TX
cedar hill|TX
desoto|TX
de soto|TX
duncanville|TX
midlothian|TX
waxahachie|TX
burleson|TX
cleburne|TX
weatherford|TX
granbury|TX
stephenville|TX
brownwood|TX
temple|TX
killeen|TX
copperas cove|TX
harker heights|TX
belton|TX
georgetown|TX
pflugerville|TX
leander|TX
lakeway|TX
bee cave|TX
dripping springs|TX
buda|TX
kyle|TX
lockhart|TX
luling|TX
seguin|TX
schertz|TX
cibolo|TX
boerne|TX
kerrville|TX
fredericksburg|TX
marble falls|TX
burnet|TX
lampasas|TX
gatesville|TX
waco|TX
hewitt|TX
woodway|TX
robinson|TX
lorena|TX
bruceville|TX
corsicana|TX
ennis|TX
terrell|TX
forney|TX
rockwall|TX
rowlett|TX
sachse|TX
wylie|TX
murphy|TX
allen|TX
mckinney|TX
frisco|TX
plano|TX
richardson|TX
garland|TX
mesquite|TX
balch springs|TX
seagoville|TX
lancaster|TX
hutchins|TX
wilmer|TX
ferris|TX
red oak|TX
glenn heights|TX
ovilla|TX
cedar hill|TX
carrollton|TX
farmers branch|TX
addison|TX
coppell|TX
irving|TX
grapevine|TX
southlake|TX
colleyville|TX
keller|TX
trophy club|TX
westlake|TX
roanoke|TX
justin|TX
argyle|TX
denton|TX
sanger|TX
krum|TX
aubrey|TX
celina|TX
prosper|TX
anna|TX
melissa|TX
princeton|TX
farmersville|TX
lewisville|TX
highland village|TX
corinth|TX
lake dallas|TX
the colony|TX
little elm|TX
oak point|TX
cross roads|TX
krum|TX
ponder|TX
decatur|TX
bridgeport|TX
azle|TX
springtown|TX
reno|TX
saginaw|TX
sansom park|TX
lake worth|TX
white settlement|TX
benbrook|TX
aledo|TX
euless|TX
bedford|TX
hurst|TX
north richland hills|TX
watauga|TX
richland hills|TX
haltom city|TX
forest hill|TX
everman|TX
kennedale|TX
mansfield|TX
midlothian|TX
alvarado|TX
venus|TX
joshua|TX
crowley|TX
burleson|TX
fort worth|TX
dallas|TX
arlington|TX
houston|TX
austin|TX
san antonio|TX
pasadena|TX
baytown|TX
deer park|TX
la porte|TX
channelview|TX
humble|TX
atascocita|TX
kingwood|TX
crosby|TX
spring|TX
tomball|TX
cypress|TX
katy|TX
fulshear|TX
rosenberg|TX
pearland|TX
friendswood|TX
alvin|TX
manvel|TX
angie|TX
conroe|TX
montgomery|TX
magnolia|TX
willis|TX
new caney|TX
porter|TX
liberty hill|TX
galveston|TX
texas city|TX
la marque|TX
dickinson|TX
santa fe|TX
alvin|TX
angleton|TX
lake jackson|TX
clute|TX
freeport|TX
brazoria|TX
west columbia|TX
el campo|TX
wharton|TX
bay city|TX
victoria|TX
port lavaca|TX
cuero|TX
yoakum|TX
gonzales|TX
flatonia|TX
schulenburg|TX
la grange|TX
giddings|TX
brenham|TX
bellville|TX
sealy|TX
brookshire|TX
waller|TX
hempstead|TX
prairie view|TX
navasota|TX
bryan|TX
college station|TX
hearne|TX
caldwell|TX
cameron|TX
rockdale|TX
taylor|TX
hutto|TX
manor|TX
elgin|TX
bastrop|TX
smithville|TX
luling|TX
lockhart|TX
san marcos|TX
new braunfels|TX
canyon lake|TX
spring branch|TX
bulverde|TX
garden ridge|TX
selma|TX
universal city|TX
live oak|TX
converse|TX
windcrest|TX
terrell hills|TX
alamo heights|TX
olmos park|TX
castle hills|TX
shavano park|TX
hollywood park|TX
helotes|TX
leon valley|TX
balcones heights|TX
kirby|TX
china grove|TX
elmendorf|TX
st hedwig|TX
la vernia|TX
floresville|TX
pleasanton|TX
jourdanton|TX
poteet|TX
lytle|TX
devine|TX
hondo|TX
castroville|TX
natalia|TX
somerset|TX
von ormy|TX
macdona|TX
bandera|TX
pipe creek|TX
uvalde|TX
eagle pass|TX
del rio|TX
sonora|TX
ozona|TX
fort stockton|TX
pecos|TX
monahans|TX
odessa|TX
midland|TX
big spring|TX
sweetwater|TX
abilene|TX
dyess|TX
snyder|TX
colorado city|TX
lamesa|TX
seminole|TX
andrews|TX
kermit|TX
crane|TX
mccamey|TX
rankin|TX
iraan|TX
alpine|TX
marfa|TX
presidio|TX
van horn|TX
sierra blanca|TX
fabens|TX
socorro|TX
horizon city|TX
el paso|TX
canutillo|TX
anthony|TX
las cruces|NM
alamogordo|NM
roswell|NM
carlsbad|NM
hobbs|NM
clovis|NM
portales|NM
santa fe|NM
albuquerque|NM
rio rancho|NM
los lunas|NM
belen|NM
socorro|NM
truth or consequences|NM
silver city|NM
deming|NM
las vegas|NM
taos|NM
espanola|NM
los alamos|NM
farmington|NM
gallup|NM
grants|NM
lubbock|TX
amarillo|TX
canyon|TX
hereford|TX
dumas|TX
borger|TX
pampa|TX
childress|TX
vernon|TX
burkburnett|TX
iowa park|TX
electra|TX
graham|TX
mineral wells|TX
jacksboro|TX
bowie|TX
nocona|TX
gainesville|TX
valley view|TX
sanger|TX
sherman|TX
denison|TX
pottsboro|TX
whitesboro|TX
collinsville|TX
van alstyne|TX
gunter|TX
bonham|TX
paris|TX
sulphur springs|TX
commerce|TX
greenville|TX
celeste|TX
leonard|TX
blue ridge|TX
melissa|TX
anna|TX
mckinney|TX
princeton|TX
farmersville|TX
royse city|TX
fate|TX
heath|TX
rockwall|TX
quinlan|TX
emory|TX
canton|TX
athens|TX
mabank|TX
gun barrel city|TX
kemp|TX
kaufman|TX
crandall|TX
forney|TX
terrell|TX
wills point|TX
edgewood|TX
grand saline|TX
mineola|TX
lindale|TX
tyler|TX
whitehouse|TX
bullard|TX
jacksonville|TX
rusk|TX
henderson|TX
kilgore|TX
longview|TX
gladewater|TX
gilmer|TX
pittsburg|TX
mount pleasant|TX
mount vernon|TX
winfield|TX
texarkana|TX
atlanta|TX
linden|TX
daingerfield|TX
lone star|TX
jefferson|TX
marshall|TX
hallsville|TX
carthage|TX
beckville|TX
timpson|TX
nacogdoches|TX
lufkin|TX
diboll|TX
huntington|TX
crockett|TX
palestine|TX
frankston|TX
bullard|TX
tyler|TX
chandler|TX
brownsboro|TX
eustace|TX
malakoff|TX
trinidad|TX
kerens|TX
corsicana|TX
rice|TX
streetman|TX
fairfield|TX
teague|TX
mexia|TX
groesbeck|TX
marlin|TX
lott|TX
rosebud|TX
cameron|TX
rockdale|TX
thorndale|TX
thrall|TX
taylor|TX
hutto|TX
round rock|TX
cedar park|TX
leander|TX
liberty hill|TX
bertram|TX
burnet|TX
marble falls|TX
kingsland|TX
llano|TX
brady|TX
mason|TX
junction|TX
kerrville|TX
ingram|TX
comfort|TX
boerne|TX
fair oaks ranch|TX
bulverde|TX
spring branch|TX
canyon lake|TX
new braunfels|TX
san marcos|TX
wimberley|TX
dripping springs|TX
bee cave|TX
lakeway|TX
lago vista|TX
jonestown|TX
leander|TX
cedar park|TX
austin|TX
pflugerville|TX
round rock|TX
georgetown|TX
jarrell|TX
salado|TX
belton|TX
temple|TX
heidenheimer|TX
rogers|TX
buckholts|TX
cameron|TX
milano|TX
gause|TX
franklin|TX
bremond|TX
calvert|TX
hearne|TX
bryan|TX
college station|TX
navasota|TX
anderson|TX
iola|TX
shiro|TX
huntsville|TX
new waverly|TX
willis|TX
conroe|TX
the woodlands|TX
spring|TX
tomball|TX
waller|TX
hempstead|TX
bellville|TX
sealy|TX
weimar|TX
schulenburg|TX
flatonia|TX
moulton|TX
gonzales|TX
nixon|TX
smiley|TX
waelder|TX
harwood|TX
luling|TX
lockhart|TX
martindale|TX
san marcos|TX
kyle|TX
buda|TX
manchaca|TX
onion creek|TX
del valle|TX
mustang ridge|TX
creedmoor|TX
niederwald|TX
uhland|TX
lockhart|TX
mccallen|TX
north mcallen|TX
edinburg|TX
pharr|TX
mission|TX
weslaco|TX
harlingen|TX
brownsville|TX
san benito|TX
la feria|TX
mercedes|TX
donna|TX
alamo|TX
san juan|TX
rio grande city|TX
roma|TX
zapata|TX
laredo|TX
cotulla|TX
pearsall|TX
dilley|TX
crystal city|TX
carrizo springs|TX
eagle pass|TX
dfw|TX
metroplex|TX
houston|TX
dallas|TX
fort worth|TX
san antonio|TX
austin|TX
las vegas|NV
north las vegas|NV
henderson|NV
reno|NV
sparks|NV
carson city|NV
phoenix|AZ
tucson|AZ
mesa|AZ
chandler|AZ
scottsdale|AZ
gilbert|AZ
glendale|AZ
tempe|AZ
peoria|AZ
surprise|AZ
goodyear|AZ
avondale|AZ
buckeye|AZ
casa grande|AZ
maricopa|AZ
florence|AZ
apache junction|AZ
queen creek|AZ
san tan valley|AZ
flagstaff|AZ
prescott|AZ
prescott valley|AZ
sedona|AZ
cottonwood|AZ
kingman|AZ
lake havasu|AZ
bullhead city|AZ
yuma|AZ
sierra vista|AZ
nogales|AZ
show low|AZ
payson|AZ
phx|AZ
los angeles|CA
san diego|CA
san jose|CA
san francisco|CA
sacramento|CA
fresno|CA
long beach|CA
oakland|CA
bakersfield|CA
anaheim|CA
santa ana|CA
riverside|CA
stockton|CA
irvine|CA
chula vista|CA
fremont|CA
san bernardino|CA
modesto|CA
fontana|CA
moreno valley|CA
oxnard|CA
huntington beach|CA
glendale|CA
santa clarita|CA
garden grove|CA
oceanside|CA
rancho cucamonga|CA
ontario|CA
santa rosa|CA
elk grove|CA
corona|CA
lancaster|CA
palmdale|CA
salinas|CA
hayward|CA
pomona|CA
escondido|CA
sunnyvale|CA
torrance|CA
pasadena|CA
orange|CA
fullerton|CA
thousand oaks|CA
visalia|CA
simi valley|CA
concord|CA
roseville|CA
victorville|CA
santa clara|CA
vallejo|CA
berkeley|CA
el monte|CA
downey|CA
costa mesa|CA
inglewood|CA
carlsbad|CA
san mateo|CA
ventura|CA
west covina|CA
norwalk|CA
burbank|CA
richmond|CA
antioch|CA
daly city|CA
temecula|CA
el cajon|CA
rialto|CA
san marcos|CA
compton|CA
jurupa valley|CA
vista|CA
south gate|CA
mission viejo|CA
vacaville|CA
carson|CA
hesperia|CA
redding|CA
santa monica|CA
westminster|CA
santa barbara|CA
chico|CA
newport beach|CA
san leandro|CA
san marcos|CA
whittier|CA
hawthorne|CA
citrus heights|CA
alhambra|CA
tracy|CA
livermore|CA
buena park|CA
menifee|CA
hemet|CA
lakewood|CA
merced|CA
napa|CA
redwood city|CA
bellflower|CA
tustin|CA
mountain view|CA
milpitas|CA
palo alto|CA
folsom|CA
pleasanton|CA
lynwood|CA
union city|CA
apple valley|CA
redlands|CA
turlock|CA
perris|CA
madera|CA
chino hills|CA
alameda|CA
upland|CA
tulare|CA
lake forest|CA
chino|CA
brentwood|CA
san ramon|CA
pittsburg|CA
murrieta|CA
indio|CA
yuba city|CA
davis|CA
camarillo|CA
walnut creek|CA
south san francisco|CA
yorba linda|CA
san clemente|CA
laguna niguel|CA
pico rivera|CA
montebello|CA
lodi|CA
manteca|CA
encinitas|CA
la habra|CA
monterey park|CA
cupertino|CA
gardena|CA
national city|CA
rocklin|CA
petaluma|CA
arcadia|CA
huntington park|CA
san rafael|CA
la mesa|CA
yucaipa|CA
santee|CA
reseda|CA
sherman oaks|CA
van nuys|CA
north hollywood|CA
studio city|CA
encino|CA
tarzana|CA
woodland hills|CA
canoga park|CA
chatsworth|CA
northridge|CA
panorama city|CA
sylmar|CA
pacoima|CA
san fernando|CA
burbank|CA
glendale|CA
pasadena|CA
altadena|CA
monrovia|CA
azusa|CA
covina|CA
west covina|CA
diamond bar|CA
walnut|CA
rowland heights|CA
hacienda heights|CA
la puente|CA
baldwin park|CA
el monte|CA
rosemead|CA
san gabriel|CA
alhambra|CA
monterey park|CA
east los angeles|CA
boyle heights|CA
compton|CA
lynwood|CA
south gate|CA
paramount|CA
bell|CA
bell gardens|CA
cudahy|CA
maywood|CA
huntington park|CA
vernon|CA
commerce|CA
montebello|CA
pico rivera|CA
whittier|CA
la mirada|CA
santa fe springs|CA
norwalk|CA
cerritos|CA
artesia|CA
lakewood|CA
long beach|CA
signal hill|CA
carson|CA
torrance|CA
gardena|CA
lawndale|CA
hawthorne|CA
inglewood|CA
lennox|CA
westchester|CA
el segundo|CA
manhattan beach|CA
hermosa beach|CA
redondo beach|CA
rancho palos verdes|CA
san pedro|CA
wilmington|CA
harbor city|CA
lomita|CA
culver city|CA
marina del rey|CA
venice|CA
santa monica|CA
west hollywood|CA
beverly hills|CA
century city|CA
westwood|CA
brentwood|CA
pacific palisades|CA
malibu|CA
calabasas|CA
agoura hills|CA
westlake village|CA
thousand oaks|CA
simi valley|CA
moorpark|CA
camarillo|CA
oxnard|CA
ventura|CA
santa paula|CA
fillmore|CA
santa clarita|CA
valencia|CA
newhall|CA
canyon country|CA
palmdale|CA
lancaster|CA
quartz hill|CA
rosamond|CA
mojave|CA
tehachapi|CA
bakersfield|CA
delano|CA
wasco|CA
shafter|CA
taft|CA
maricopa|CA
arvin|CA
lamont|CA
fresno|CA
clovis|CA
sanger|CA
selma|CA
kingsburg|CA
reedley|CA
dinuba|CA
visalia|CA
tulare|CA
porterville|CA
hanford|CA
lemoore|CA
coalinga|CA
mendota|CA
kerman|CA
madera|CA
chowchilla|CA
merced|CA
atwater|CA
livingston|CA
turlock|CA
modesto|CA
ceres|CA
ripon|CA
manteca|CA
lathrop|CA
tracy|CA
stockton|CA
lodi|CA
galt|CA
elk grove|CA
sacramento|CA
west sacramento|CA
davis|CA
woodland|CA
dixon|CA
vacaville|CA
fairfield|CA
suisun city|CA
benicia|CA
vallejo|CA
american canyon|CA
napa|CA
calistoga|CA
st helena|CA
sonoma|CA
petaluma|CA
rohnert park|CA
cotati|CA
santa rosa|CA
windsor|CA
healdsburg|CA
cloverdale|CA
ukiah|CA
lakeport|CA
clearlake|CA
napa|CA
novato|CA
san rafael|CA
mill valley|CA
sausalito|CA
tiburon|CA
larkspur|CA
corte madera|CA
san anselmo|CA
fairfax|CA
point reyes|CA
inverness|CA
daly city|CA
south san francisco|CA
san bruno|CA
millbrae|CA
burlingame|CA
san mateo|CA
foster city|CA
belmont|CA
san carlos|CA
redwood city|CA
atherton|CA
menlo park|CA
palo alto|CA
stanford|CA
los altos|CA
mountain view|CA
sunnyvale|CA
santa clara|CA
cupertino|CA
saratoga|CA
campbell|CA
los gatos|CA
san jose|CA
milpitas|CA
fremont|CA
newark|CA
union city|CA
hayward|CA
castro valley|CA
san leandro|CA
san lorenzo|CA
oakland|CA
alameda|CA
berkeley|CA
albany|CA
el cerrito|CA
richmond|CA
san pablo|CA
pinole|CA
hercules|CA
rodeo|CA
crockett|CA
martinez|CA
pleasant hill|CA
concord|CA
walnut creek|CA
lafayette|CA
orinda|CA
moraga|CA
danville|CA
san ramon|CA
dublin|CA
pleasanton|CA
livermore|CA
tracy|CA
brentwood|CA
oakley|CA
antioch|CA
pittsburg|CA
bay point|CA
clayton|CA
san francisco|CA
san fernando valley|CA
mission valley|CA
inland empire|CA
east bay|CA
south bay|CA
orange county|CA
santa cruz|CA
watsonville|CA
capitola|CA
scotts valley|CA
aptos|CA
soquel|CA
monterey|CA
seaside|CA
marina|CA
salinas|CA
carmel|CA
pacific grove|CA
gilroy|CA
morgan hill|CA
hollister|CA
san juan bautista|CA
king city|CA
soledad|CA
greenfield|CA
paso robles|CA
atascadero|CA
san luis obispo|CA
pismo beach|CA
arroyo grande|CA
grover beach|CA
santa maria|CA
lompoc|CA
solvang|CA
buellton|CA
goleta|CA
santa barbara|CA
carpinteria|CA
ventura|CA
ojai|CA
denver|CO
colorado springs|CO
aurora|CO
fort collins|CO
lakewood|CO
thornton|CO
arvada|CO
westminster|CO
pueblo|CO
boulder|CO
greeley|CO
longmont|CO
loveland|CO
grand junction|CO
broomfield|CO
castle rock|CO
commerce city|CO
parker|CO
littleton|CO
northglenn|CO
brighton|CO
wheat ridge|CO
englewood|CO
golden|CO
lafayette|CO
louisville|CO
superior|CO
erie|CO
frederick|CO
firestone|CO
windsor|CO
johnstown|CO
berthoud|CO
estes park|CO
idaho springs|CO
georgetown|CO
silverthorne|CO
frisco|CO
breckenridge|CO
vail|CO
eagle|CO
glenwood springs|CO
aspen|CO
carbondale|CO
durango|CO
pagosa springs|CO
alamosa|CO
pueblo|CO
canon city|CO
florence|CO
penrose|CO
salida|CO
buena vista|CO
leadville|CO
steamboat springs|CO
craig|CO
rifle|CO
parachute|CO
palisade|CO
clifton|CO
montrose|CO
delta|CO
seattle|WA
spokane|WA
tacoma|WA
vancouver|WA
bellevue|WA
kent|WA
everett|WA
renton|WA
spokane valley|WA
federal way|WA
yakima|WA
kirkland|WA
bellingham|WA
kennewick|WA
auburn|WA
pasco|WA
marysville|WA
lakewood|WA
redmond|WA
shoreline|WA
richland|WA
sammamish|WA
burien|WA
olympia|WA
lacey|WA
edmonds|WA
bremerton|WA
puyallup|WA
lynnwood|WA
bothell|WA
longview|WA
issaquah|WA
wenatchee|WA
mount vernon|WA
university place|WA
walla walla|WA
pullman|WA
des moines|WA
sea tac|WA
seatac|WA
tukwila|WA
burien|WA
normandy park|WA
des moines|WA
federal way|WA
milton|WA
fife|WA
sumner|WA
bonney lake|WA
enumclaw|WA
buckley|WA
orting|WA
south hill|WA
spanaway|WA
parkland|WA
lakewood|WA
steilacoom|WA
dupont|WA
lacey|WA
olympia|WA
tumwater|WA
centralia|WA
chehalis|WA
aberdeen|WA
hoquiam|WA
port angeles|WA
sequim|WA
port townsend|WA
oak harbor|WA
anacortes|WA
mount vernon|WA
burlington|WA
sedro woolley|WA
bellingham|WA
ferndale|WA
lynden|WA
blaine|WA
everett|WA
marysville|WA
arlington|WA
stanwood|WA
monroe|WA
sultan|WA
gold bar|WA
snohomish|WA
lake stevens|WA
granite falls|WA
bothell|WA
mill creek|WA
lynnwood|WA
edmonds|WA
mountlake terrace|WA
shoreline|WA
kenmore|WA
woodinville|WA
duvall|WA
carnation|WA
fall city|WA
snoqualmie|WA
north bend|WA
issaquah|WA
sammamish|WA
redmond|WA
kirkland|WA
bellevue|WA
mercer island|WA
renton|WA
newcastle|WA
factoria|WA
kent|WA
covington|WA
maple valley|WA
black diamond|WA
enumclaw|WA
auburn|WA
algona|WA
pacific|WA
sumner|WA
puyallup|WA
edgewood|WA
fife|WA
tacoma|WA
gig harbor|WA
port orchard|WA
bremerton|WA
silverdale|WA
poulsbo|WA
bainbridge island|WA
cowlitz|WA
clark county|WA
king county|WA
snohomish county|WA
portland|OR
salem|OR
eugene|OR
gresham|OR
hillsboro|OR
bend|OR
beaverton|OR
medford|OR
springfield|OR
corvallis|OR
albany|OR
tigard|OR
lake oswego|OR
keizer|OR
grants pass|OR
oregon city|OR
mcminnville|OR
redmond|OR
tualatin|OR
west linn|OR
woodburn|OR
forest grove|OR
newberg|OR
roseburg|OR
klamath falls|OR
ashland|OR
milwaukie|OR
happy valley|OR
troutdale|OR
fairview|OR
wood village|OR
sandy|OR
estacada|OR
canby|OR
wilsonville|OR
sherwood|OR
tualatin|OR
king city|OR
tigard|OR
beaverton|OR
aloha|OR
hillsboro|OR
cornelius|OR
forest grove|OR
banks|OR
north plains|OR
scappoose|OR
st helens|OR
astoria|OR
seaside|OR
cannon beach|OR
tillamook|OR
lincoln city|OR
newport|OR
florence|OR
coos bay|OR
north bend|OR
bandon|OR
brookings|OR
gold beach|OR
grants pass|OR
medford|OR
ashland|OR
central point|OR
eagle point|OR
white city|OR
phoenix|OR
talent|OR
jacksonville|OR
cave junction|OR
roseburg|OR
sutherlin|OR
oakland|OR
drain|OR
cottage grove|OR
creswell|OR
eugene|OR
springfield|OR
junction city|OR
veneta|OR
elmira|OR
florence|OR
corvallis|OR
philomath|OR
albany|OR
lebanon|OR
sweet home|OR
brownsville|OR
harrisburg|OR
junction city|OR
salem|OR
keizer|OR
dallas|OR
independence|OR
monmouth|OR
stayton|OR
silverton|OR
mount angel|OR
woodburn|OR
hubbard|OR
aurora|OR
canby|OR
molalla|OR
oregon city|OR
gladstone|OR
west linn|OR
lake oswego|OR
milwaukie|OR
happy valley|OR
clackamas|OR
damascus|OR
boring|OR
sandy|OR
hood river|OR
the dalles|OR
pendleton|OR
hermiston|OR
umatilla|OR
boardman|OR
la grande|OR
baker city|OR
ontario|OR
nyssa|OR
vale|OR
burns|OR
bend|OR
redmond|OR
prineville|OR
madras|OR
sisters|OR
la pine|OR
sunriver|OR
klamath falls|OR
multnomah|OR
chicago|IL
aurora|IL
naperville|IL
joliet|IL
rockford|IL
springfield|IL
elgin|IL
peoria|IL
champaign|IL
waukegan|IL
cicero|IL
bloomington|IL
arlington heights|IL
evanston|IL
decatur|IL
schaumburg|IL
bolingbrook|IL
palatine|IL
skokie|IL
des plaines|IL
orland park|IL
tinley park|IL
oak lawn|IL
berwyn|IL
mount prospect|IL
normal|IL
wheaton|IL
hoffman estates|IL
oak park|IL
downers grove|IL
glenview|IL
elmhurst|IL
dekalb|IL
lombard|IL
moline|IL
buffalo grove|IL
bartlett|IL
urbana|IL
quincy|IL
crystal lake|IL
plainfield|IL
streamwood|IL
carol stream|IL
romeoville|IL
rock island|IL
hanover park|IL
carpentersville|IL
wheeling|IL
park ridge|IL
addison|IL
calumet city|IL
northbrook|IL
st charles|IL
belleville|IL
woodridge|IL
glendale heights|IL
zion|IL
park forest|IL
matteson|IL
olympia fields|IL
chicago heights|IL
homewood|IL
flossmoor|IL
hazel crest|IL
markham|IL
harvey|IL
phoenix|IL
dolton|IL
south holland|IL
riverdale|IL
blue island|IL
alsip|IL
oak forest|IL
midlothian|IL
crestwood|IL
palos heights|IL
palos hills|IL
orland park|IL
tinley park|IL
oak lawn|IL
burbank|IL
bridgeview|IL
hickory hills|IL
justice|IL
willowbrook|IL
burr ridge|IL
hinsdale|IL
clarendon hills|IL
westmont|IL
downers grove|IL
lisle|IL
naperville|IL
aurora|IL
montgomery|IL
oswego|IL
yorkville|IL
plano|IL
sandwich|IL
somonauk|IL
dekalb|IL
sycamore|IL
genoa|IL
hampshire|IL
huntley|IL
algonquin|IL
lake in the hills|IL
crystal lake|IL
mchenry|IL
woodstock|IL
cary|IL
fox river grove|IL
barrington|IL
lake zurich|IL
kildeer|IL
deer park|IL
long grove|IL
hawthorn woods|IL
mundelein|IL
libertyville|IL
vernon hills|IL
lincolnshire|IL
buffalo grove|IL
arlington heights|IL
rolling meadows|IL
palatine|IL
hoffman estates|IL
streamwood|IL
hanover park|IL
bartlett|IL
wayne|IL
west chicago|IL
st charles|IL
geneva|IL
batavia|IL
north aurora|IL
sugar grove|IL
elburn|IL
maple park|IL
detroit|MI
grand rapids|MI
warren|MI
sterling heights|MI
ann arbor|MI
lansing|MI
flint|MI
dearborn|MI
livonia|MI
troy|MI
westland|MI
farmington hills|MI
kalamazoo|MI
wyoming|MI
southfield|MI
rochester hills|MI
taylor|MI
pontiac|MI
st clair shores|MI
royal oak|MI
novi|MI
dearborn heights|MI
battle creek|MI
saginaw|MI
kentwood|MI
east lansing|MI
roseville|MI
portage|MI
midland|MI
lincoln park|MI
muskegon|MI
holland|MI
bay city|MI
jackson|MI
8 mile|MI
wayne|MI
inkster|MI
redford|MI
ferndale|MI
oak park|MI
hazel park|MI
madison heights|MI
clawson|MI
berkley|MI
huntington woods|MI
pleasant ridge|MI
birmingham|MI
bloomfield hills|MI
west bloomfield|MI
farmington|MI
northville|MI
plymouth|MI
canton|MI
belleville|MI
romulus|MI
wayne|MI
westland|MI
garden city|MI
dearborn|MI
dearborn heights|MI
allen park|MI
melvindale|MI
lincoln park|MI
wyandotte|MI
riverview|MI
trenton|MI
woodhaven|MI
flat rock|MI
rockwood|MI
gibraltar|MI
brownstown|MI
southgate|MI
eacorse|MI
ecorse|MI
river rouge|MI
hamtramck|MI
highland park|MI
harper woods|MI
grosse pointe|MI
eastpointe|MI
roseville|MI
fraser|MI
warren|MI
center line|MI
sterling heights|MI
utica|MI
shelby township|MI
macomb|MI
clinton township|MI
mount clemens|MI
harrison township|MI
new baltimore|MI
chesterfield|MI
richmond|MI
romeo|MI
rochester|MI
rochester hills|MI
auburn hills|MI
pontiac|MI
waterford|MI
clarkston|MI
lake orion|MI
oxford|MI
ortonville|MI
holly|MI
fenton|MI
linden|MI
grand blanc|MI
flint|MI
burton|MI
davison|MI
lapeer|MI
imlay city|MI
atlanta|GA
augusta|GA
columbus|GA
macon|GA
savannah|GA
athens|GA
sandy springs|GA
roswell|GA
johns creek|GA
albany|GA
warner robins|GA
alpharetta|GA
marietta|GA
valdosta|GA
smyrna|GA
dunwoody|GA
rome|GA
east point|GA
peachtree city|GA
gainesville|GA
hinesville|GA
newnan|GA
milton|GA
douglasville|GA
kennesaw|GA
la grange|GA
statesboro|GA
lawrenceville|GA
duluth|GA
norcross|GA
lilburn|GA
snellville|GA
loganville|GA
grayson|GA
buford|GA
sugar hill|GA
suwanee|GA
dacula|GA
braselton|GA
flowery branch|GA
oakwood|GA
gainesville|GA
cumming|GA
canton|GA
woodstock|GA
holly springs|GA
acworth|GA
kennesaw|GA
marietta|GA
smyrna|GA
vinings|GA
austell|GA
powder springs|GA
hiram|GA
dallas|GA
douglasville|GA
lithia springs|GA
mableton|GA
fairburn|GA
union city|GA
college park|GA
east point|GA
hapelville|GA
hapeville|GA
forest park|GA
riverdale|GA
jonesboro|GA
morrow|GA
stockbridge|GA
mcdonough|GA
hampton|GA
locust grove|GA
griffin|GA
fayetteville|GA
peachtree city|GA
tyrone|GA
senoia|GA
newnan|GA
sharpsburg|GA
moreland|GA
grantville|GA
hogansville|GA
la grange|GA
decatur|GA
avondale estates|GA
clarkston|GA
tucker|GA
stone mountain|GA
lithonia|GA
stonecrest|GA
conyers|GA
covington|GA
oxford|GA
social circle|GA
monroe|GA
winder|GA
bethlehem|GA
statham|GA
bogart|GA
watkinsville|GA
athens|GA
winterville|GA
commerce|GA
jefferson|GA
braselton|GA
otp|GA
miami|FL
tampa|FL
orlando|FL
jacksonville|FL
st petersburg|FL
hialeah|FL
tallahassee|FL
fort lauderdale|FL
port st lucie|FL
cape coral|FL
pembroke pines|FL
hollywood|FL
gainesville|FL
miramar|FL
coral springs|FL
clearwater|FL
miami gardens|FL
palm bay|FL
pompano beach|FL
west palm beach|FL
lakeland|FL
davie|FL
miami beach|FL
boca raton|FL
deltona|FL
plantation|FL
sunrise|FL
palm coast|FL
deerfield beach|FL
largo|FL
melbourne|FL
boynton beach|FL
lauderhill|FL
weston|FL
fort myers|FL
kissimmee|FL
homestead|FL
delray beach|FL
tamarac|FL
daytona beach|FL
wellington|FL
north miami|FL
jupiter|FL
ocala|FL
port orange|FL
sanford|FL
margate|FL
coconut creek|FL
sarasota|FL
pensacola|FL
bradenton|FL
palm beach gardens|FL
pinellas park|FL
coral gables|FL
doral|FL
bonita springs|FL
apopka|FL
titusville|FL
north port|FL
oakland park|FL
fort pierce|FL
north lauderdale|FL
cutler bay|FL
altamonte springs|FL
st cloud|FL
greenacres|FL
ormond beach|FL
ocoee|FL
hallandale beach|FL
winter garden|FL
aventura|FL
plant city|FL
royal palm beach|FL
winter haven|FL
riviera beach|FL
clermont|FL
winter springs|FL
estero|FL
broward|FL
dade|FL
miami dade|FL
hillsborough|FL
pinellas|FL
orange county|FL
osceola|FL
seminole|FL
volusia|FL
brevard|FL
lee county|FL
collier|FL
palm beach|FL
new york|NY
brooklyn|NY
queens|NY
bronx|NY
staten island|NY
manhattan|NY
buffalo|NY
rochester|NY
yonkers|NY
syracuse|NY
albany|NY
new rochelle|NY
mount vernon|NY
schenectady|NY
utica|NY
white plains|NY
hempstead|NY
troy|NY
niagara falls|NY
binghamton|NY
freeport|NY
valley stream|NY
long beach|NY
rome|NY
ithaca|NY
poughkeepsie|NY
north tonawanda|NY
jamestown|NY
elmira|NY
long island|NY
nassau|NY
suffolk|NY
westchester|NY
hudson valley|NY
philadelphia|PA
pittsburgh|PA
allentown|PA
reading|PA
erie|PA
scranton|PA
bethlehem|PA
lancaster|PA
harrisburg|PA
altoona|PA
york|PA
state college|PA
wilkes barre|PA
chester|PA
williamsport|PA
easton|PA
lebanon|PA
hazleton|PA
new castle|PA
johnstown|PA
mckeesport|PA
feasterville|PA
bensalem|PA
langhorne|PA
doylestown|PA
warminster|PA
abington|PA
jenkintown|PA
cheltenham|PA
norristown|PA
king of prussia|PA
conshohocken|PA
west chester|PA
media|PA
springfield|PA
upper darby|PA
drexel hill|PA
havertown|PA
ardmore|PA
bryn mawr|PA
wayne|PA
paoli|PA
malvern|PA
exton|PA
downingtown|PA
coatesville|PA
phoenixville|PA
pottstown|PA
lansdale|PA
north wales|PA
doylestown|PA
quakertown|PA
perkasie|PA
sellersville|PA
souderton|PA
harleysville|PA
collegeville|PA
royersford|PA
limerick|PA
oaks|PA
audubon|PA
eagleville|PA
blue bell|PA
fort washington|PA
ambler|PA
glenside|PA
elkins park|PA
rydal|PA
huntingdon valley|PA
southampton|PA
churchville|PA
holland|PA
richboro|PA
newtown|PA
yardley|PA
morrisville|PA
levittown|PA
bristol|PA
croydon|PA
bensalem|PA
trevose|PA
feasterville|PA
langhorne|PA
penndel|PA
hulmeville|PA
newark|NJ
jersey city|NJ
paterson|NJ
elizabeth|NJ
edison|NJ
woodbridge|NJ
lakewood|NJ
toms river|NJ
hamilton|NJ
trenton|NJ
clifton|NJ
camden|NJ
brick|NJ
cherry hill|NJ
passaic|NJ
union city|NJ
old bridge|NJ
middletown|NJ
gloucester|NJ
east orange|NJ
bayonne|NJ
franklin|NJ
north bergen|NJ
vineland|NJ
union|NJ
piscataway|NJ
new brunswick|NJ
jackson|NJ
wayne|NJ
irvington|NJ
parsippany|NJ
howell|NJ
perth amboy|NJ
hoboken|NJ
plainfield|NJ
west new york|NJ
washington township|NJ
east brunswick|NJ
bloomfield|NJ
west orange|NJ
evesham|NJ
bridgewater|NJ
south brunswick|NJ
egg harbor|NJ
manchester|NJ
hackensack|NJ
sayreville|NJ
mount laurel|NJ
berkeley|NJ
north brunswick|NJ
kearny|NJ
linden|NJ
marlboro|NJ
teaneck|NJ
atlantic city|NJ
passaic|NJ
east brunswick|NJ
motorhub|NJ
boston|MA
worcester|MA
springfield|MA
cambridge|MA
lowell|MA
brockton|MA
quincy|MA
lynn|MA
new bedford|MA
fall river|MA
newton|MA
lawrence|MA
somerville|MA
framingham|MA
haverhill|MA
waltham|MA
malden|MA
brookline|MA
plymouth|MA
medford|MA
taunton|MA
chicopee|MA
weymouth|MA
revere|MA
peabody|MA
methuen|MA
barnstable|MA
pittsfield|MA
attleboro|MA
arlington|MA
everett|MA
salem|MA
westfield|MA
leominster|MA
fitchburg|MA
beverly|MA
holyoke|MA
marlborough|MA
woburn|MA
chelsea|MA
braintree|MA
shrewsbury|MA
natick|MA
randolph|MA
watertown|MA
lexington|MA
needham|MA
norwood|MA
dedham|MA
milton|MA
canton|MA
stoughton|MA
bridgewater|MA
easton|MA
mansfield|MA
foxborough|MA
franklin|MA
milford|MA
hopedale|MA
mendon|MA
uxbridge|MA
northbridge|MA
grafton|MA
westborough|MA
southborough|MA
northborough|MA
marlborough|MA
hudson|MA
maynard|MA
acton|MA
concord|MA
lincoln|MA
bedford|MA
burlington|MA
billerica|MA
tewksbury|MA
andover|MA
north andover|MA
methuen|MA
lawrence|MA
haverhill|MA
newburyport|MA
amesbury|MA
salisbury|MA
ipswich|MA
gloucester|MA
rockport|MA
manchester|MA
beverly|MA
danvers|MA
peabody|MA
salem|MA
marblehead|MA
swampscott|MA
lynn|MA
saugus|MA
melrose|MA
wakefield|MA
reading|MA
north reading|MA
wilmington|MA
woburn|MA
winchester|MA
stoneham|MA
medford|MA
somerville|MA
cambridge|MA
arlington|MA
belmont|MA
watertown|MA
newton|MA
wellesley|MA
needham|MA
dover|MA
sherborn|MA
holliston|MA
ashland|MA
framingham|MA
natick|MA
wayland|MA
sudbury|MA
marlborough|MA
minneapolis|MN
st paul|MN
saint paul|MN
rochester|MN
duluth|MN
bloomington|MN
brooklyn park|MN
plymouth|MN
woodbury|MN
maple grove|MN
blaine|MN
lakeville|MN
burnsville|MN
eagan|MN
coon rapids|MN
eden prairie|MN
apple valley|MN
minnetonka|MN
edina|MN
st louis park|MN
mankato|MN
maplewood|MN
moorhead|MN
shakopee|MN
richfield|MN
cottage grove|MN
inver grove heights|MN
andover|MN
brooklyn center|MN
fridley|MN
roseville|MN
shoreview|MN
oakdale|MN
white bear lake|MN
champlin|MN
savage|MN
prior lake|MN
winona|MN
owatonna|MN
austin|MN
faribault|MN
northfield|MN
red wing|MN
hastings|MN
stillwater|MN
forest lake|MN
hugo|MN
lino lakes|MN
circle pines|MN
spring lake park|MN
columbia heights|MN
new hope|MN
crystal|MN
robbinsdale|MN
golden valley|MN
st louis park|MN
hopkins|MN
minnetonka|MN
excelsior|MN
wayzata|MN
orono|MN
long lake|MN
medina|MN
maple plain|MN
independence|MN
delano|MN
buffalo|MN
monticello|MN
big lake|MN
elk river|MN
otsego|MN
albertville|MN
st michael|MN
rogers|MN
dayton|MN
champlin|MN
anoka|MN
ramsey|MN
andover|MN
ham lake|MN
east bethel|MN
bethel|MN
isanti|MN
cambridge|MN
princeton|MN
milaca|MN
mora|MN
hinckley|MN
sandstone|MN
moose lake|MN
cloquet|MN
duluth|MN
superior|WI
hennepin|MN
ramsey county|MN
dakota county|MN
anoka county|MN
washington county|MN
scott county|MN
carver county|MN
milwaukee|WI
madison|WI
green bay|WI
kenosha|WI
racine|WI
appleton|WI
waukesha|WI
eau claire|WI
oshkosh|WI
janesville|WI
west allis|WI
la crosse|WI
sheboygan|WI
wauwatosa|WI
fond du lac|WI
new berlin|WI
wausau|WI
brookfield|WI
greenfield|WI
beloit|WI
oak creek|WI
manitowoc|WI
west bend|WI
sun prairie|WI
superior|WI
stevens point|WI
menomonee falls|WI
germantown|WI
mequon|WI
muskego|WI
caledonia|WI
mount pleasant|WI
franklin|WI
greendale|WI
hales corners|WI
cudahy|WI
st francis|WI
south milwaukee|WI
shorewood|WI
whitefish bay|WI
glendale|WI
brown deer|WI
fox point|WI
bayside|WI
river hills|WI
cedarburg|WI
grafton|WI
port washington|WI
saukville|WI
belgium|WI
random lake|WI
plymouth|WI
sheboygan|WI
kohler|WI
sheboygan falls|WI
elkhart lake|WI
kiel|WI
new holstein|WI
chilton|WI
brillion|WI
appleton|WI
neenah|WI
menasha|WI
kaukauna|WI
kimberly|WI
little chute|WI
combined locks|WI
wrightstown|WI
green bay|WI
de pere|WI
allouez|WI
ashwaubenon|WI
howard|WI
suamico|WI
pulaski|WI
oshkosh|WI
omro|WI
winneconne|WI
berlin|WI
ripon|WI
fond du lac|WI
waupun|WI
beaver dam|WI
columbus|WI
sun prairie|WI
madison|WI
middleton|WI
verona|WI
fitchburg|WI
oregon|WI
stoughton|WI
mcfarland|WI
monona|WI
cottage grove|WI
deerfield|WI
cambridge|WI
fort atkinson|WI
jefferson|WI
johnson creek|WI
watertown|WI
lake mills|WI
whitewater|WI
elkhorn|WI
delavan|WI
lake geneva|WI
williams bay|WI
fontana|WI
walworth|WI
darien|WI
sharon|WI
clinton|WI
beloit|WI
janesville|WI
milton|WI
edgerton|WI
evansville|WI
brodhead|WI
monroe|WI
new glarus|WI
mount horeb|WI
verona|WI
baltimore|MD
frederick|MD
rockville|MD
gaithersburg|MD
bowie|MD
hagerstown|MD
annapolis|MD
college park|MD
salisbury|MD
laurel|MD
greenbelt|MD
cumberland|MD
westminster|MD
hyattsville|MD
takoma park|MD
easton|MD
elkton|MD
aberdeen|MD
bel air|MD
havre de grace|MD
columbia|MD
ellicott city|MD
elkridge|MD
catonsville|MD
towson|MD
dundalk|MD
essex|MD
middle river|MD
parkville|MD
pikesville|MD
owings mills|MD
reisterstown|MD
randallstown|MD
woodlawn|MD
glen burnie|MD
severn|MD
odenton|MD
crofton|MD
gambrills|MD
millersville|MD
severna park|MD
arnold|MD
pasadena|MD
brooklyn park|MD
linthicum|MD
hanover|MD
jessup|MD
savage|MD
laurel|MD
beltsville|MD
college park|MD
riverdale|MD
hyattsville|MD
mount rainier|MD
brentwood|MD
bladensburg|MD
cheverly|MD
landover|MD
capitol heights|MD
district heights|MD
suitland|MD
oxon hill|MD
fort washington|MD
clinton|MD
waldorf|MD
la plata|MD
indian head|MD
accokeek|MD
brandywine|MD
upper marlboro|MD
bowie|MD
glenn dale|MD
lanham|MD
new carrollton|MD
greenbelt|MD
berwyn heights|MD
college park|MD
silver spring|MD
wheaton|MD
kensington|MD
bethesda|MD
chevy chase|MD
potomac|MD
rockville|MD
gaithersburg|MD
germantown|MD
montgomery village|MD
olney|MD
ashton|MD
sandy spring|MD
burtonsville|MD
clarksburg|MD
damascus|MD
poolesville|MD
frederick|MD
walkersville|MD
thurmont|MD
emmitsburg|MD
hagerstown|MD
washington|DC
charlotte|NC
raleigh|NC
greensboro|NC
durham|NC
winston salem|NC
fayetteville|NC
cary|NC
wilmington|NC
high point|NC
concord|NC
asheville|NC
gastonia|NC
jacksonville|NC
chapel hill|NC
rocky mount|NC
burlington|NC
wilson|NC
huntersville|NC
kannapolis|NC
apex|NC
hickory|NC
goldsboro|NC
indian trail|NC
mooresville|NC
wake forest|NC
monroe|NC
salisbury|NC
holly springs|NC
matthews|NC
sanford|NC
new bern|NC
fort bragg|NC
research triangle|NC
columbus|OH
cleveland|OH
cincinnati|OH
toledo|OH
akron|OH
dayton|OH
parma|OH
canton|OH
youngstown|OH
lorain|OH
hamilton|OH
springfield|OH
kettering|OH
elyria|OH
lakewood|OH
cuyahoga falls|OH
middletown|OH
euclid|OH
newark|OH
mansfield|OH
mentor|OH
beavercreek|OH
strongsville|OH
cleveland heights|OH
fairborn|OH
findlay|OH
warren|OH
lancaster|OH
lima|OH
huber heights|OH
westerville|OH
marion|OH
grove city|OH
stow|OH
delaware|OH
reynoldsburg|OH
dublin|OH
upper arlington|OH
gahanna|OH
hillard|OH
worthington|OH
whitehall|OH
bexley|OH
grandview heights|OH
upper arlington|OH
powell|OH
lewis center|OH
sunbury|OH
johnstown|OH
pataskala|OH
pickerington|OH
canal winchester|OH
groveport|OH
obetz|OH
lockbourne|OH
south bloomfield|OH
circleville|OH
chillicothe|OH
washington court house|OH
wilmington|OH
xenia|OH
fairborn|OH
beavercreek|OH
kettering|OH
centerville|OH
springboro|OH
franklin|OH
middletown|OH
monroe|OH
trenton|OH
hamilton|OH
fairfield|OH
west chester|OH
mason|OH
lebanon|OH
loveland|OH
milford|OH
montgomery|OH
blue ash|OH
sharonville|OH
springdale|OH
forest park|OH
north college hill|OH
mount healthy|OH
reading|OH
lockland|OH
wyoming|OH
finneytown|OH
amberley|OH
silverton|OH
norwood|OH
mariemont|OH
madisonville|OH
oakley|OH
hyde park|OH
mount adams|OH
clifton|OH
northside|OH
price hill|OH
delhi|OH
green township|OH
colerain|OH
indianapolis|IN
fort wayne|IN
evansville|IN
south bend|IN
carmel|IN
fishers|IN
bloomington|IN
hammond|IN
gary|IN
muncie|IN
lafayette|IN
terre haute|IN
kokomo|IN
anderson|IN
noblesville|IN
greenwood|IN
elkhart|IN
mishawaka|IN
lawrence|IN
jeffersonville|IN
columbus|IN
portage|IN
new albany|IN
richmond|IN
westfield|IN
valparaiso|IN
goshen|IN
michigan city|IN
lawrence|IN
plainfield|IN
avon|IN
brownsburg|IN
danville|IN
pittsboro|IN
zionsville|IN
whitestown|IN
lebanon|IN
frankfort|IN
crawfordsville|IN
greencastle|IN
brazil|IN
terre haute|IN
vincennes|IN
washington|IN
jasper|IN
huntingburg|IN
boonville|IN
newburgh|IN
evansville|IN
mount vernon|IN
princeton|IN
oakland city|IN
petersburg|IN
nashville|TN
memphis|TN
knoxville|TN
chattanooga|TN
clarksville|TN
murfreesboro|TN
franklin|TN
jackson|TN
johnson city|TN
bartlett|TN
hendersonville|TN
kingsport|TN
collierville|TN
smyrna|TN
cleveland|TN
brentwood|TN
germantown|TN
columbia|TN
la vergne|TN
gallatin|TN
cookeville|TN
mount juliet|TN
lebanon|TN
morristown|TN
oak ridge|TN
maryville|TN
bristol|TN
farragut|TN
shelbyville|TN
tullahoma|TN
springfield|TN
dickson|TN
goodlettsville|TN
white house|TN
portland|TN
gallatin|TN
hendersonville|TN
mount juliet|TN
hermitage|TN
donelson|TN
antioch|TN
nolensville|TN
smyrna|TN
la vergne|TN
murfreesboro|TN
christiana|TN
bell buckle|TN
wartrace|TN
normandy|TN
tullahoma|TN
manchester|TN
mcminnville|TN
sparta|TN
crossville|TN
cookeville|TN
algood|TN
livingston|TN
celina|TN
gainesboro|TN
carthage|TN
hartsville|TN
gallatin|TN
louisville|KY
lexington|KY
bowling green|KY
owensboro|KY
covington|KY
richmond|KY
georgetown|KY
florence|KY
hopkinsville|KY
nicholasville|KY
elizabethtown|KY
henderson|KY
frankfort|KY
independence|KY
jeffersontown|KY
paducah|KY
radcliff|KY
ashland|KY
madisonville|KY
winchester|KY
erlanger|KY
newport|KY
shelbyville|KY
shively|KY
st matthews|KY
middletown|KY
lyndon|KY
hurstbourne|KY
anchorage|KY
prospect|KY
goshen|KY
crestwood|KY
la grange|KY
pewee valley|KY
simpsonville|KY
shelbyville|KY
taylorsville|KY
lawrenceburg|KY
versailles|KY
nicholasville|KY
wilmore|KY
danville|KY
harrodsburg|KY
bardstown|KY
springfield|KY
lebanon|KY
campbellsville|KY
columbia|KY
glasgow|KY
bowling green|KY
scottsville|KY
franklin|KY
russellville|KY
hopkinsville|KY
cadiz|KY
princeton|KY
madisonville|KY
henderson|KY
owensboro|KY
new orleans|LA
baton rouge|LA
shreveport|LA
lafayette|LA
lake charles|LA
kenner|LA
bossier city|LA
monroe|LA
alexandria|LA
houma|LA
marrero|LA
new iberia|LA
slidell|LA
prairieville|LA
ruston|LA
sulphur|LA
hammond|LA
natchitoches|LA
gretna|LA
opelousas|LA
thibodaux|LA
metairie|LA
harvey|LA
westwego|LA
bridge city|LA
waggaman|LA
avondale|LA
destrehan|LA
luling|LA
boutte|LA
hahnville|LA
norco|LA
laplace|LA
reserve|LA
garyville|LA
gramercy|LA
lutcher|LA
donaldsonville|LA
gonzales|LA
prairieville|LA
denham springs|LA
walker|LA
livingston|LA
albany|LA
springfield|LA
ponchatoula|LA
hammond|LA
covington|LA
mandeville|LA
madisonville|LA
abita springs|LA
folsom|LA
bogalusa|LA
slidell|LA
pearl river|LA
picayune|MS
birmingham|AL
montgomery|AL
huntsville|AL
mobile|AL
tuscaloosa|AL
hoover|AL
dothan|AL
auburn|AL
decatur|AL
madison|AL
florence|AL
gadsden|AL
vestavia hills|AL
prattville|AL
phenix city|AL
alabaster|AL
bessemer|AL
enterprise|AL
opelika|AL
homewood|AL
northport|AL
anniston|AL
prichard|AL
athens|AL
daphne|AL
pelham|AL
oxford|AL
albertville|AL
selma|AL
mountain brook|AL
trussville|AL
center point|AL
gardendale|AL
fultondale|AL
irondale|AL
leeds|AL
moody|AL
pell city|AL
talladega|AL
sylacauga|AL
childersburg|AL
clanton|AL
calera|AL
helena|AL
alabaster|AL
pelham|AL
hoover|AL
vestavia hills|AL
homewood|AL
mountain brook|AL
cahaba heights|AL
inverness|AL
greystone|AL
chelsea|AL
columbiana|AL
wilsonville|AL
jackson|MS
gulfport|MS
southaven|MS
hattiesburg|MS
biloxi|MS
meridian|MS
tupelo|MS
olive branch|MS
greenville|MS
horn lake|MS
clinton|MS
pearl|MS
madison|MS
ridgeland|MS
starkville|MS
vicksburg|MS
columbus|MS
pascagoula|MS
brandon|MS
oxford|MS
gautier|MS
ocean springs|MS
long beach|MS
d iberville|MS
diberville|MS
st martin|MS
oklahoma city|OK
tulsa|OK
norman|OK
broken arrow|OK
edmond|OK
lawton|OK
moore|OK
midwest city|OK
enid|OK
stillwater|OK
muskogee|OK
bartlesville|OK
owasso|OK
shawnee|OK
ardmore|OK
ponca city|OK
yukon|OK
duncan|OK
bixby|OK
sapulpa|OK
del city|OK
altus|OK
bethany|OK
sand springs|OK
claremore|OK
mcalester|OK
ada|OK
durant|OK
tahlequah|OK
chickasha|OK
el reno|OK
mustang|OK
guthrie|OK
warr acres|OK
the village|OK
nichols hills|OK
little rock|AR
fort smith|AR
fayetteville|AR
springdale|AR
jonesboro|AR
north little rock|AR
conway|AR
rogers|AR
pine bluff|AR
bentonville|AR
hot springs|AR
benton|AR
texarkana|AR
sherwood|AR
jacksonville|AR
russellville|AR
bella vista|AR
west memphis|AR
paragould|AR
cabot|AR
searcy|AR
van buren|AR
bryant|AR
maumelle|AR
siloam springs|AR
des moines|IA
cedar rapids|IA
davenport|IA
sioux city|IA
iowa city|IA
waterloo|IA
ames|IA
west des moines|IA
council bluffs|IA
ankeny|IA
dubuque|IA
urbandale|IA
cedar falls|IA
marion|IA
bettendorf|IA
mason city|IA
marshalltown|IA
clinton|IA
burlington|IA
ottumwa|IA
fort dodge|IA
muscatine|IA
coralville|IA
johnston|IA
north liberty|IA
waukee|IA
altoona|IA
indianola|IA
newton|IA
grinnell|IA
pella|IA
oskaloosa|IA
fairfield|IA
mount pleasant|IA
keokuk|IA
fort madison|IA
burlington|IA
muscatine|IA
eld ridge|IA
eldridge|IA
le claire|IA
bettendorf|IA
davenport|IA
moline|IL
rock island|IL
omaha|NE
lincoln|NE
bellevue|NE
grand island|NE
kearney|NE
fremont|NE
hastings|NE
norfolk|NE
north platte|NE
columbus|NE
papillion|NE
la vista|NE
scottsbluff|NE
south sioux city|NE
beatrice|NE
lexington|NE
gretna|NE
elkhorn|NE
ralston|NE
chalco|NE
offutt|NE
plattsmouth|NE
nebraska city|NE
auburn|NE
falls city|NE
crete|NE
seward|NE
york|NE
aurora|NE
grand island|NE
wichita|KS
overland park|KS
kansas city|KS
olathe|KS
topeka|KS
lawrence|KS
shawnee|KS
manhattan|KS
lenexa|KS
salina|KS
hutchinson|KS
leavenworth|KS
leawood|KS
dodge city|KS
garden city|KS
emporia|KS
junction city|KS
derby|KS
prairie village|KS
hays|KS
liberal|KS
gardner|KS
pittsburg|KS
newton|KS
great bend|KS
mcpherson|KS
el dorado|KS
ottawa|KS
arkansas city|KS
winfield|KS
wellington|KS
andover|KS
maize|KS
bel aire|KS
park city|KS
valley center|KS
haysville|KS
mulvane|KS
rose hill|KS
augusta|KS
eldorado|KS
kansas city|MO
st louis|MO
saint louis|MO
springfield|MO
columbia|MO
independence|MO
lee s summit|MO
lees summit|MO
o fallon|MO
ofallon|MO
st joseph|MO
saint joseph|MO
st charles|MO
saint charles|MO
st peters|MO
blue springs|MO
joplin|MO
florissant|MO
chesterfield|MO
jefferson city|MO
cape girardeau|MO
wildwood|MO
university city|MO
ballwin|MO
raytown|MO
liberty|MO
wentzville|MO
mehlville|MO
kirkwood|MO
maryland heights|MO
gladstone|MO
grandview|MO
belton|MO
raymore|MO
nixa|MO
ozark|MO
rolla|MO
warrensburg|MO
sedalia|MO
marshall|MO
boonville|MO
fulton|MO
mexico|MO
moberly|MO
kirksville|MO
hannibal|MO
quincy|IL
salt lake city|UT
west valley city|UT
provo|UT
west jordan|UT
orem|UT
sandy|UT
ogden|UT
st george|UT
layton|UT
south jordan|UT
lehi|UT
millcreek|UT
taylorsville|UT
logan|UT
murray|UT
draper|UT
bountiful|UT
riverton|UT
roy|UT
spanish fork|UT
pleasant grove|UT
cottonwood heights|UT
tooele|UT
springville|UT
cedar city|UT
kaysville|UT
clearfield|UT
holladay|UT
midvale|UT
american fork|UT
syr acuse|UT
syracuse|UT
eagle mountain|UT
saratoga springs|UT
herriman|UT
bluffdale|UT
park city|UT
heber|UT
boise|ID
meridian|ID
nampa|ID
idaho falls|ID
caldwell|ID
pocatello|ID
coeur d alene|ID
twin falls|ID
post falls|ID
lewiston|ID
rexburg|ID
eagle|ID
kuna|ID
moscow|ID
garden city|ID
billings|MT
missoula|MT
great falls|MT
bozeman|MT
butte|MT
helena|MT
kalispell|MT
havre|MT
anaconda|MT
miles city|MT
cheyenne|WY
casper|WY
laramie|WY
gillette|WY
rock springs|WY
sheridan|WY
green river|WY
evanston|WY
riverton|WY
jackson|WY
cody|WY
sioux falls|SD
rapid city|SD
aberdeen|SD
brookings|SD
watertown|SD
mitchell|SD
yankton|SD
pierre|SD
huron|SD
vermillion|SD
spearfish|SD
sturgis|SD
lead|SD
deadwood|SD
belle fourche|SD
fargo|ND
bismarck|ND
grand forks|ND
minot|ND
west fargo|ND
williston|ND
dickinson|ND
mandan|ND
jamestown|ND
wahpeton|ND
devils lake|ND
valley city|ND
grafton|ND
anchorage|AK
fairbanks|AK
juneau|AK
wasilla|AK
sitka|AK
kenai|AK
kodiak|AK
bethel|AK
palmer|AK
honolulu|HI
pearl city|HI
hilo|HI
kailua|HI
waipahu|HI
kaneohe|HI
mililani|HI
kahului|HI
ewa beach|HI
kihei|HI
richmond|VA
virginia beach|VA
norfolk|VA
chesapeake|VA
arlington|VA
newport news|VA
alexandria|VA
hampton|VA
roanoke|VA
portsmouth|VA
suffolk|VA
lynchburg|VA
harrisonburg|VA
leesburg|VA
charlottesville|VA
danville|VA
manassas|VA
petersburg|VA
fredericksburg|VA
winchester|VA
salem|VA
staunton|VA
fairfax|VA
herndon|VA
reston|VA
vienna|VA
mclean|VA
tysons|VA
falls church|VA
annandale|VA
springfield|VA
burke|VA
centreville|VA
chantilly|VA
ashburn|VA
sterling|VA
dulles|VA
south riding|VA
gainesville|VA
haymarket|VA
warrenton|VA
culpeper|VA
front royal|VA
strasburg|VA
woodstock|VA
luray|VA
staunton|VA
waynesboro|VA
charlottesville|VA
crozet|VA
ruckersville|VA
orange|VA
gordonsville|VA
louisa|VA
mineral|VA
palmyra|VA
fluvanna|VA
scottsville|VA
lovingston|VA
lynchburg|VA
bedford|VA
roanoke|VA
salem|VA
blacksburg|VA
christiansburg|VA
radford|VA
pulaski|VA
wytheville|VA
bristol|VA
abingdon|VA
marion|VA
galax|VA
martinsville|VA
danville|VA
south boston|VA
halifax|VA
farmville|VA
charlottesville|VA
hampton roads|VA
nova|VA
northern virginia|VA
charleston|WV
huntington|WV
morgantown|WV
parkersburg|WV
wheeling|WV
weirton|WV
fairmont|WV
martinsburg|WV
beckley|WV
clarksburg|WV
south charleston|WV
st albans|WV
vienna|WV
bridgeport|WV
charles town|WV
shepherdstown|WV
harpers ferry|WV
lewisburg|WV
white sulphur springs|WV
princeton|WV
bluefield|WV
wilmington|DE
dover|DE
newark|DE
middletown|DE
smyrna|DE
milford|DE
seaford|DE
georgetown|DE
elsmere|DE
new castle|DE
bear|DE
glasgow|DE
hockessin|DE
pike creek|DE
providence|RI
warwick|RI
cranston|RI
pawtucket|RI
east providence|RI
woonsocket|RI
newport|RI
central falls|RI
west warwick|RI
north providence|RI
cumberland|RI
lincoln|RI
smithfield|RI
north smithfield|RI
burrillville|RI
glocester|RI
scituate|RI
foster|RI
coventry|RI
west greenwich|RI
exeter|RI
richmond|RI
hopkinton|RI
westerly|RI
charlestown|RI
south kingstown|RI
narragansett|RI
north kingstown|RI
jamestown|RI
portsmouth|RI
middletown|RI
tiverton|RI
little compton|RI
bristol|RI
warren|RI
barrington|RI
east greenwich|RI
north kingstown|RI
manchester|NH
nashua|NH
concord|NH
dover|NH
rochester|NH
keene|NH
derry|NH
portsmouth|NH
laconia|NH
lebanon|NH
claremont|NH
somersworth|NH
hampton|NH
exeter|NH
durham|NH
hanover|NH
plymouth|NH
conway|NH
berlin|NH
franklin|NH
salem|NH
windham|NH
hudson|NH
merrimack|NH
bedford|NH
goffstown|NH
hooksett|NH
bow|NH
pembroke|NH
epsom|NH
northwood|NH
nottingham|NH
lee|NH
madbury|NH
newmarket|NH
newfields|NH
stratham|NH
greenland|NH
rye|NH
north hampton|NH
hampton falls|NH
seabrook|NH
south hampton|NH
kensington|NH
east kingston|NH
kingston|NH
newton|NH
plaistow|NH
atkinson|NH
haverhill|NH
portland|ME
lewiston|ME
bangor|ME
south portland|ME
auburn|ME
biddeford|ME
sanford|ME
saco|ME
westbrook|ME
augusta|ME
waterville|ME
brunswick|ME
scarborough|ME
gorham|ME
windham|ME
falmouth|ME
cape elizabeth|ME
yarmouth|ME
freeport|ME
bath|ME
topsham|ME
lisbon|ME
sabattus|ME
greene|ME
leeds|ME
turner|ME
livermore falls|ME
jay|ME
wilton|ME
farmington|ME
skowhegan|ME
waterville|ME
oakland|ME
belgrade|ME
sidney|ME
augusta|ME
hallowell|ME
gardiner|ME
richmond|ME
bowdoinham|ME
bowdoin|ME
harpswell|ME
orrington|ME
brewer|ME
holden|ME
dedham|ME
ellsworth|ME
bar harbor|ME
mount desert|ME
tremont|ME
southwest harbor|ME
burlington|VT
south burlington|VT
rutland|VT
essex junction|VT
barre|VT
montpelier|VT
winooski|VT
st albans|VT
newport|VT
vergennes|VT
middlebury|VT
bennington|VT
brattleboro|VT
springfield|VT
white river junction|VT
hartford|VT
norwich|VT
hanover|NH
woodstock|VT
killington|VT
ludlow|VT
manchester|VT
dorset|VT
arlington|VT
shaftsbury|VT
north bennington|VT
pownal|VT
stamford|VT
readsboro|VT
whitingham|VT
wilmington|VT
dover|VT
newfane|VT
putney|VT
dummerston|VT
brattleboro|VT
hartford|CT
bridgeport|CT
new haven|CT
stamford|CT
waterbury|CT
norwalk|CT
danbury|CT
new britain|CT
west hartford|CT
greenwich|CT
fairfield|CT
hamden|CT
meriden|CT
bristol|CT
manchester|CT
west haven|CT
milford|CT
stratford|CT
east hartford|CT
middletown|CT
wallingford|CT
enfield|CT
southington|CT
shelton|CT
norwich|CT
torrington|CT
trumbull|CT
glastonbury|CT
naugatuck|CT
newington|CT
cheshire|CT
east haven|CT
windsor|CT
new london|CT
ansonia|CT
vernon|CT
wethersfield|CT
new milford|CT
south windsor|CT
ridgefield|CT
simsbury|CT
farmington|CT
avon|CT
canton|CT
burlington|CT
harwinton|CT
litchfield|CT
morris|CT
warren|CT
washington|CT
roxbury|CT
bridgewater|CT
newtown|CT
bethel|CT
redding|CT
easton|CT
monroe|CT
shelton|CT
derby|CT
seymour|CT
beacon falls|CT
oxford|CT
southbury|CT
middlebury|CT
woodbury|CT
bethlehem|CT
watertown|CT
thomaston|CT
plymouth|CT
terryville|CT
bristol|CT
plainville|CT
new britain|CT
berlin|CT
kensington|CT
cromwell|CT
portland|CT
east hampton|CT
colchester|CT
hebron|CT
andover|CT
bolton|CT
manchester|CT
glastonbury|CT
wethersfield|CT
rocky hill|CT
newington|CT
west hartford|CT
bloomfield|CT
windsor|CT
windsor locks|CT
suffield|CT
enfield|CT
somers|CT
elllington|CT
ellington|CT
tolland|CT
vernon|CT
rockville|CT
stafford|CT
union|CT
willington|CT
ashford|CT
mansfield|CT
storrs|CT
coventry|CT
columbia|CT
lebanon|CT
bozrah|CT
franklin|CT
sprague|CT
lisbon|CT
griswold|CT
jewett city|CT
voluntaun|CT
voluntaun|CT
north stonington|CT
stonington|CT
mystic|CT
groton|CT
ledyard|CT
preston|CT
norwich|CT
montville|CT
un casville|CT
uncasville|CT
waterford|CT
new london|CT
east lyme|CT
niantic|CT
old lyme|CT
old saybrook|CT
westbrook|CT
clinton|CT
madison|CT
guilford|CT
branford|CT
north branford|CT
east haven|CT
new haven|CT
west haven|CT
orange|CT
milford|CT
stratford|CT
bridgeport|CT
fairfield|CT
southport|CT
westport|CT
wilton|CT
norwalk|CT
darien|CT
stamford|CT
greenwich|CT
cos cob|CT
riverside|CT
old greenwich|CT
charleston|SC
columbia|SC
north charleston|SC
mount pleasant|SC
rock hill|SC
greenville|SC
summerville|SC
sumter|SC
goose creek|SC
hilton head|SC
florence|SC
spartanburg|SC
myrtle beach|SC
aiken|SC
anderson|SC
greer|SC
mauldin|SC
greenwood|SC
north augusta|SC
easley|SC
simpsonville|SC
hanahan|SC
lexington|SC
conway|SC
west columbia|SC
north myrtle beach|SC
clemson|SC
bluffton|SC
beaufort|SC
port royal|SC
lady s island|SC
ladys island|SC
okatie|SC
hardeeville|SC
ridgeland|SC
walterboro|SC
st george|SC
summerville|SC
moncks corner|SC
goose creek|SC
hanahan|SC
north charleston|SC
charleston|SC
mount pleasant|SC
isle of palms|SC
sullivans island|SC
folly beach|SC
james island|SC
johns island|SC
kiawah|SC
seabrook|SC
hollywood|SC
ravenel|SC
meggett|SC
edisto|SC
walterboro|SC
`.trim();

const ACRONYMS = new Set(["dfw", "phx", "nw", "ne", "sw", "se", "otp", "dc", "sf", "la", "nyc"]);

const STATE_NAME_PATTERNS: { name: string; code: string; re: RegExp }[] = Object.entries({
  "district of columbia": "DC",
  "north carolina": "NC",
  "south carolina": "SC",
  "north dakota": "ND",
  "south dakota": "SD",
  "west virginia": "WV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "rhode island": "RI",
  washington: "WA",
  california: "CA",
  pennsylvania: "PA",
  massachusetts: "MA",
  connecticut: "CT",
  mississippi: "MS",
  tennessee: "TN",
  wisconsin: "WI",
  minnesota: "MN",
  louisiana: "LA",
  kentucky: "KY",
  colorado: "CO",
  arkansas: "AR",
  delaware: "DE",
  illinois: "IL",
  indiana: "IN",
  maryland: "MD",
  michigan: "MI",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  oklahoma: "OK",
  virginia: "VA",
  alabama: "AL",
  arizona: "AZ",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  kansas: "KS",
  nevada: "NV",
  oregon: "OR",
  texas: "TX",
  alaska: "AK",
  idaho: "ID",
  iowa: "IA",
  maine: "ME",
  ohio: "OH",
  utah: "UT",
}).map(([name, code]) => ({
  name,
  code,
  re: new RegExp(`\\b${name}\\b`),
}));

function escapeReg(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PLACES: { phrase: string; code: string; re: RegExp }[] = PLACE_LINES.split("\n")
  .map((line) => {
    const [phrase, code] = line.split("|");
    return { phrase: phrase.trim(), code: code.trim() };
  })
  .filter((p) => p.phrase && ABBR.has(p.code))
  .sort((a, b) => b.phrase.length - a.phrase.length)
  .map((p) => ({ ...p, re: new RegExp(`\\b${escapeReg(p.phrase)}\\b`) }));

const cache = new Map<string, string | null>();
const phraseCache = new Map<string, string | null>();

export function normalizeLocation(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’.]/g, "")
    .replace(/[|/+,()!*#]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trailingState(normalized: string): string | null {
  const match = normalized.match(/(?:^|[\s])([a-z]{2})$/);
  if (!match) return null;
  const code = match[1].toUpperCase();
  if (!ABBR.has(code)) return null;
  // "co" at the end of a county shorthand ("santa cruz co") is not Colorado
  // when a city phrase already explains it. Callers try phrases first.
  return code;
}

function commaState(normalized: string): string | null {
  const match = normalized.match(/,\s*([a-z]{2})\b/);
  if (!match) return null;
  const code = match[1].toUpperCase();
  return ABBR.has(code) ? code : null;
}

export function matchPlacePhrase(raw: string): string | null {
  const key = normalizeLocation(raw);
  const cached = phraseCache.get(key);
  if (cached !== undefined) return cached;
  let found: string | null = null;
  for (const place of PLACES) {
    if (place.re.test(key)) {
      found = place.phrase;
      break;
    }
  }
  phraseCache.set(key, found);
  return found;
}

export function resolveState(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cached = cache.get(raw);
  if (cached !== undefined) return cached;

  const lowered = raw.toLowerCase();
  const normalized = normalizeLocation(raw);
  let state: string | null = null;

  if (normalized && normalized !== "—") {
    state = commaState(lowered);
    if (!state && EXACT[normalized]) state = EXACT[normalized];
    if (!state) {
      for (const place of PLACES) {
        if (place.re.test(normalized)) {
          state = place.code;
          break;
        }
      }
    }
    if (!state) {
      for (const pattern of STATE_NAME_PATTERNS) {
        if (pattern.re.test(normalized)) {
          state = pattern.code;
          break;
        }
      }
    }
    if (!state) {
      const tail = trailingState(normalized);
      if (tail && !(tail === "CO" && /\bco$/.test(normalized) && !normalized.includes("colorado"))) {
        state = tail;
      }
    }
    if (!state) state = areaCodeState(raw);
  }

  cache.set(raw, state);
  return state;
}

export function titleCasePlace(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (ACRONYMS.has(word)) return word.toUpperCase();
      if (word === "st") return "St.";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/** A short city label suitable for a ranked list, or null when the string is junk. */
export function cityLabel(raw: string): string | null {
  if (!resolveState(raw)) return null;
  const trimmed = raw.trim().replace(/\s+/g, " ");
  const comma = trimmed.match(/^([^,\d+][^,]{1,36}?),\s*[A-Za-z]{2}\b/);
  if (comma) {
    const city = comma[1].replace(/^\+\s*/, "").trim();
    if (city && !/\d/.test(city)) return titleCasePlace(city.toLowerCase());
  }
  const phrase = matchPlacePhrase(trimmed);
  if (!phrase || phrase.length > 28 || /\d/.test(phrase)) return null;
  return titleCasePlace(phrase);
}
