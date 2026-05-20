
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  city TEXT NOT NULL DEFAULT 'Hargeisa',
  country TEXT NOT NULL DEFAULT 'Somaliland',
  bio_so TEXT DEFAULT '',
  bio_en TEXT DEFAULT '',
  logo_url TEXT,
  brand_color TEXT DEFAULT '#2d5a27',
  website TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_status TEXT NOT NULL DEFAULT 'none',
  trust_score INTEGER NOT NULL DEFAULT 50,
  completeness INTEGER NOT NULL DEFAULT 20,
  featured BOOLEAN NOT NULL DEFAULT false,
  owner_client_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orgs_category ON public.organizations(category);
CREATE INDEX idx_orgs_city ON public.organizations(city);
CREATE INDEX idx_orgs_owner ON public.organizations(owner_client_id);
CREATE INDEX idx_orgs_score ON public.organizations(trust_score DESC);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert organizations" ON public.organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update organizations" ON public.organizations FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete organizations" ON public.organizations FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_orgs_touch BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.organizations (slug, name, category, city, trust_score, verification_status, completeness, brand_color, bio_en, bio_so, website, phone, whatsapp, email, featured) VALUES
('dahabshiil-bank','Dahabshiil Bank','Banking','Hargeisa',94,'verified',95,'#2d5a27','Somaliland''s leading financial institution. 50 years of remittance heritage and modern digital banking.','Dahabshiil waa bangiga ugu horreeya Somaliland. 50 sano oo khibrad ah.','dahabshiil.com','+252634000001','252634000001','info@dahabshiil.com',true),
('telesom','Telesom','Telecom','Hargeisa',91,'verified',92,'#d4a849','Leading mobile operator and fintech (ZAAD) across Somaliland.','Shirkadda ugu weyn ee taleefoonada gacanta iyo ZAAD.','telesom.com','+252634000002','252634000002','contact@telesom.com',true),
('somtel','Somtel','Telecom','Hargeisa',88,'verified',88,'#5a7fbe','High-speed mobile, internet and digital services.','Adeegyada internetka iyo taleefoonada.','somtel.com','+252634000003','252634000003','hello@somtel.com',false),
('edna-adan','Edna Adan Hospital','Healthcare','Hargeisa',86,'verified',90,'#c0392b','Award-winning maternity hospital founded by Edna Adan Ismail.','Cisbitaalka caanka ah ee Edna Adan.','ednahospital.org','+252634000004','252634000004','info@ednahospital.org',true),
('uoh','University of Hargeisa','Education','Hargeisa',84,'verified',86,'#2d5a7f','Public flagship university of Somaliland.','Jaamacadda dawladda ee Hargeysa.','uoh.edu.so','+252634000005','252634000005','info@uoh.edu.so',false),
('berbera-port','Berbera Port','Logistics','Berbera',82,'official',88,'#1e6091','Strategic Red Sea deep-water port operated with DP World.','Dekeda istaraatijiga ah ee Berbera.','berberaport.so','+252634000006','252634000006','ops@berberaport.so',true),
('premier-bank','Premier Bank','Banking','Hargeisa',80,'verified',82,'#0e7c5a','Modern commercial banking.','Bangi ganacsi casri ah.','premierbank.so','+252634000007','252634000007','info@premierbank.so',false),
('hass-petroleum','Hass Petroleum','Retail','Hargeisa',78,'verified',78,'#b04a2a','Fuel and lubricants distributor.','Saliid iyo shidaal.','hasspetroleum.com','+252634000008','252634000008','info@hass.com',false),
('amoud','Amoud University','Education','Borama',76,'verified',80,'#5b4787','One of Somaliland''s oldest universities.','Jaamacad qadiimi ah.','amouduniversity.org','+252634000009','252634000009','info@amoud.org',false),
('burao-construction','Burao Construction Co.','Construction','Burao',73,'pending',68,'#7a6a3a','Building infrastructure across central Somaliland.','Dhismaha iyo kaabayaasha.','burao-co.com','+252634000010','252634000010','info@burao-co.com',false),
('gollisnet','GollisNet','Technology','Hargeisa',71,'verified',72,'#2d6a8f','ISP and IT services.','Adeegga internetka.','gollisnet.com','+252634000011','252634000011','support@gollisnet.com',false),
('cadaado-ngo','Cadaado NGO','NGO','Hargeisa',68,'verified',70,'#5a8a55','Community development across Somaliland.','Hor u-marka bulshada.',NULL,'+252634000012','252634000012','hello@cadaado.org',false),
('salaam-bank','Salaam Bank','Banking','Hargeisa',77,'verified',79,'#0d6e4f','Islamic banking and finance.','Bangiga Islaamiga ah.','salaambank.com','+252634000013','252634000013','info@salaambank.com',false),
('somcable','Somcable','Telecom','Berbera',74,'verified',76,'#6a3aa0','Fiber backbone connecting Somaliland.','Fiibarka ku xira Somaliland.','somcable.com','+252634000014','252634000014','noc@somcable.com',false),
('manhal','Manhal Hospital','Healthcare','Hargeisa',70,'verified',72,'#a83232','Multi-specialty hospital.','Cisbitaal takhasus.','manhalhospital.com','+252634000015','252634000015','info@manhal.com',false),
('gollis-uni','Gollis University','Education','Hargeisa',72,'verified',74,'#3a4d8a','Private university offering tech and business.','Jaamacad gaar ah.','gollisuniversity.org','+252634000016','252634000016','info@gollis.edu',false),
('hcc','Hargeisa Cultural Centre','NGO','Hargeisa',66,'verified',68,'#6f8a4a','Arts, culture and heritage hub.','Xarunta dhaqanka.','hargeisaculturalcentre.com','+252634000017','252634000017','info@hcc.so',false),
('bashir-trading','Bashir Trading','Retail','Burao',62,'pending',58,'#a05a2c','General trading and wholesale.','Ganacsi guud.',NULL,'+252634000018','252634000018','sales@bashir.com',false),
('m2-studio','M2 Studio','Technology','Hargeisa',81,'verified',86,'#d4a849','Digital authority and brand engineering.','Shirkad teknooloji ah.','m2.studio','+252634000019','252634000019','hello@m2.studio',true),
('berbera-hub','Berbera Logistics Hub','Logistics','Berbera',75,'verified',76,'#1a5380','Warehousing and freight at Berbera corridor.','Bakhaarro iyo gaadiid.','berberahub.so','+252634000020','252634000020','ops@berberahub.so',false),
('borama-clinic','Borama Health Clinic','Healthcare','Borama',64,'pending',60,'#9a3a3a','Primary care clinic in Borama.','Daryeel caafimaad oo aasaasi ah.',NULL,'+252634000021','252634000021','clinic@borama.so',false),
('sahan-construction','Sahan Construction','Construction','Hargeisa',69,'verified',70,'#7a6038','Roads and commercial buildings.','Wadooyin iyo dhismayaal.','sahan.so','+252634000022','252634000022','info@sahan.so',false),
('saryan-foods','Saryan Foods','Retail','Burao',60,'pending',55,'#b06030','Food production and distribution.','Soo saarista cuntada.',NULL,'+252634000023','252634000023','sales@saryan.so',false),
('horyaal-tech','Horyaal Tech','Technology','Hargeisa',67,'verified',68,'#26678a','Software studio building local SaaS.','Shirkad software ah.','horyaal.tech','+252634000024','252634000024','team@horyaal.tech',false),
('borama-mf','Borama Microfinance','Banking','Borama',63,'verified',64,'#0a6b50','Microcredit for small businesses.','Amaah yaryar.',NULL,'+252634000025','252634000025','info@boramamf.so',false),
('sl-beverages','Somaliland Beverages','Retail','Hargeisa',79,'verified',80,'#8a4a2a','Bottled drinks and beverages.','Cabitaanno.','slbeverages.com','+252634000026','252634000026','info@slbeverages.com',false),
('burao-edu','Burao Education Trust','Education','Burao',65,'verified',66,'#4a3a8a','Scholarships and school programs.','Deeqo waxbarasho.',NULL,'+252634000027','252634000027','info@buraoedu.so',false),
('hargeisa-shipping','Hargeisa Shipping','Logistics','Hargeisa',71,'verified',72,'#16517a','Freight forwarding and customs clearance.','Gaadiidka iyo gumrukka.','hargeisashipping.com','+252634000028','252634000028','ops@hargeisashipping.com',false);
